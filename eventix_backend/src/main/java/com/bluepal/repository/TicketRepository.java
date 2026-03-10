package com.bluepal.repository;

import com.bluepal.dto.response.CheckInStatsDTO;
import com.bluepal.modal.Ticket;
import org.antlr.v4.runtime.misc.MultiMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByOrderId(UUID orderId);
    boolean existsByOrderId(UUID orderId);
    // Add to TicketRepository.java
    @Query("SELECT new com.bluepal.dto.response.CheckInStatsDTO$CategoryBreakdownDTO(" +
            "tc.name, " +
            "SUM(CASE WHEN t.checkedIn = true THEN 1 ELSE 0 END), " +
            "COUNT(t)) " +
            "FROM Ticket t JOIN t.ticketCategory tc " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "GROUP BY tc.name")
    List<CheckInStatsDTO.CategoryBreakdownDTO> getCategoryBreakdown(@Param("eventId") Long eventId);
    Optional<Ticket> findByTicketCode(UUID ticketCode);

    @Query("SELECT t FROM Ticket t " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "AND LOWER(t.attendeeName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Ticket> findByEventIdAndAttendeeNameContaining(
            @Param("eventId") Long eventId,
            @Param("name") String name,
            Pageable pageable
    );

    // Add to TicketRepository.java
    @Query("SELECT t FROM Ticket t " +
            "JOIN FETCH t.ticketCategory " +
            "WHERE t.order.reservation.event.id = :eventId")
    Page<Ticket> findByEventId(@Param("eventId") Long eventId, Pageable pageable);

    // Add to TicketRepository.java
    @Query("SELECT t FROM Ticket t " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "AND (LOWER(t.attendeeName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(t.attendeeEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Ticket> searchByEventAndNameOrEmail(
            @Param("eventId") Long eventId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    // Add to TicketRepository.java
    @Query("SELECT t FROM Ticket t " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "AND (:categoryId IS NULL OR t.ticketCategory.id = :categoryId) " +
            "AND (:searchTerm IS NULL OR " +
            "     (LOWER(t.attendeeName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "      OR LOWER(t.attendeeEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%'))))")
    Page<Ticket> findByEventWithFilters(
            @Param("eventId") Long eventId,
            @Param("categoryId") UUID categoryId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );


    // Add to TicketRepository.java
    @Query("SELECT t FROM Ticket t " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "AND (:categoryId IS NULL OR t.ticketCategory.id = :categoryId) " +
            "AND (:checkedIn IS NULL OR t.checkedIn = :checkedIn) " + // T2-T3: The Status Filter
            "AND (:searchTerm IS NULL OR " +
            "     (LOWER(t.attendeeName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "      OR LOWER(t.attendeeEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%'))))")
    Page<Ticket> findByEventWithAllFilters(
            @Param("eventId") Long eventId,
            @Param("categoryId") UUID categoryId,
            @Param("checkedIn") Boolean checkedIn, // null = All, true = In, false = Out
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    // Add to TicketRepository.java
    @Query("SELECT t FROM Ticket t " +
            "WHERE t.order.reservation.event.id = :eventId " +
            "AND (:categoryId IS NULL OR t.ticketCategory.id = :categoryId) " +
            "AND (:checkedIn IS NULL OR t.checkedIn = :checkedIn) " +
            "AND (:searchTerm IS NULL OR " +
            "     (LOWER(t.attendeeName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "      OR LOWER(t.attendeeEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%')))) " +
            "ORDER BY t.createdAt DESC")
    List<Ticket> findAllByEventWithFilters(
            @Param("eventId") Long eventId,
            @Param("categoryId") UUID categoryId,
            @Param("checkedIn") Boolean checkedIn,
            @Param("searchTerm") String searchTerm
    );
    // T5: Count total tickets sold for an event
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.order.reservation.event.id = :eventId")
    Long countByEventId(@Param("eventId") Long eventId);

    // T7: Count how many people have actually checked in
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.order.reservation.event.id = :eventId AND t.checkedIn = true")
    Long countCheckedInByEventId(@Param("eventId") Long eventId);
}