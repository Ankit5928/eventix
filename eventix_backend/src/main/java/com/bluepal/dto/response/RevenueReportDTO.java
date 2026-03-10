package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportDTO {
    private Long eventId;
    private String eventName;
    private Double totalRevenue;
    private Long ticketsSold;
    private Double avgTicketPrice;
}