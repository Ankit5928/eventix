package com.bluepal.service;

import com.bluepal.dto.request.CreateTicketTypeRequest;
import com.bluepal.dto.response.TicketTypeResponse;
import com.bluepal.modal.Event;
import com.bluepal.modal.EventTicketType;
import com.bluepal.repository.EventRepository;
import com.bluepal.repository.EventTicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketTypeService {

    private final EventRepository eventRepository;
    private final EventTicketTypeRepository ticketRepository;

    public TicketTypeResponse createTicket(Long eventId, CreateTicketTypeRequest request){

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventTicketType ticket = EventTicketType.builder()
                .event(event)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .saleStart(request.getSaleStart())
                .saleEnd(request.getSaleEnd())
                .build();

        ticketRepository.save(ticket);

        return TicketTypeResponse.builder()
                .id(ticket.getId())
                .name(ticket.getName())
                .description(ticket.getDescription())
                .price(ticket.getPrice())
                .quantity(ticket.getQuantity())
                .sold(ticket.getSold())
                .build();
    }
}