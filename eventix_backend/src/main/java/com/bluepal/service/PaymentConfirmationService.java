package com.bluepal.service;

import com.bluepal.dto.response.OrderResponse;
import com.bluepal.modal.*;
import com.bluepal.repository.OrderRepository;
import com.bluepal.repository.PaymentRepository;
import com.bluepal.repository.ReservationRepository;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Handles the full post-payment fulfillment flow:
 * Payment record → Order creation → Ticket generation → Email delivery.
 * Called by the frontend after Stripe payment succeeds (since webhooks may not
 * be configured in local development).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentConfirmationService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final OrderService orderService;
    private final QRCodeService qrCodeService;
    private final PDFTicketService pdfTicketService;
    private final EmailService emailService;

    @Transactional
    public OrderResponse confirmPaymentAndFulfill(String paymentIntentId, UUID reservationId) {
        // 1. Check if already processed (idempotency)
        if (orderRepository.existsByReservationId(reservationId)) {
            Order existing = orderRepository.findByReservationId(reservationId);
            log.info("Order already exists for reservation {}, returning existing.", reservationId);
            return orderService.getOrderDetails(existing.getId());
        }

        // 2. Find or create Payment record
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseGet(() -> {
                    // Create payment record if webhook didn't create one
                    Payment p = Payment.builder()
                            .id(UUID.randomUUID())
                            .reservation(reservation)
                            .stripePaymentIntentId(paymentIntentId)
                            .amountInCents((long) (getReservationTotal(reservation) * 100))
                            .currency("usd")
                            .status(PaymentStatus.SUCCEEDED)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return paymentRepository.save(p);
                });

        // Mark payment as succeeded if it wasn't already
        if (payment.getStatus() != PaymentStatus.SUCCEEDED) {
            payment.setStatus(PaymentStatus.SUCCEEDED);
            paymentRepository.save(payment);
        }

        // 3. Create Order via OrderService (handles order items + notification)
        OrderResponse orderResponse = orderService.createOrder(payment.getId());

        // 4. Fetch order entity for ticket generation
        Order order = orderRepository.findById(orderResponse.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found after creation"));

        // 5. Generate tickets
        List<Ticket> tickets = generateTicketsForOrder(order, reservation);

        // 6. Generate PDF
        try {
            String pdfPath = pdfTicketService.generateTicketPDF(order, tickets);
            order.setPdfPath(pdfPath);
            orderRepository.save(order);
        } catch (Exception e) {
            log.error("PDF generation failed for order {}: {}", order.getId(), e.getMessage());
        }

        // 7. Send confirmation email
        try {
            emailService.sendTicketEmail(
                    reservation.getAttendeeEmail(),
                    reservation.getAttendeeName(),
                    reservation.getEvent().getTitle(),
                    reservation.getEvent().getStartDate().toString(),
                    reservation.getEvent().getLocation(),
                    order.getPdfPath(),
                    order.getId()
            );
        } catch (Exception e) {
            log.error("Email delivery failed for order {}: {}", order.getId(), e.getMessage());
        }

        log.info("Payment confirmed and order fulfilled: {} for reservation: {}", order.getId(), reservationId);
        return orderResponse;
    }

    private List<Ticket> generateTicketsForOrder(Order order, Reservation res) {
        List<Ticket> ticketsToSave = new ArrayList<>();

        res.getItems().forEach(resItem -> {
            for (int i = 0; i < resItem.getQuantity(); i++) {
                UUID ticketId = UUID.randomUUID();
                // Generate a 12-digit numeric ticket code
                String ticketCode = String.format("%012d", java.util.concurrent.ThreadLocalRandom.current().nextLong(100000000000L, 1000000000000L));

                String qrPath = qrCodeService.generateQRCode(ticketId, ticketCode);

                Ticket ticket = Ticket.builder()
                        .id(ticketId)
                        .order(order)
                        .ticketCategory(resItem.getTicketCategory())
                        .ticketCode(ticketCode)
                        .qrCodePath(qrPath)
                        .checkedIn(false)
                        .createdAt(LocalDateTime.now())
                        .attendeeName(res.getAttendeeName())
                        .attendeeEmail(res.getAttendeeEmail())
                        .build();
                ticketsToSave.add(ticket);
            }
        });

        return ticketRepository.saveAll(ticketsToSave);
    }

    private double getReservationTotal(Reservation reservation) {
        return reservation.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getPriceAtReservation())
                .sum();
    }
}
