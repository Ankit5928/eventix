package com.bluepal.service;

import com.bluepal.dto.response.AttendeeDTO;
import com.bluepal.dto.response.AttendeeDetailDTO;
import com.bluepal.modal.Order;
import com.bluepal.modal.Ticket;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendeeService {

    private final TicketRepository ticketRepository;

    public Page<AttendeeDTO> getEventAttendees(Long eventId, int page, int size) {
        // T6: Sort by created_at descending
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // T7: Map Ticket entities to AttendeeDTOs
        return ticketRepository.findByEventId(eventId, pageable)
                .map(ticket -> AttendeeDTO.builder()
                        .name(ticket.getAttendeeName())
                        .email(ticket.getAttendeeEmail())
                        .ticketCategory(ticket.getTicketCategory().getName())
                        .ticketCode(ticket.getTicketCode())
                        .checkedIn(ticket.isCheckedIn())
                        .build());
    }

    // Update AttendeeService.java
    public Page<AttendeeDTO> getEventAttendees(Long eventId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Ticket> ticketPage;

        // T5: Conditional logic - Search vs. GetAll
        if (search != null && !search.trim().isEmpty()) {
            ticketPage = ticketRepository.searchByEventAndNameOrEmail(eventId, search.trim(), pageable);
        } else {
            ticketPage = ticketRepository.findByEventId(eventId, pageable);
        }

        return ticketPage.map(this::mapToAttendeeDTO);
    }

    private AttendeeDTO mapToAttendeeDTO(Ticket ticket) {
        return AttendeeDTO.builder()
                .name(ticket.getAttendeeName())
                .email(ticket.getAttendeeEmail())
                .ticketCategory(ticket.getTicketCategory().getName())
                .ticketCode(ticket.getTicketCode())
                .checkedIn(ticket.isCheckedIn())
                .build();
    }

    // Update AttendeeService.java
    public Page<AttendeeDTO> getEventAttendees(Long eventId, String search, UUID categoryId, int page, int size) {
        // T3: Sort logic remains newest first
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // T1: Standardizing search term for the query
        String term = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        // T2: Execute the combined filter query
        return ticketRepository.findByEventWithFilters(eventId, categoryId, term, pageable)
                .map(this::mapToAttendeeDTO);
    }
    // Update AttendeeService.java
    public Page<AttendeeDTO> getEventAttendees(Long eventId, String search, UUID categoryId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // T3: Convert status string to Boolean
        Boolean checkedInFilter = null;
        if ("checked_in".equalsIgnoreCase(status)) {
            checkedInFilter = true;
        } else if ("not_checked_in".equalsIgnoreCase(status)) {
            checkedInFilter = false;
        }

        String term = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        return ticketRepository.findByEventWithAllFilters(eventId, categoryId, checkedInFilter, term, pageable)
                .map(this::mapToAttendeeDTO);
    }

    // Add to AttendeeService.java
    @Transactional(readOnly = true)
    public AttendeeDetailDTO getAttendeeDetails(UUID ticketId) {
        // T4: Fetch the primary ticket with all relationships
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Order order = ticket.getOrder();

        // T5: Fetch all tickets for the same order
        List<Ticket> orderTickets = ticketRepository.findByOrderId(order.getId());

        // T6: Map everything to the comprehensive DTO
        return AttendeeDetailDTO.builder()
                .name(ticket.getAttendeeName())
                .email(ticket.getAttendeeEmail())
                .orderId(order.getId())
                .orderDate(order.getCreatedAt())
                .orderTotal(order.getTotalAmount())
                .eventTitle(order.getReservation().getEvent().getTitle())
                .categoryName(ticket.getTicketCategory().getName())
                .checkedIn(ticket.isCheckedIn())
                .checkedInAt(ticket.getCheckedInAt())
                .otherTicketsInOrder(orderTickets.stream()
                        .map(ot -> AttendeeDetailDTO.OrderTicketDTO.builder()
                                .ticketId(ot.getId())
                                .attendeeName(ot.getAttendeeName())
                                .categoryName(ot.getTicketCategory().getName())
                                .checkedIn(ot.isCheckedIn())
                                .build())
                        .toList())
                .build();
    }
}