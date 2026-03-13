package com.bluepal.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicEventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private String location;
    private String imageUrl;
    private Double minPrice; // T5: Min price across all categories
}