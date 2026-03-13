package com.bluepal.controller;

import com.bluepal.dto.request.CreateEventRequest;
import com.bluepal.dto.request.UpdateEventRequest;
import com.bluepal.dto.response.EventListItemDTO;
import com.bluepal.dto.response.EventResponse;
import com.bluepal.service.EventService;
import com.bluepal.service.FileStorageService;
import com.bluepal.service.CloudinaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final FileStorageService fileStorageService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getPublicEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllPublicEvents(pageable));
    }

    /**
     * EM-EVENT-006-T9: Publicly accessible event detail.
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getPublicEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getPublicEventById(eventId));
    }

    /**
     * EM-EVENT-001: Create a new event.
     */
    @PostMapping("/{organizationId}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable Long organizationId,
            @Valid @RequestBody CreateEventRequest request) {
        return new ResponseEntity<>(eventService.createEvent(organizationId, request), HttpStatus.CREATED);
    }

    /**
     * EM-EVENT-002-T12: Upload event banner image.
     */
    @PostMapping("/{organizationId}/{eventId}/image")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<EventResponse> uploadImage(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            @RequestParam("file") MultipartFile file) throws IOException {
        // Upload to Cloudinary
        var uploadResult = cloudinaryService.upload(file);
        String imageUrl = uploadResult.get("secure_url").toString();
        return ResponseEntity.ok(eventService.updateEventImage(organizationId, eventId, imageUrl));
    }

    /**
     * EM-EVENT-003 & 004: List and Search.
     */
    // Inside EventController.java

    @GetMapping("/organization/{organizationId}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<Page<EventListItemDTO>> getEvents(
            @PathVariable Long organizationId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Create the Pageable object manually inside the controller
        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(eventService.getEventsByOrganization(organizationId, search, pageable));
    }

    /**
     * EM-EVENT-005: Update details.
     */
    @PutMapping("/{organizationId}/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateEventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(organizationId, eventId, request));
    }

    /**
     * EM-EVENT-007: Cancel event.
     */
    @PatchMapping("/{organizationId}/{eventId}/cancel")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<Void> cancelEvent(
            @PathVariable Long organizationId,
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "false") boolean force) {
        eventService.cancelEvent(organizationId, eventId, force);
        return ResponseEntity.noContent().build();
    }
}