package com.bluepal.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank
    private String title;

    private String description;

    private String location;

    @Future
    private LocalDateTime startDate;

    @Future
    private LocalDateTime endDate;

    private String timezone;

    private String visibility;

}