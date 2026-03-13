package com.bluepal.controller;

import com.bluepal.modal.Ticket;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketRepository ticketRepository;

    /**
     * Public endpoint: Look up tickets by attendee email.
     */
    @GetMapping("/my-tickets")
    public ResponseEntity<List<Map<String, Object>>> getMyTickets(
            @RequestParam String email) {

        List<Ticket> tickets = ticketRepository.findByAttendeeEmailIgnoreCase(email);

        List<Map<String, Object>> result = tickets.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ticketCode", t.getTicketCode());
            map.put("attendeeName", t.getAttendeeName());
            map.put("checkedIn", t.isCheckedIn());
            map.put("eventName", t.getOrder().getReservation().getEvent().getTitle());
            map.put("eventDate", t.getOrder().getReservation().getEvent().getStartDate().toString());
            map.put("categoryName", t.getTicketCategory().getName());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
