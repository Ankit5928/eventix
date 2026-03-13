package com.bluepal.controller;

import com.bluepal.dto.request.PaymentRequest;
import com.bluepal.dto.response.OrderResponse;
import com.bluepal.dto.response.PaymentIntentResponse;
import com.bluepal.service.PaymentConfirmationService;
import com.bluepal.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentConfirmationService paymentConfirmationService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createIntent(@Valid @RequestBody PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request.getReservationId()));
    }

    /**
     * Called by the frontend after Stripe confirms payment was successful.
     * This creates the Payment record, Order, Tickets, and sends the confirmation email.
     */
    @PostMapping("/confirm-payment")
    public ResponseEntity<OrderResponse> confirmPayment(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        String reservationId = request.get("reservationId");

        if (paymentIntentId == null || reservationId == null) {
            throw new RuntimeException("paymentIntentId and reservationId are required");
        }

        OrderResponse order = paymentConfirmationService.confirmPaymentAndFulfill(
                paymentIntentId, UUID.fromString(reservationId));

        return ResponseEntity.ok(order);
    }
}
