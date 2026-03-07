package com.bluepal.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateTicketTypeRequest {

    private String name;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private LocalDateTime saleStart;

    private LocalDateTime saleEnd;

}