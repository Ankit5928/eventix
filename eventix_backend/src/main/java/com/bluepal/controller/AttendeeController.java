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
     * T8-T12: Returns a paginated list of attendees for an event.
     */
    @GetMapping("/{eventId}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId, page, size));
    }

    // Update AttendeeController.java
    @GetMapping("/{eventId}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search, // T6: Added search param
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId, search, page, size));
    }

    // Update AttendeeController.java
    @GetMapping("/{eventId}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId, // T4: Added category filter
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId, search, categoryId, page, size));
    }

    // Update AttendeeController.java
    @GetMapping("/{eventId}/attendees")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Page<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String checkedIn, // T4: Accept ?checkedIn=checked_in
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId, search, categoryId, checkedIn, page, size));
    }

    // Add to AttendeeController.java
    @GetMapping("/{eventId}/attendees/export")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<byte[]> exportAttendees(
            @PathVariable Long eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String checkedIn) {

        // Convert status string to Boolean for the service
        Boolean checkedInFilter = null;
        if ("checked_in".equalsIgnoreCase(checkedIn)) checkedInFilter = true;
        else if ("not_checked_in".equalsIgnoreCase(checkedIn)) checkedInFilter = false;

        // T10: Generate the CSV content
        String csvData = csvExportService.exportAttendeesToCSV(eventId, search, categoryId, checkedInFilter);
        byte[] content = csvData.getBytes();

        // T13-T14: Set headers for file download
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendees_event_" + eventId + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(content);
    }

    // Add to AttendeeController.java
    @GetMapping("/details/{ticketId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<AttendeeDetailDTO> getAttendeeDetails(@PathVariable UUID ticketId) {
        // T9: (Logic for verifying organizer access to the event would be handled here or in Service)
        return ResponseEntity.ok(attendeeService.getAttendeeDetails(ticketId));
    }
}