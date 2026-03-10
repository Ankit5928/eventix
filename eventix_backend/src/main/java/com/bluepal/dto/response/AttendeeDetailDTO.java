package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AttendeeDetailDTO {
    // Attendee Info
    private String name;
    private String email;

    // Order Info
    private UUID orderId;
    private LocalDateTime orderDate;
    private Double orderTotal;

    // Current Ticket & Event Info
    private String eventTitle;
    private String categoryName;
    private boolean checkedIn;
    private LocalDateTime checkedInAt;

    // T5: All tickets in this same order (for group bookings)
    private List<OrderTicketDTO> otherTicketsInOrder;

    @Data
    @Builder
    public static class OrderTicketDTO {
        private UUID ticketId;
        private String attendeeName;
        private String categoryName;
        private boolean checkedIn;
    }
}