package com.bluepal.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ReservationRequest {

    @NotEmpty(message = "At least one ticket must be selected")
    private List<TicketItemRequest> items;

    @Data
    public static class TicketItemRequest {
        @NotNull(message = "Ticket category ID is required")
        private UUID ticketCategoryId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

    }
}