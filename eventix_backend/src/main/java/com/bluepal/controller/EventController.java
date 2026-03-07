package com.bluepal.controller;

import com.bluepal.dto.request.CreateEventRequest;
import com.bluepal.dto.response.EventResponse;
import com.bluepal.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/{organizationId}")
    public EventResponse createEvent(
            @PathVariable Long organizationId,
            @Valid @RequestBody CreateEventRequest request
    ){
        return eventService.createEvent(organizationId, request);
    }
}