package com.bluepal.controller;

import com.bluepal.dto.response.EventSummaryDTO;
import com.bluepal.dto.response.OrganizationSummaryDTO;
import com.bluepal.dto.response.RevenueReportDTO;
import com.bluepal.dto.response.SalesTimeSeriesDTO;
import com.bluepal.service.ReportPdfService;
import com.bluepal.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class OrderReportController {

    private final ReportingService reportingService;
    private final ReportPdfService reportPdfService;

    /**
     * T12-T16: Returns revenue analytics with optional date range filtering.
     */
    @GetMapping("/revenue-by-event")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<RevenueReportDTO>> getRevenueReport(
            @RequestParam Long organizationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        return ResponseEntity.ok(reportingService.getRevenueByEvent(organizationId, startDate, endDate));
    }

    // Add to OrderReportController.java
    @GetMapping("/sales-over-time")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<SalesTimeSeriesDTO>> getSalesTrend(
            @RequestParam Long eventId,
            @RequestParam(defaultValue = "DAY") String groupBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        return ResponseEntity.ok(reportingService.getSalesOverTime(eventId, groupBy, startDate, endDate));
    }

    // Add to OrderReportController.java
    /**
     * T5-T7: Returns a ranked list of events based on ticket sales volume.
     */
    @GetMapping("/top-selling-events")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<RevenueReportDTO>> getTopSelling(
            @RequestParam Long organizationId,
            @RequestParam(defaultValue = "5") int limit) {

        return ResponseEntity.ok(reportingService.getTopSellingEvents(organizationId, limit));
    }
    // Add to OrderReportController.java
    /**
     * T9-T10: Returns the high-level dashboard summary for a specific event.
     */
    @GetMapping("/events/{eventId}/summary")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventSummaryDTO> getEventDashboardSummary(@PathVariable Long eventId) {
        // Note: Security check to ensure organizer owns the event is recommended here
        return ResponseEntity.ok(reportingService.getEventSummary(eventId));
    }

    // Add to OrderReportController.java
    @GetMapping("/organization-summary")
    @PreAuthorize("hasRole('OWNER') or hasRole('ORGANIZER')")
    public ResponseEntity<OrganizationSummaryDTO> getOrgSummary(@RequestParam Long organizationId) {
        return ResponseEntity.ok(reportingService.getOrganizationSummary(organizationId));
    }

    // Add to OrderReportController.java
    @GetMapping("/sales-pdf")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<byte[]> downloadSalesReport(
            @RequestParam Long organizationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // T14: Generate and return PDF
        byte[] pdfContent = reportPdfService.generateSalesReportPDF(organizationId, startDate, endDate);

        String filename = "Sales_Report_" + organizationId + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}