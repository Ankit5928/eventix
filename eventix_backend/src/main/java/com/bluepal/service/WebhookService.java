package com.bluepal.service;

import com.bluepal.dto.response.OrderResponse;
import com.bluepal.modal.*;
import com.bluepal.repository.OrderRepository;
import com.bluepal.repository.PaymentRepository;
import com.bluepal.repository.ReservationRepository;
import com.bluepal.repository.TicketRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final QRCodeService qrCodeService;
    private final PDFTicketService pdfTicketService;
    private final OrderService orderService; // T26: Injected for delegation
    private final EmailService emailService; // EM-TICKET-GEN-004

    @Transactional
    public void handleStripeEvent(Event event) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

        if (dataObjectDeserializer.getObject().isPresent()) {
            switch (event.getType()) {
                case "checkout.session.completed":
                    Session session = (Session) dataObjectDeserializer.getObject().get();
                    handleCheckoutSuccess(session);
                    break;

                case "payment_intent.payment_failed":
                    PaymentIntent intent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                    log.error("Payment failed for Intent: {}. Reason: {}",
                            intent.getId(), intent.getLastPaymentError().getMessage());
                    // Optional: Call reservationService.releaseReservation if needed here
                    break;

                default:
                    log.info("Unhandled event type: {}", event.getType());
            }
        }
    }

    @Transactional
    protected void handleCheckoutSuccess(Session session) {
        // 1. Identify the Reservation ID from metadata
        String resIdStr = session.getMetadata().get("reservation_id");
        if (resIdStr == null) {
            log.error("Missing reservation_id in session metadata for session: {}", session.getId());
            return;
        }
        UUID resId = UUID.fromString(resIdStr);

        // 2. EM-PAY-003: Update or Create Payment record
        Payment payment = paymentRepository.findByStripePaymentIntentId(session.getPaymentIntent())
                .map(p -> {
                    p.setStatus(PaymentStatus.SUCCEEDED);
                    return paymentRepository.save(p);
                })
                .orElseGet(() -> {
                    Reservation res = reservationRepository.findById(resId)
                            .orElseThrow(() -> new RuntimeException("Reservation not found"));
                    return createDefaultPayment(res, session);
                });

        // 3. EM-PAY-005: Delegate Order Creation to OrderService (T26)
        // This method handles idempotency, snapshots, and updating reservation status
        // to CONFIRMED
        OrderResponse orderResponse = orderService.createOrder(payment.getId());

        // 4. Fetch the Order Entity to attach Tickets and PDF
        Order order = orderRepository.findById(orderResponse.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found after creation"));

        // 5. EM-TICKET-GEN-001/002: Generate Individual Tickets and QR Codes
        List<Ticket> generatedTickets = generateTicketsForOrder(order, order.getReservation());

        // 6. EM-TICKET-GEN-003: Generate PDF and update Order record
        String pdfPath = pdfTicketService.generateTicketPDF(order, generatedTickets);
        order.setPdfPath(pdfPath);
        orderRepository.save(order);

        // 7. EM-TICKET-GEN-004: Async Email Delivery
        try {
            String ticketCode = generatedTickets.isEmpty() ? "" : generatedTickets.get(0).getTicketCode();
            String qrPath = generatedTickets.isEmpty() ? null : generatedTickets.get(0).getQrCodePath();

            emailService.sendTicketEmail(
                    order.getReservation().getAttendeeEmail(),
                    order.getReservation().getAttendeeName(),
                    order.getReservation().getEvent().getTitle(),
                    order.getReservation().getEvent().getStartDate().toString(),
                    order.getReservation().getEvent().getLocation(),
                    pdfPath,
                    order.getId(),
                    ticketCode,
                    qrPath);
        } catch (Exception e) {
            log.error("Order fulfilled but email delivery failed: {}", e.getMessage());
        }

        log.info("Successfully fulfilled Order: {} for Reservation: {}", order.getId(), resId);
    }

    private List<Ticket> generateTicketsForOrder(Order order, Reservation res) {
        List<Ticket> ticketsToSave = new ArrayList<>();

        res.getItems().forEach(resItem -> {
            for (int i = 0; i < resItem.getQuantity(); i++) {
                UUID ticketId = UUID.randomUUID();
                // Generate a 12-digit numeric ticket code
                String ticketCode = String.format("%012d",
                        java.util.concurrent.ThreadLocalRandom.current().nextLong(100000000000L, 1000000000000L));

                // T10: Save QR code file
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

    private Payment createDefaultPayment(Reservation res, Session session) {
        Payment payment = Payment.builder()
                .id(UUID.randomUUID())
                .reservation(res)
                .stripePaymentIntentId(session.getPaymentIntent())
                .amountInCents(session.getAmountTotal())
                .currency(session.getCurrency())
                .status(PaymentStatus.SUCCEEDED)
                .createdAt(LocalDateTime.now())
                .build();
        return paymentRepository.save(payment);
    }
}