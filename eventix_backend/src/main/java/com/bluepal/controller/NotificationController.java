package com.bluepal.controller;

import com.bluepal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * T9-T11: Opens a real-time SSE stream for sale notifications.
     */
    @GetMapping(value = "/sales-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasRole('ORGANIZER')")
    public SseEmitter streamSales(@RequestParam Long organizationId) {
        // Use the current logged-in user's ID to manage the connection
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.createEmitter(organizationId, userId);
    }
}