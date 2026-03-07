package com.bluepal.service;

import com.bluepal.dto.request.CreateEventRequest;
import com.bluepal.dto.response.EventResponse;
import com.bluepal.modal.Event;
import com.bluepal.modal.Organization;
import com.bluepal.repository.EventRepository;
import com.bluepal.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;

    public EventResponse createEvent(Long organizationId, CreateEventRequest request){

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Event event = Event.builder()
                .organization(organization)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .visibility(request.getVisibility())
                .build();

        Event saved = eventRepository.save(event);

        return EventResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .location(saved.getLocation())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .visibility(saved.getVisibility())
                .status(saved.getStatus())
                .build();
    }
}