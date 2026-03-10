package com.bluepal.controller;

import com.bluepal.dto.request.PaymentRequest;
import com.bluepal.dto.response.PaymentIntentResponse;
import com.bluepal.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createIntent(@Valid @RequestBody PaymentRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request.getReservationId()));
    }
}
