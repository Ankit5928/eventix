package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleEventDTO {
    private String attendeeName;
    private Double amount;
    private String eventTitle;
}