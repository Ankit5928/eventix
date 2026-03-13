package com.bluepal.service;

import com.bluepal.dto.request.CreateEventRequest;
import com.bluepal.dto.request.UpdateEventRequest;
import com.bluepal.dto.response.EventListItemDTO;
import com.bluepal.dto.response.EventResponse;
import com.bluepal.dto.response.PublicEventDTO;
import com.bluepal.dto.response.PublicEventDetailDTO;
import com.bluepal.exception.ResourceNotFoundException;
import com.bluepal.modal.Event;
import com.bluepal.modal.Organization;
import com.bluepal.modal.TicketCategory;
import com.bluepal.repository.EventRepository;
import com.bluepal.repository.OrganizationRepository;
import com.bluepal.repository.TicketCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aot.generate.AccessControl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    @Value("${encryption.master-key}")
    private String masterKey;

    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;
    private final TicketCategoryRepository categoryRepository;

    /**
     * EM-EVENT-001: Create a new event.
     * EM-EVENT-001-T17: Organization is set from the path/context.
     */
    @Transactional
    public EventResponse createEvent(Long organizationId, CreateEventRequest request) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // EM-EVENT-001-T16: Validate date logic
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Start date must be before end date");
        }

        Event event = Event.builder()
                .organization(organization)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .timezone(request.getTimezone())
                .visibility(request.getVisibility() != null ? request.getVisibility() : "PUBLIC")
                .status("ACTIVE")
                .build();

        log.info("Creating new event: {} for organization: {}", event.getTitle(), organizationId);
        return mapToResponse(eventRepository.save(event));
    }

    /**
     * EM-EVENT-002-T16: Update event image path after file storage.
     */
    @Transactional
    public EventResponse updateEventImage(Long organizationId, Long eventId, String imagePath) {
        Event event = getValidatedEvent(organizationId, eventId);
        event.setImagePath(imagePath);
        return mapToResponse(eventRepository.save(event));
    }

    /**
     * EM-EVENT-003 & EM-EVENT-004: Paginated list and search.
     */
    @Transactional(readOnly = true)
    public Page<EventListItemDTO> getEventsByOrganization(Long organizationId, String search, Pageable pageable) {
        Page<Event> events;
        if (search != null && !search.isEmpty()) {
            events = eventRepository.searchByTitle(organizationId, search, pageable);
        } else {
            events = eventRepository.findByOrganizationId(organizationId, pageable);
        }
        return events.map(this::mapToListItemDTO);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> getAllPublicEvents(Pageable pageable) {
        return eventRepository.findAllByVisibilityAndStatus("PUBLIC", "ACTIVE", pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public EventResponse getPublicEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if ("PRIVATE".equalsIgnoreCase(event.getVisibility())) {
            // This will be caught by GlobalExceptionHandler and mapped to 401/403
            throw new org.springframework.security.access.AccessDeniedException("This is a private event");
        }

        return mapToResponse(event);
    }
    /**
     * EM-EVENT-005: Update event details.
     */
    @Transactional
    public EventResponse updateEvent(Long organizationId, Long eventId, UpdateEventRequest request) {
        Event event = getValidatedEvent(organizationId, eventId);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setVisibility(request.getVisibility());

        return mapToResponse(eventRepository.save(event));
    }

    /**
     * EM-EVENT-007: Cancel an event.
     */
    @Transactional
    public void cancelEvent(Long organizationId, Long eventId, boolean force) {
        Event event = getValidatedEvent(organizationId, eventId);

        // EM-EVENT-007-AC2: Check for sales
        boolean hasSales = checkExistingSales(eventId);

        if (hasSales && !force) {
            throw new RuntimeException("Cannot cancel event with active ticket sales. Use 'force' to override.");
        }

        event.setStatus("CANCELLED");
        eventRepository.save(event);
        log.warn("Event {} cancelled. Force flag: {}", eventId, force);
    }

    // Inside EventService.java
    public Page<PublicEventDTO> getPublicEvents(int page, int size) {
        // T8: Default pagination (12 per page as per T8)
        Pageable pageable = PageRequest.of(page, size);


        return eventRepository.findPublicUpcomingEvents(pageable);
    }

    // Update EventService.java
    public Page<PublicEventDTO> getPublicEvents(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // T1: Handle null or empty search strings to prevent SQL issues
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        return eventRepository.findPublicUpcomingEventsWithSearch(searchTerm, pageable);
    }

    // Inside EventService.java
    @Transactional(readOnly = true)
    public PublicEventDetailDTO getPublicEventDetails(Long eventId) {
        // T4: Fetch event with categories
        Event event = eventRepository.findById(eventId)
                .filter(e -> "PUBLIC".equalsIgnoreCase(e.getVisibility()) &&
                        "ACTIVE".equalsIgnoreCase(e.getStatus())) // T8: Filter by String values
                .orElseThrow(() -> new ResourceNotFoundException("Event not found or is private"));

        LocalDateTime now = LocalDateTime.now();

        // T5: Filter categories by sales period
        List<PublicEventDetailDTO.PublicTicketCategoryDTO> categories = event.getTicketCategories().stream()
                .filter(TicketCategory::isSalesPeriodActive) // Uses your helper method
                .map(tc -> PublicEventDetailDTO.PublicTicketCategoryDTO.builder()
                        .id(tc.getId())
                        .name(tc.getName())
                        .description(tc.getDescription())
                        .price(tc.getPrice())
                        .quantityAvailable(tc.getQuantityAvailable()) // T6: From your modal
                        .isSoldOut(tc.getQuantityAvailable() <= 0)
                        .build())
                .toList();

        return PublicEventDetailDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .location(event.getLocation())
                .venueDetails(event.getVenueDetails())
                .imageUrl(event.getImageUrl())
                .ticketCategories(categories)
                .build();
    }


    // Update EventService.java
    // Inside EventService.java
    public Page<PublicEventDTO> getPublicEvents(String search, LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Sanitize the search term to avoid issues with empty strings
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        return eventRepository.findPublicEventsFiltered(searchTerm, start, end, pageable);
    }
    /**
     * Centralized security check for event ownership.
     */
    private Event getValidatedEvent(Long organizationId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganization().getId().equals(organizationId)) {
            throw new RuntimeException("Access Denied: You do not have permission to modify this event.");
        }
        return event;
    }

    /**
     * EM-EVENT-001-T19: Map Entity to Response DTO.
     */
    private EventResponse mapToResponse(Event saved) {
        return EventResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .location(saved.getLocation())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .timezone(saved.getTimezone())
                .status(saved.getStatus())
                .imageUrl(saved.getImageUrl())
                .createdAt(saved.getCreatedAt())
                .build();
    }
    private EventListItemDTO mapToListItemDTO(Event event) {
        // EM-EVENT-003-T6: Join logic/calculation to count tickets sold
        int totalSold = categoryRepository.findByEventId(event.getId()).stream()
                .mapToInt(cat -> cat.getQuantityTotal() - cat.getQuantityAvailable())
                .sum();

        return EventListItemDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .startDate(event.getStartDate())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .ticketsSold(totalSold)
                .build();
    }

    private boolean checkExistingSales(Long eventId) {
        return categoryRepository.findByEventId(eventId).stream()
                .anyMatch(cat -> cat.getQuantityAvailable() < cat.getQuantityTotal());
    }
}