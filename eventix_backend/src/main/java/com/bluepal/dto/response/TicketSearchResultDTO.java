package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TicketSearchResultDTO {
    private UUID ticketCode;
    private String attendeeName;
    private String categoryName;
    private boolean checkedIn;
    private LocalDateTime checkedInAt;
}