package com.bluepal.service;

import com.bluepal.dto.response.EventSummaryDTO;
import com.bluepal.dto.response.OrganizationSummaryDTO;
import com.bluepal.dto.response.RevenueReportDTO;
import com.bluepal.dto.response.SalesTimeSeriesDTO;
import com.bluepal.repository.EventRepository;
import com.bluepal.repository.OrderRepository;
import com.bluepal.repository.TicketCategoryRepository;
import com.bluepal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final EventRepository eventRepository;

    /**
     * T4: Fetches revenue metrics for all events under an organization.
     */
    public List<RevenueReportDTO> getRevenueByEvent(Long orgId, LocalDateTime start, LocalDateTime end) {
        LocalDateTime actualStart = (start != null) ? start : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime actualEnd = (end != null) ? end : LocalDateTime.of(2100, 1, 1, 0, 0);
        
        List<RevenueReportDTO> reports = orderRepository.getRevenueReportByOrganization(orgId, actualStart, actualEnd);

        reports.forEach(report -> {
            double total = report.getTotalRevenue() != null ? report.getTotalRevenue() : 0.0;
            long sold = report.getTicketsSold() != null ? report.getTicketsSold() : 0L;
            
            report.setTotalRevenue(total);
            report.setTicketsSold(sold);
            
            if (sold > 0) {
                report.setAvgTicketPrice(total / sold);
            } else {
                report.setAvgTicketPrice(0.0);
            }
        });

        return reports;
    }

    // Add to ReportingService.java
    public List<SalesTimeSeriesDTO> getSalesOverTime(Long eventId, String groupBy, LocalDateTime start, LocalDateTime end) {
        // T8: Default to last 30 days if null
        LocalDateTime actualStart = (start != null) ? start : LocalDateTime.now().minusDays(30);
        LocalDateTime actualEnd = (end != null) ? end : LocalDateTime.now();

        // T4: Normalize group by for PostgreSQL
        String period = (groupBy != null) ? groupBy.toLowerCase() : "day";

        List<Object[]> results = orderRepository.getSalesTimeSeriesNative(eventId, period, actualStart, actualEnd);

        return results.stream().map(row -> SalesTimeSeriesDTO.builder()
                .date((String) row[0])
                .ordersCount(((Number) row[1]).longValue())
                .ticketsSold(((Number) row[2]).longValue())
                .revenue(((Number) row[3]).doubleValue())
                .build()
        ).toList();
    }

    // Add to ReportingService.java
    /**
     * T1: Fetches the highest volume events for an organization leaderboard.
     */
    public List<RevenueReportDTO> getTopSellingEvents(Long orgId, int limit) {
        // T4: Create a pageable object to enforce the LIMIT
        Pageable topLimit = PageRequest.of(0, limit);

        return orderRepository.findTopSellingEvents(orgId, topLimit);
    }

    // Add to ReportingService.java
    @Transactional(readOnly = true)
    public EventSummaryDTO getEventSummary(Long eventId) {
        // T4-T5: Aggregate metrics from OrderRepository
        Double revenue = orderRepository.getTotalRevenueByEvent(eventId);
        Long sold = ticketRepository.countByEventId(eventId);

        // T6: Calculate remaining capacity from TicketCategory table
        Long totalCapacity = ticketCategoryRepository.getTotalCapacityByEvent(eventId);
        Long remaining = (totalCapacity != null ? totalCapacity : 0L) - sold;

        // T7: Check-in rate calculation
        Long checkedIn = ticketRepository.countCheckedInByEventId(eventId);
        Double rate = (sold > 0) ? ((double) checkedIn / sold) * 100 : 0.0;

        // T8: Fetch last 10 orders for the "Recent Activity" feed
        List<EventSummaryDTO.RecentOrderDTO> recent = orderRepository.findTop10ByEventIdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(o -> EventSummaryDTO.RecentOrderDTO.builder()
                        .attendeeName(o.getReservation().getAttendeeName())
                        .amount(o.getTotalAmount())
                        .status(o.getStatus().toString())
                        .createdAt(o.getCreatedAt().toString())
                        .build())
                .toList();

        return EventSummaryDTO.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .ticketsSold(sold)
                .ticketsRemaining(remaining > 0 ? remaining : 0L)
                .checkInRate(Math.round(rate * 100.0) / 100.0)
                .recentOrders(recent)
                .build();
    }

    // Add to ReportingService.java
    @Transactional(readOnly = true)
    public OrganizationSummaryDTO getOrganizationSummary(Long orgId) {
        Double revenue = orderRepository.sumTotalRevenueByOrg(orgId);
        Long totalEvents = eventRepository.countByOrganizationId(orgId);
        Long activeEvents = eventRepository.countActiveEvents(orgId);
        Long totalTickets = orderRepository.countTotalTicketsSoldByOrg(orgId);

        // T8: Mapping upcoming events
        List<OrganizationSummaryDTO.UpcomingEventDTO> upcoming = eventRepository
                .findTop5UpcomingEvents(orgId, PageRequest.of(0, 5))
                .stream()
                .map(e -> OrganizationSummaryDTO.UpcomingEventDTO.builder()
                        .eventId(e.getId())
                        .title(e.getTitle())
                        .startDate(e.getStartDate().toString())
                        .ticketsSold(ticketRepository.countByEventId(e.getId()))
                        .build())
                .toList();

        return OrganizationSummaryDTO.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .totalEvents(totalEvents)
                .activeEvents(activeEvents)
                .totalTicketsSold(totalTickets)
                .upcomingEvents(upcoming)
                .build();
    }
}