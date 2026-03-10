package com.bluepal.controller;


import com.bluepal.dto.response.OrderResponse;
import com.bluepal.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Adjust for your Angular app URL
public class OrderController {

    private final OrderService orderService;

    /**
     * T31: Retrieve full order details for the Confirmation Page
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderDetails(@PathVariable UUID id) {
        OrderResponse response = orderService.getOrderDetails(id);
        return ResponseEntity.ok(response);
    }

    /**
     * EM-TICKET-GEN-003-T29 & EM-TICKET-GEN-006-T2: Secure PDF Download
     * Accepts email as a query param to verify ownership (MVP Security)
     */
    @GetMapping("/{id}/tickets-pdf")
    public ResponseEntity<Resource> downloadTickets(
            @PathVariable UUID id,
            @RequestParam String email) {

        // T4, T5: Service checks if email matches the order attendee
        String filePath = orderService.getSecurePdfPath(id, email);

        FileSystemResource resource = new FileSystemResource(filePath);

        // T30, T31: Return as an attachment so the browser downloads it
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Eventix_Tickets.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}