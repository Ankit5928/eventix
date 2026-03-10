package com.bluepal.controller;

import com.bluepal.dto.request.CreateTicketCategoryRequest;
import com.bluepal.dto.request.UpdateTicketCategoryRequest;
import com.bluepal.dto.response.CategoryStatsDTO;
import com.bluepal.dto.response.TicketCategoryResponse;
import com.bluepal.service.QRCodeService;
import com.bluepal.service.TicketCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events/{eventId}/categories")
@RequiredArgsConstructor
public class TicketCategoryController {

    private final TicketCategoryService categoryService;
    private final QRCodeService qrCodeService;

    /**
     * EM-TICKET-001: Create a new ticket category for an event.
     */
    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<TicketCategoryResponse> createCategory(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateTicketCategoryRequest request
    ) {
        return new ResponseEntity<>(categoryService.createCategory(eventId, request), HttpStatus.CREATED);
    }

    /**
     * EM-TICKET-002: Get ticket categories for a specific event.
     * * @param internalView If true (for Organizers), returns all categories.
     * If false (default for Public), returns only active sales.
     */
    @GetMapping
    public ResponseEntity<List<TicketCategoryResponse>> getCategories(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "false") boolean internalView
    ) {
        // EM-TICKET-002-T9 & T10: Logic to separate public browsing from management
        if (internalView) {
            return ResponseEntity.ok(categoryService.getCategoriesByEvent(eventId));
        }
        return ResponseEntity.ok(categoryService.getActiveCategoriesForPublic(eventId));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<List<CategoryStatsDTO>> getCategoryStats(@PathVariable Long eventId) {
        return ResponseEntity.ok(categoryService.getCategoryStats(eventId));
    }

    /**
     * EM-TICKET-006-T10: Update ticket category details and capacity.
     */
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<TicketCategoryResponse> updateCategory(
            @PathVariable Long eventId,
            @PathVariable UUID categoryId,
            @Valid @RequestBody UpdateTicketCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(eventId, categoryId, request));
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<Resource> getQRCode(@PathVariable UUID id) {
        try {
            Resource resource = qrCodeService.getQRCodeResource(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    // Cache the image for 1 day to improve frontend performance
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}