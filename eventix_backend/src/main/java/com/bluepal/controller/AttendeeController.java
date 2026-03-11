package com.bluepal.controller;

import com.bluepal.dto.response.AttendeeDTO;
import com.bluepal.dto.response.AttendeeDetailDTO;
import com.bluepal.service.AttendeeService;
import com.bluepal.service.CSVExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class AttendeeController {

    private final AttendeeService attendeeService;
    private final CSVExportService csvExportService;

    /**
     * UNIFIED ATTENDEE LIST (T4-T12)
     * This single method replaces all previous versions of getAttendees.
     * It handles:
     * 1. Basic pagination
     * 2. Keyword Search (search)
     * 3. Ticket Category filtering (categoryId)
     * 4. Check-in status filtering (checkedIn)
     */
    @GetMapping("/{eventId}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String checkedIn,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        // All parameters are passed to a single service method
        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId, search, categoryId, checkedIn, page, size));
    }

    /**
     * ATTENDEE EXPORT (T10-T14)
     * Exports the filtered list of attendees to a CSV file.
     */
    @GetMapping("/{eventId}/attendees/export")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<byte[]> exportAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String checkedIn) {

        // Logic to convert the status string to Boolean for the CSV service
        Boolean checkedInFilter = null;
        if ("checked_in".equalsIgnoreCase(checkedIn)) checkedInFilter = true;
        else if ("not_checked_in".equalsIgnoreCase(checkedIn)) checkedInFilter = false;

        String csvData = csvExportService.exportAttendeesToCSV(eventId, search, categoryId, checkedInFilter);
        byte[] content = csvData.getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendees_event_" + eventId + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(content);
    }

    /**
     * ATTENDEE DETAILS (T9)
     * Fetches detailed information for a specific ticket.
     */
    @GetMapping("/details/{ticketId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<AttendeeDetailDTO> getAttendeeDetails(@PathVariable UUID ticketId) {
        return ResponseEntity.ok(attendeeService.getAttendeeDetails(ticketId));
    }
}