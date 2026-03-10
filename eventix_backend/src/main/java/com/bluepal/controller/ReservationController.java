package com.bluepal.controller;

import com.bluepal.dto.request.AttendeeDetailRequest;
import com.bluepal.dto.request.ReservationRequest;
import com.bluepal.dto.response.ReservationResponse;
import com.bluepal.dto.response.ReservationSummaryDTO;
import com.bluepal.modal.Reservation;
import com.bluepal.modal.ReservationStatus;
import com.bluepal.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * EM-RESERVE-001-T32: Create a 15-minute ticket hold.
     * Uses 201 Created on success.
     */
    @PostMapping("/{eventId}/reservations")
    public ResponseEntity<ReservationResponse> reserveTickets(
            @PathVariable Long eventId,
            @RequestBody ReservationRequest request) {

        Reservation reservation = reservationService.createReservation(eventId, request);

        ReservationResponse response = new ReservationResponse();
        response.setReservationId(reservation.getId());
        response.setExpiresAt(reservation.getExpiresAt().toString());
        response.setStatus(reservation.getStatus().toString());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * EM-RESERVE-003-T13: Fetch status for the frontend countdown timer.
     * Uses 200 OK.
     */
    // Update within ReservationController.java

    @GetMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponse> getReservationStatus(@PathVariable UUID id) {
        // T1: Fetch status
        ReservationResponse response = reservationService.getReservationStatus(id);

        // T7: Explicitly verify if we should signal an expiration
        if (ReservationStatus.EXPIRED.toString().equals(response.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        return ResponseEntity.ok(response);
    }


    @PutMapping("/reservations/{id}/attendee")
    public ResponseEntity<Void> updateAttendeeInfo(
            @PathVariable UUID id,
            @Valid @RequestBody AttendeeDetailRequest request) {

        // Call the method that uses the Attendee entity
        reservationService.addAttendeeInfo(id, request);

        return ResponseEntity.noContent().build();
    }

    /**
     * EM-RESERVE-005-T8: Fetch the final order summary for the checkout review page.
     */
    @GetMapping("/reservations/{id}/summary")
    public ResponseEntity<ReservationSummaryDTO> getReservationSummary(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getReservationSummary(id));
    }


}