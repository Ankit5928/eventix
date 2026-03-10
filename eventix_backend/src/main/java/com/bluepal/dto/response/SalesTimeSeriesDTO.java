package com.bluepal.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesTimeSeriesDTO {
    private String date; // Formatted date string based on grouping
    private Long ordersCount;
    private Long ticketsSold;
    private Double revenue;
}