package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderItemDTO {
    private String categoryName;
    private Integer quantity;
    private Double priceAtReservation; // T2: Uses the frozen price
    private Double subtotal; // T5: quantity * priceAtReservation
}

