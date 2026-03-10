package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderResponse {
    private UUID orderId;
    private Double totalAmount;
    private String attendeeName;
    private String attendeeEmail;
    private String eventTitle;
    private List<OrderItemDto> items;

    @Data
    @Builder
    public static class OrderItemDto {
        private String categoryName;
        private Integer quantity;
        private Double price;
        private Double subtotal;
    }
}