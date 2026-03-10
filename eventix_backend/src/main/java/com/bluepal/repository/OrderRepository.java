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
    @Query("SELECT new com.bluepal.dto.response.RevenueReportDTO(" +
            "e.id, e.title, SUM(o.totalAmount), COUNT(t.id), AVG(o.totalAmount/1)) " +
            "FROM Order o " +
            "JOIN o.reservation r " +
            "JOIN r.event e " +
            "JOIN o.tickets t " +
            "WHERE e.organization.id = :orgId " +
            "AND o.status = 'CONFIRMED' " + // T8: Only confirmed revenue
            "AND (:startDate IS NULL OR o.createdAt >= :startDate) " + // T15: Date filters
            "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
            "GROUP BY e.id, e.title " +
            "ORDER BY SUM(o.totalAmount) DESC") // T10: Highest revenue first
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

    // Add to OrderRepository.java
    @Query("SELECT new com.bluepal.dto.response.RevenueReportDTO(" +
            "e.id, e.title, SUM(o.totalAmount), COUNT(t.id), AVG(o.totalAmount/1)) " +
            "FROM Order o " +
            "JOIN o.reservation r " +
            "JOIN r.event e " +
            "JOIN o.tickets t " +
            "WHERE e.organization.id = :orgId " +
            "AND o.status = 'CONFIRMED' " +
            "GROUP BY e.id, e.title " +
            "ORDER BY COUNT(t.id) DESC") // T3: Sort by volume (Tickets Sold)
    List<RevenueReportDTO> findTopSellingEvents(@Param("orgId") Long orgId, Pageable pageable);

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