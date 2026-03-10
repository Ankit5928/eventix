package com.bluepal.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationSummaryDTO {
    private Double totalRevenue;
    private Long totalEvents;
    private Long activeEvents;
    private Long totalTicketsSold;
    private List<UpcomingEventDTO> upcomingEvents;

    @Data
    @Builder
    public static class UpcomingEventDTO {
        private Long eventId;
        private String title;
        private String startDate;
        private Long ticketsSold;
    }
}