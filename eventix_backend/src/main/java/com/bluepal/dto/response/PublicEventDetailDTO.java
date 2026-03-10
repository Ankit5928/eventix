package com.bluepal.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicEventDetailDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private String venueDetails;
    private String imageUrl;

    // T2: Nested Ticket Categories
    private List<PublicTicketCategoryDTO> ticketCategories;

    @Data
    @Builder
    public static class PublicTicketCategoryDTO {
        private UUID id;
        private String name;
        private String description;
        private Double price;
        private Integer quantityAvailable; // T6
        private boolean isSoldOut;
    }
}