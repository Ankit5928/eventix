package com.bluepal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PaymentRequest {
    @NotNull
    private UUID reservationId;
}