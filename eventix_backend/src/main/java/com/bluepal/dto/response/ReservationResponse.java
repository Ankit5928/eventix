package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private UUID reservationId;
    private Long eventId;
    private String eventTitle;
    private LocalDateTime expiresAt;
    private String status;
    private Double totalAmount;
    private List<ItemDto> items;

    @Data
    @Builder
    public static class ItemDto {
        private String categoryName;
        private Integer quantity;
        private Double price;
        private Double subtotal;
    }
}