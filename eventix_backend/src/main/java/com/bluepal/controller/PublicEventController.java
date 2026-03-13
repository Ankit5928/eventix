package com.bluepal.controller;

import com.bluepal.dto.request.ReservationRequest;
import com.bluepal.dto.response.PublicEventDTO;
import com.bluepal.dto.response.PublicEventDetailDTO;
import com.bluepal.dto.response.ReservationResponse;
import com.bluepal.service.EventService;
import com.bluepal.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/public/events")
@RequiredArgsConstructor
public class PublicEventController {

    private final EventService eventService;
    private final ReservationService reservationService;





    // Inside PublicEventController.java
    /**
     * T7-T8: Returns full public details for a single event.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PublicEventDetailDTO> getPublicEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getPublicEventDetails(id));
    }

    @PostMapping("/{eventId}/reservations")
    public ResponseEntity<ReservationResponse> reserveTickets(
            @PathVariable Long eventId,
            @Valid @RequestBody ReservationRequest request) {

        // T1: Call the service to generate session ID and lock ticket stock
        ReservationResponse response = reservationService.createAnonymousReservation(eventId, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reservations/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationDetails(@PathVariable java.util.UUID reservationId) {
        // You'll need to implement this simple getter in your ReservationService
        ReservationResponse response = reservationService.getReservationById(reservationId);
        return ResponseEntity.ok(response);
    }

    // Inside PublicEventController.java
    @GetMapping
    public ResponseEntity<Page<PublicEventDTO>> getAllPublicEvents(
            @RequestParam(required = false) String search,
            // Map 'start' from frontend to 'startDate' in Java
            @RequestParam(name = "start", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            // Map 'end' from frontend to 'endDate' in Java
            @RequestParam(name = "end", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        return ResponseEntity.ok(eventService.getPublicEvents(search, startDate, endDate, page, size));
    }

}