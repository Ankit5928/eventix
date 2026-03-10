package com.bluepal.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSummaryDTO {
    private Double totalRevenue;
    private Long ticketsSold;
    private Long ticketsRemaining;
    private Double checkInRate;
    private List<RecentOrderDTO> recentOrders;

    @Data
    @Builder
    public static class RecentOrderDTO {
        private String attendeeName;
        private Double amount;
        private String status;
        private String createdAt;
    }
}