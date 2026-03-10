package com.bluepal.service;



import com.bluepal.modal.Reservation;
import com.bluepal.repository.ReservationRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeService {

    private final ReservationRepository reservationRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
        log.info("Stripe API key initialized for Eventix");
    }

    public String createCheckoutSession(UUID reservationId) {
        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            log.info("Creating Stripe session for Reservation {}", reservationId);

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    // Success/Cancel URLs point back to your Angular app
                    .setSuccessUrl("http://localhost:4200/checkout/success?id=" + reservationId)
                    .setCancelUrl("http://localhost:4200/checkout/cancel")
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount((long) (reservation.calculateTotal() * 100)) // Amount in cents
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Tickets for " + reservation.getEvent().getTitle())
                                            .build())
                                    .build())
                            .setQuantity(1L)
                            .build())
                    // Metadata is critical for the Webhook to find the reservation later
                    .putMetadata("reservation_id", reservationId.toString())
                    .build();

            Session session = Session.create(params);
            return session.getId();

        } catch (Exception e) {
            log.error("Failed to create Stripe session", e);
            throw new RuntimeException("Stripe Session Error", e);
        }
    }
}