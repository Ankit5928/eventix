package com.bluepal.controller;

import com.bluepal.dto.response.EventSummaryDTO;
import com.bluepal.dto.response.OrganizationSummaryDTO;
import com.bluepal.dto.response.RevenueReportDTO;
import com.bluepal.dto.response.SalesTimeSeriesDTO;
import com.bluepal.security.OrganizationContextHolder;
import com.bluepal.service.ReportPdfService;
import com.bluepal.service.ReportingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class OrderReportController {

    private final ReportingService reportingService;
    private final ReportPdfService reportPdfService;

    private Long resolveOrgId(Long requestedOrgId) {
        Long contextOrgId = OrganizationContextHolder.getOrgId();
        if (requestedOrgId != null && requestedOrgId > 0) {
            return requestedOrgId;
        }
        if (contextOrgId != null) {
            return contextOrgId;
        }
        throw new IllegalArgumentException("Organization ID is required");
    }

    /**
     * T12-T16: Returns revenue analytics with optional date range filtering.
     */
    @GetMapping("/revenue-by-event")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<List<RevenueReportDTO>> getRevenueReport(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Long orgId = resolveOrgId(organizationId);
        log.debug("Reporting request - revenue-by-event for orgId={} (param {})", orgId, organizationId);
        return ResponseEntity.ok(reportingService.getRevenueByEvent(orgId, startDate, endDate));
    }

    // Add to OrderReportController.java
    @GetMapping("/sales-over-time")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
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
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<List<RevenueReportDTO>> getTopSelling(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(defaultValue = "5") int limit) {

        Long orgId = resolveOrgId(organizationId);
        log.debug("Reporting request - top-selling-events for orgId={} (param {})", orgId, organizationId);
        return ResponseEntity.ok(reportingService.getTopSellingEvents(orgId, limit));
    }

    // Add to OrderReportController.java
    /**
     * T9-T10: Returns the high-level dashboard summary for a specific event.
     */
    @GetMapping("/events/{eventId}/summary")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<EventSummaryDTO> getEventDashboardSummary(@PathVariable Long eventId) {
        // Note: Security check to ensure organizer owns the event is recommended here
        return ResponseEntity.ok(reportingService.getEventSummary(eventId));
    }

    // Add to OrderReportController.java
    @GetMapping("/organization-summary")
    @PreAuthorize("hasRole('OWNER') or hasRole('ORGANIZER')")
    public ResponseEntity<OrganizationSummaryDTO> getOrgSummary(
            @RequestParam(required = false) Long organizationId) {
        Long orgId = resolveOrgId(organizationId);
        log.debug("Reporting request - organization-summary for orgId={} (param {})", orgId, organizationId);
        return ResponseEntity.ok(reportingService.getOrganizationSummary(orgId));
    }

    // Add to OrderReportController.java
    @GetMapping("/sales-pdf")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')")
    public ResponseEntity<byte[]> downloadSalesReport(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Long orgId = resolveOrgId(organizationId);

        // T14: Generate and return PDF
        byte[] pdfContent = reportPdfService.generateSalesReportPDF(orgId, startDate, endDate);

        String filename = "Sales_Report_" + orgId + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}