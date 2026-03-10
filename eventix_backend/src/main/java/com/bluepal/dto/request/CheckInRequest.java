package com.bluepal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckInRequest {
    @NotNull(message = "Ticket code is required")
    private String ticketCode;
}
