package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class TicketValidationResponse {
    private String status; // VALID, INVALID, ALREADY_CHECKED_IN
    private String message;
    private UUID ticketId;
    private String attendeeName;
    private String eventTitle;
    private String categoryName;
}