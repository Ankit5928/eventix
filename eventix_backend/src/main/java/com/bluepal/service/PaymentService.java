package com.bluepal.service;

import com.bluepal.dto.response.PaymentIntentResponse;
import com.bluepal.modal.Organization;
import com.bluepal.modal.Reservation;
import com.bluepal.repository.ReservationRepository;
import com.bluepal.security.EncryptionService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final ReservationService reservationService;
    private final OrganizationService organizationService;
    private final EncryptionService encryptionService;
    private final ReservationRepository reservationRepository;

    @Transactional
    public PaymentIntentResponse createPaymentIntent(UUID reservationId) throws Exception {
        // 1. Validate Reservation (EM-RESERVE-006-T4)
        reservationService.validateReservationForPayment(reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // 2. Get Organization Stripe Keys
        Organization org = reservation.getEvent().getOrganization();
        String encryptedSecretKey = org.getStripeSecretKey();
        String secretKey = encryptionService.decrypt(encryptedSecretKey);

        // 3. Initialize Stripe with Org's Private Key
        Stripe.apiKey = secretKey;

        // 4. Calculate Amount in Cents (Stripe uses smallest currency unit)
        long amountInCents = (long) (reservationService.getReservationSummary(reservationId).getTotalAmount() * 100);

        // 5. Create PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd") // Or fetch from event settings
                .putMetadata("reservation_id", reservationId.toString())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        return new PaymentIntentResponse(intent.getClientSecret(), org.getStripePublishableKey());
    }
}
