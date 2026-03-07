package com.bluepal.controller;

import com.bluepal.dto.request.CreateTicketTypeRequest;
import com.bluepal.dto.response.TicketTypeResponse;
import com.bluepal.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    @PostMapping("/{eventId}")
    public TicketTypeResponse createTicketType(
            @PathVariable Long eventId,
            @RequestBody CreateTicketTypeRequest request
    ){
        return ticketTypeService.createTicket(eventId, request);
    }
}