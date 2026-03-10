package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CheckInStatsDTO {
    private Long totalTickets;
    private Long checkedInCount;
    private Long pendingCount;
    private Double checkInPercentage;
    private List<CategoryBreakdownDTO> categoryBreakdown;

    @Data
    @AllArgsConstructor
    public static class CategoryBreakdownDTO {
        private String categoryName;
        private Long checkedIn;
        private Long total;
    }
}