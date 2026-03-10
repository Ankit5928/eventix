package com.bluepal.controller;

import com.bluepal.dto.request.CheckInRequest;
import com.bluepal.dto.response.CheckInResponse;
import com.bluepal.dto.response.CheckInStatsDTO;
import com.bluepal.dto.response.TicketSearchResultDTO;
import com.bluepal.dto.response.TicketValidationResponse;
import com.bluepal.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    /**
     * T13-T16: Endpoint to validate a scanned QR code string.
     */
    @PostMapping("/validate")
    @PreAuthorize("hasRole('CHECK_IN_OPERATOR') or hasRole('ORGANIZER')")
    public ResponseEntity<TicketValidationResponse> validateTicket(@RequestBody Map<String, String> request) {
        String code = request.get("ticket_code");
        return ResponseEntity.ok(checkInService.validateTicket(code));
    }

    /**
     * EM-CHECKIN-002-T14: Finalizes the entry.
     * This IS the "Check-in" phase. It marks the ticket as used.
     */
    @PostMapping("/execute")
    @PreAuthorize("hasRole('CHECK_IN_OPERATOR') or hasRole('ORGANIZER')")
    public ResponseEntity<CheckInResponse> executeCheckIn(
            @Valid @RequestBody CheckInRequest request) {
        // T16: Returns the confirmation timestamp and success message
        return ResponseEntity.ok(checkInService.checkInTicket(request.getTicketCode()));
    }

    /**
     * EM-CHECKIN-004-T10: Get real-time attendance stats for the dashboard.
     */
    @GetMapping("/events/{eventId}/stats")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<CheckInStatsDTO> getEventStats(@PathVariable Long eventId) {
        // T13: Returns total tickets, checked-in count, and category breakdown
        return ResponseEntity.ok(checkInService.getEventCheckInStats(eventId));
    }

    // Add to CheckInController.java
    @GetMapping("/search")
    @PreAuthorize("hasRole('CHECK_IN_OPERATOR')")
    public ResponseEntity<List<TicketSearchResultDTO>> searchTickets(
            @RequestParam Long eventId,
            @RequestParam String name) {

        // T14: Returns empty list automatically if no matches found
        if (name == null || name.trim().length() < 3) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(checkInService.searchTicketsByName(eventId, name));
    }
}