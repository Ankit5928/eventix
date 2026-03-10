package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCategoryResponse {

    private UUID id;

    private String name;

    private String description;

    private BigDecimal price;

    /**
     * The total number of tickets originally created for this category.
     */
    private Integer quantityTotal;


    /**
     * EM-TICKET-003: The current number of tickets available for purchase.
     * This value decreases as reservations are made.
     */
    private Integer quantityAvailable;


    // EM-TICKET-002-T15: Added for displaying sales period in UI
    private LocalDateTime salesStart;

    private LocalDateTime salesEnd;

    // EM-TICKET-002-T16/T17: Helper flag for Frontend badges
    private boolean isActive;
}