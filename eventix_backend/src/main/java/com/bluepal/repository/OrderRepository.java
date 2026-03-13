package com.bluepal.repository;

import com.bluepal.dto.response.RevenueReportDTO;
import com.bluepal.modal.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    // T29: Used to prevent creating duplicate orders for the same reservation
    boolean existsByReservationId(UUID reservationId);
    Order findByReservationId(UUID id);

    // Add to OrderRepository.java
// 1. Fix the Revenue Report Query
    @Query("SELECT new com.bluepal.dto.response.RevenueReportDTO(" +
            "e.id, e.title, COALESCE(SUM(o.totalAmount), 0.0), COALESCE(COUNT(i.id), 0L), " +
            "COALESCE(SUM(o.totalAmount) / NULLIF(COUNT(i.id), 0), 0.0)) " +
            "FROM Order o " +
            "JOIN o.reservation r " +
            "JOIN r.event e " +
            "LEFT JOIN o.items i " + // Use LEFT JOIN to catch events even if items list is tricky
            "WHERE e.organization.id = :orgId " +
            "AND o.status = 'CONFIRMED' " +
            "AND o.createdAt >= :startDate " +
            "AND o.createdAt <= :endDate " +
            "GROUP BY e.id, e.title " +
            "ORDER BY SUM(o.totalAmount) DESC")
    List<RevenueReportDTO> getRevenueReportByOrganization(
            @Param("orgId") Long orgId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Add to OrderRepository.java
    @Query(value = "SELECT " +
            "TO_CHAR(DATE_TRUNC(:groupBy, o.created_at), 'YYYY-MM-DD') as period, " +
            "COUNT(o.id) as ordersCount, " +
            "SUM((SELECT COUNT(*) FROM tickets t WHERE t.order_id = o.id)) as ticketsSold, " +
            "SUM(o.total_amount) as revenue " +
            "FROM orders o " +
            "JOIN reservations r ON o.reservation_id = r.id " +
            "WHERE r.event_id = :eventId " +
            "AND o.status = 'CONFIRMED' " +
            "AND o.created_at BETWEEN :start AND :end " +
            "GROUP BY period " +
            "ORDER BY period ASC", nativeQuery = true)
    List<Object[]> getSalesTimeSeriesNative(
            @Param("eventId") Long eventId,
            @Param("groupBy") String groupBy, // 'day', 'week', 'month'
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // 2. Fix the Top Selling Events Query (The one from your latest log)
    @Query("SELECT new com.bluepal.dto.response.RevenueReportDTO(" +
            "e.id, e.title, COALESCE(SUM(o.totalAmount), 0.0), COALESCE(COUNT(i.id), 0L), " +
            "COALESCE(SUM(o.totalAmount) / NULLIF(COUNT(i.id), 0), 0.0)) " +
            "FROM Order o " +
            "JOIN o.reservation r " +
            "JOIN r.event e " +
            "LEFT JOIN o.items i " +
            "WHERE e.organization.id = :orgId " +
            "AND o.status = 'CONFIRMED' " +
            "GROUP BY e.id, e.title " +
            "ORDER BY COUNT(i.id) DESC") // Highest ticket count first
    List<RevenueReportDTO> findTopSellingEvents(
            @Param("orgId") Long orgId,
            Pageable pageable
    );

    // T4: Aggregate total revenue from confirmed orders
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.reservation.event.id = :eventId AND o.status = 'CONFIRMED'")
    Double getTotalRevenueByEvent(@Param("eventId") Long eventId);

    // T8: Fetch the 10 most recent orders for the dashboard activity feed
    @Query("SELECT o FROM Order o WHERE o.reservation.event.id = :eventId ORDER BY o.createdAt DESC")
    List<Order> findTop10ByEventIdOrderByCreatedAtDesc(@Param("eventId") Long eventId);

    // T4 & T7: Global org-wide aggregates
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.reservation.event.organization.id = :orgId AND o.status = 'CONFIRMED'")
    Double sumTotalRevenueByOrg(@Param("orgId") Long orgId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.order.reservation.event.organization.id = :orgId")
    Long countTotalTicketsSoldByOrg(@Param("orgId") Long orgId);
}