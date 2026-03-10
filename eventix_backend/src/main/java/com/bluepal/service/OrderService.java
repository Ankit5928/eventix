package com.bluepal.service;


import com.bluepal.dto.response.OrderResponse;
import com.bluepal.dto.response.SaleEventDTO;
import com.bluepal.modal.*;
import com.bluepal.repository.OrderRepository;
import com.bluepal.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Transactional
    public OrderResponse createOrder(UUID paymentId) {
        // T16: Fetch Payment and associated Reservation
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        // T28: Idempotency check - prevent duplicate orders for one reservation
        if (orderRepository.existsByReservationId(payment.getReservation().getId())) {
            return mapToResponse(orderRepository.findByReservationId(payment.getReservation().getId()));
        }

        Reservation res = payment.getReservation();

        // T18-T20: Create and configure Order entity
        Order order = Order.builder()
                .reservation(res)
                .payment(payment)
                .totalAmount(payment.getAmountInCents() / 100.0)
                .status(OrderStatus.CONFIRMED)
                .build();

        // T21-T23: Snapshot Reservation Items into Order Items
        List<OrderItem> orderItems = res.getItems().stream().map(resItem ->
                OrderItem.builder()
                        .order(order)
                        .ticketCategoryId(resItem.getTicketCategory().getId())
                        .quantity(resItem.getQuantity())
                        .pricePaid(resItem.getPriceAtReservation()) // Use frozen price
                        .subtotal(resItem.getQuantity() * resItem.getPriceAtReservation())
                        .build()
        ).collect(Collectors.toList());

        order.setItems(orderItems);

        // T24: Update Reservation status
        res.setStatus(ReservationStatus.CONFIRMED);

        Order savedOrder = orderRepository.save(order);

        try {
            // We get the organization ID via Reservation -> Event -> Organization
            Long organizationId = res.getEvent().getOrganization().getId();

            // Prepare the payload for the SSE stream
            SaleEventDTO saleNotification = SaleEventDTO.builder()
                    .attendeeName(savedOrder.getReservation().getAttendeeName())
                    .amount(savedOrder.getTotalAmount())
                    .eventTitle(res.getEvent().getTitle())
                    .build();

            notificationService.publishSaleNotification(organizationId, saleNotification);

        } catch (Exception e) {
            // T10: Handle gracefully - don't fail the order if the notification fails
            log.error("Failed to send real-time notification for order {}: {}", savedOrder.getId(), e.getMessage());
        }

        // T31: Return the DTO using your specific structure
        return mapToResponse(savedOrder);
    }

    // T31: Add this to allow the Controller to fetch order details by ID
    public OrderResponse getOrderDetails(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        return mapToResponse(order);
    }

    // EM-TICKET-GEN-006-T4: Secure PDF path retrieval for the download endpoint
    public String getSecurePdfPath(UUID orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Security check: verify the email matches the person who bought the tickets
        if (!order.getReservation().getAttendeeEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized: This email does not have access to this order.");
        }

        if (order.getPdfPath() == null) {
            throw new RuntimeException("Ticket PDF has not been generated yet.");
        }

        return order.getPdfPath();
    }

    // T28: Helper for the idempotency check in createOrder
    private Order findByReservationId(UUID reservationId) {
        // You'll need to add this method signature to your OrderRepository as well
        return orderRepository.findByReservationId(reservationId);
    }
    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .attendeeName(order.getReservation().getAttendeeName())
                .attendeeEmail(order.getReservation().getAttendeeEmail())
                .eventTitle(order.getReservation().getEvent().getTitle())
                .items(order.getItems().stream().map(item ->
                        OrderResponse.OrderItemDto.builder()
                                .categoryName("General") // Note: You may need a join here to get the actual name
                                .quantity(item.getQuantity())
                                .price(item.getPricePaid())
                                .subtotal(item.getSubtotal())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}