package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ReservationSummaryDTO {
    private UUID reservationId;
    private String eventName;
    private String eventDate;
    private String attendeeName;
    private String attendeeEmail;
    private List<OrderItemDTO> items;
    private Double totalAmount; // T6: Grand total
    private String expiresAt;
}
