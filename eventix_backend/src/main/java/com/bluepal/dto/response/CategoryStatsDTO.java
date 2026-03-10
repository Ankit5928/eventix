package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CategoryStatsDTO {
    private UUID categoryId;
    private String name;
    private Integer total;
    private Integer sold;
    private Integer available;
    private BigDecimal revenue; // EM-TICKET-005-T4: Performance metric
}