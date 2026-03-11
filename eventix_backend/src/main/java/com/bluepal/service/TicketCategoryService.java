package com.bluepal.service;

import com.bluepal.dto.request.CreateTicketCategoryRequest;
import com.bluepal.dto.request.UpdateTicketCategoryRequest;
import com.bluepal.dto.response.CategoryStatsDTO;
import com.bluepal.dto.response.TicketCategoryResponse;
import com.bluepal.exception.InsufficientInventoryException;
import com.bluepal.modal.Event;
import com.bluepal.modal.TicketCategory;
import com.bluepal.repository.EventRepository;
import com.bluepal.repository.TicketCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketCategoryService {

    private final EventRepository eventRepository;
    private final TicketCategoryRepository categoryRepository;

    @Transactional
    public TicketCategoryResponse createCategory(Long eventId, CreateTicketCategoryRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found or access denied"));

        if (request.getSalesStart() != null && request.getSalesEnd() != null) {
            if (request.getSalesStart().isAfter(request.getSalesEnd())) {
                throw new IllegalArgumentException("Sales start must be before end");
            }
        }

        TicketCategory category = TicketCategory.builder()
                .id(UUID.randomUUID()) // Explicit UUID generation
                .event(event)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice().doubleValue())
                .quantityTotal(request.getQuantityTotal())
                .quantityAvailable(request.getQuantityTotal())
                .salesStart(request.getSalesStart())
                .salesEnd(request.getSalesEnd())
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional(readOnly = true)
    public List<TicketCategoryResponse> getCategoriesByEvent(Long eventId) {
        return categoryRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add these methods to your existing TicketCategoryService.java

    /**
     * EM-TICKET-003-T3: Logic to attempt stock reduction.
     * Checks rows affected to prevent overselling.
     */
    @Transactional // T6: Ensures the lock is held for the duration of this method
    public void decrementAvailability(UUID categoryId, Integer quantity) {

        // T2: Fetch the row and LOCK it (FOR UPDATE)
        TicketCategory category = categoryRepository.findByIdWithLock(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Check inventory in Java (safe because the row is locked)
        if (category.getQuantityAvailable() < quantity) {
            throw new InsufficientInventoryException("Not enough tickets available.");
        }

        // Perform the update
        category.setQuantityAvailable(category.getQuantityAvailable() - quantity);

        // T5: Save back to DB. Lock is released when the transaction commits.
        categoryRepository.save(category);
    }

    /**
     * EM-TICKET-003-T7: Logic to release tickets back to inventory.
     */
    @Transactional
    public void incrementAvailability(UUID categoryId, Integer quantity) {
        int rowsAffected = categoryRepository.incrementAvailability(categoryId, quantity);

        if (rowsAffected == 0) {
            throw new RuntimeException("Failed to release tickets: Category not found.");
        }
    }
    @Transactional(readOnly = true)
    public List<CategoryStatsDTO> getCategoryStats(Long eventId) {
        // RLS and existing findByEventId handle the security/context
        return categoryRepository.findByEventId(eventId).stream()
                .map(this::mapToStatsDTO)
                .collect(Collectors.toList());
    }

    /**
     * EM-TICKET-006-T3: Update an existing ticket category.
     * Handles inventory delta logic (T6-T9).
     */
    @Transactional
    public TicketCategoryResponse updateCategory(Long eventId, UUID categoryId, UpdateTicketCategoryRequest request) {
        // T4: Fetch existing category
        TicketCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Ticket category not found"));

        // EM-TICKET-006-T11: Security check - ensure category belongs to the event
        if (!category.getEvent().getId().equals(eventId)) {
            throw new RuntimeException("Unauthorized: Category does not belong to this event");
        }

        // EM-TICKET-006-T8: Calculate how many tickets are already "in the wild"
        int ticketsSold = category.getQuantityTotal() - category.getQuantityAvailable();

        // EM-TICKET-006-T7 & T9: Prevent reducing capacity below what's already sold
        if (request.getQuantityTotal() < ticketsSold) {
            throw new RuntimeException("Cannot reduce total capacity to " + request.getQuantityTotal() +
                    " because " + ticketsSold + " tickets have already been sold.");
        }

        // T5: Update basic fields
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setPrice(request.getPrice().doubleValue());
        category.setSalesStart(request.getSalesStart());
        category.setSalesEnd(request.getSalesEnd());

        // EM-TICKET-006-T6: Sync the available inventory with the new total
        category.setQuantityTotal(request.getQuantityTotal());
        category.setQuantityAvailable(request.getQuantityTotal() - ticketsSold);

        return mapToResponse(categoryRepository.save(category));
    }

    private CategoryStatsDTO mapToStatsDTO(TicketCategory category) {
        // EM-TICKET-005-T3: Calculate tickets sold
        int sold = category.getQuantityTotal() - category.getQuantityAvailable();

        // EM-TICKET-005-T4: Calculate revenue (Sold * Price)
        BigDecimal revenue = BigDecimal.valueOf(category.getPrice())
                .multiply(BigDecimal.valueOf(sold));

        return CategoryStatsDTO.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .total(category.getQuantityTotal())
                .sold(sold)
                .available(category.getQuantityAvailable())
                .revenue(revenue)
                .build();
    }
    /**
     * EM-TICKET-002-T9 & T10: Public view filtering
     */
    @Transactional(readOnly = true)
    public List<TicketCategoryResponse> getActiveCategoriesForPublic(Long eventId) {
        return categoryRepository.findByEventId(eventId).stream()
                .filter(TicketCategory::isSalesPeriodActive)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TicketCategoryResponse mapToResponse(TicketCategory category) {
        return TicketCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .price(BigDecimal.valueOf(category.getPrice()))
                .quantityTotal(category.getQuantityTotal())
                .quantityAvailable(category.getQuantityAvailable())
                // EM-TICKET-002-T15: Map sales dates to DTO
                .salesStart(category.getSalesStart())
                .salesEnd(category.getSalesEnd())
                // EM-TICKET-002-T16/T17: Flag for UI badges
                .isActive(category.isSalesPeriodActive())
                .build();
    }
}