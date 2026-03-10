package com.bluepal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * EM-EVENT-005-T1: Data Transfer Object for updating an existing event.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {

    @NotBlank(message = "Event title is required")
    @Size(max = 255, message = "Title must be under 255 characters")
    private String title;

    @Size(max = 2000, message = "Description must be under 2000 characters")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotBlank(message = "Timezone is required")
    private String timezone;

    @NotBlank(message = "Visibility must be set to 'public' or 'private'")
    private String visibility;
}