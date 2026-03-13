package com.bluepal.service;

import com.bluepal.dto.response.CheckInResponse;
import com.bluepal.dto.response.CheckInStatsDTO;
import com.bluepal.dto.response.TicketSearchResultDTO;
import com.bluepal.dto.response.TicketValidationResponse;
import com.bluepal.modal.Ticket;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckInService {

    private final TicketRepository ticketRepository;

    /**
     * T2-T9: Main validation logic for ticket entry.
     */
    @Transactional(readOnly = true)
    public TicketValidationResponse validateTicket(String ticketCode) {
        // T5: Query the ticket by its unique public code
        return ticketRepository.findByTicketCode(ticketCode)
                .map(this::processTicketStatus)
                .orElse(TicketValidationResponse.builder()
                        .status("INVALID")
                        .message("Ticket not found in our system.")
                        .build());
    }

    // Inside CheckInService.java
    public CheckInStatsDTO getEventCheckInStats(Long eventId) {
        // T8-T9: Get breakdown from DB
        List<CheckInStatsDTO.CategoryBreakdownDTO> breakdown = ticketRepository.getCategoryBreakdown(eventId);

        // T4-T6: Aggregate totals from the breakdown list
        long total = breakdown.stream().mapToLong(CheckInStatsDTO.CategoryBreakdownDTO::getTotal).sum();
        long checkedIn = breakdown.stream().mapToLong(CheckInStatsDTO.CategoryBreakdownDTO::getCheckedIn).sum();

        // T7: Calculate percentage with zero-check (T25)
        double percentage = (total > 0) ? ((double) checkedIn / total) * 100 : 0.0;

        return CheckInStatsDTO.builder()
                .totalTickets(total)
                .checkedInCount(checkedIn)
                .pendingCount(total - checkedIn)
                .checkInPercentage(Math.round(percentage * 100.0) / 100.0) // Round to 2 decimal places
                .categoryBreakdown(breakdown)
                .build();
    }
    /**
     * EM-CHECKIN-002-T1 to T8: Execution logic to mark a ticket as used.
     * This updates the database state.
     */
    @Transactional
    public CheckInResponse checkInTicket(String ticketCode) {
        // T2: Reuse validation logic first
        TicketValidationResponse validation = validateTicket(ticketCode);

        // T3: If not valid, return failure response immediately
        if (!"VALID".equals(validation.getStatus())) {
            return CheckInResponse.builder()
                    .success(false)
                    .message(validation.getMessage())
                    .attendeeName(validation.getAttendeeName())
                    .build();
        }

        // T4-T6: Fetch the ticket, update status, and set timestamp
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found during execution"));

        ticket.setCheckedIn(true); // T4
        ticket.setCheckedInAt(LocalDateTime.now()); // T5

        // T6: Save to DB (Lombok @Version handles T9-T11 Optimistic Locking)
        ticketRepository.save(ticket);

        log.info("Ticket {} successfully checked in for attendee {}", ticket.getId(), ticket.getAttendeeName());

        // T7 & T13: Return success DTO
        return CheckInResponse.builder()
                .success(true)
                .message("Check-in successful!")
                .checkInTime(ticket.getCheckedInAt().toString())
                .attendeeName(ticket.getAttendeeName())
                .build();
    }

    // Add to CheckInService.java
    public List<TicketSearchResultDTO> searchTicketsByName(Long eventId, String name) {
        // T4: Using a simple PageRequest for the first 20 matches to keep it fast
        Pageable limit = PageRequest.of(0, 20);

        return ticketRepository.findByEventIdAndAttendeeNameContaining(eventId, name, limit)
                .stream()
                .map(ticket -> TicketSearchResultDTO.builder()
                        .ticketCode(ticket.getTicketCode())
                        .attendeeName(ticket.getAttendeeName())
                        .categoryName(ticket.getTicketCategory().getName())
                        .checkedIn(ticket.isCheckedIn())
                        .checkedInAt(ticket.getCheckedInAt())
                        .build())
                .toList();
    }

    private TicketValidationResponse processTicketStatus(Ticket ticket) {
        // T8: Check if ticket was already used
        if (ticket.isCheckedIn()) {
            // T6-T7: Enhanced error message with the original check-in timestamp
            return TicketValidationResponse.builder()
                    .status("ALREADY_CHECKED_IN")
                    .message("This ticket was already scanned at " +
                            (ticket.getCheckedInAt() != null ? ticket.getCheckedInAt() : "an unknown time"))
                    .attendeeName(ticket.getAttendeeName())
                    .build();
        }

        // T9-T10: Ticket is valid! Return details for the operator's screen
        return TicketValidationResponse.builder()
                .status("VALID")
                .message("Access Granted")
                .ticketId(ticket.getId())
                .attendeeName(ticket.getAttendeeName())
                .eventTitle(ticket.getOrder().getReservation().getEvent().getTitle())
                .categoryName(ticket.getTicketCategory().getName())
                .build();
    }
}