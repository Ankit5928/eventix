package com.bluepal.service;

import com.bluepal.modal.Reservation;
import com.bluepal.repository.ReservationRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeService {

    private final ReservationRepository reservationRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    @PostConstruct
    public void init() {

        if (stripeApiKey == null || stripeApiKey.isBlank()) {
            throw new IllegalStateException("Stripe API key is not configured!");
        }

        if (stripePublishableKey == null || stripePublishableKey.isBlank()) {
            throw new IllegalStateException("Stripe publishable key is not configured!");
        }

        Stripe.apiKey = stripeApiKey;

        log.info("Stripe initialized successfully");
    }

    public String createCheckoutSession(UUID reservationId) {

        try {

            log.info("Creating Stripe checkout session for reservation: {}", reservationId);

            Reservation reservation = reservationRepository
                    .findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            if (reservation.getEvent() == null) {
                throw new RuntimeException("Event not found for reservation");
            }

            // Safe event title
            String eventTitle = Optional.ofNullable(reservation.getEvent().getTitle())
                    .filter(title -> !title.isBlank())
                    .orElse("Event Ticket");

            // Safe amount calculation
            double total = reservation.calculateTotal();

            if (total <= 0) {
                throw new RuntimeException("Invalid reservation amount");
            }

            long amount = Math.round(total * 100); // Stripe expects cents

            log.info("Event title: {}", eventTitle);
            log.info("Amount (cents): {}", amount);

            SessionCreateParams params =
                    SessionCreateParams.builder()

                            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)

                            .setMode(SessionCreateParams.Mode.PAYMENT)

                            .setSuccessUrl(
                                    "http://localhost:4200/checkout/success?reservationId="
                                            + reservationId)

                            .setCancelUrl(
                                    "http://localhost:4200/checkout/cancel")

                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()

                                            .setQuantity(1L)

                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()

                                                            .setCurrency("usd")

                                                            .setUnitAmount(amount)

                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()

                                                                            .setName("Tickets for " + eventTitle)

                                                                            .build())

                                                            .build())

                                            .build())

                            .putMetadata("reservation_id", reservationId.toString())

                            .build();

            Session session = Session.create(params);

            log.info("Stripe session created successfully: {}", session.getId());

            return session.getId();

        } catch (StripeException e) {

            log.error("Stripe API error", e);
            throw new RuntimeException("Stripe API Error: " + e.getMessage());

        } catch (Exception e) {

            log.error("Failed to create Stripe session", e);
            throw new RuntimeException("Stripe Session Error: " + e.getMessage());
        }
    }
}