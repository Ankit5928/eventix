package com.bluepal.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateTicketCategoryRequest {

    private String name;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private LocalDateTime saleStart;

    private LocalDateTime saleEnd;

    private Integer quantityTotal; // Ensure this is exactly "quantityTotal"
    private LocalDateTime salesStart; // Ensure this is exactly "salesStart"
    private LocalDateTime salesEnd;

}