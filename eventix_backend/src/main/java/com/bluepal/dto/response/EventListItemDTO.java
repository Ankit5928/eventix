package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EventListItemDTO {
    private Long id;
    private String title;
    private LocalDateTime startDate;
    private String location;
    private String imageUrl;
    private String status;
    private Integer ticketsSold; // EM-EVENT-003-T6: Aggregated field
}