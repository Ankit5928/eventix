package com.bluepal.repository;

import com.bluepal.dto.response.PublicEventDTO;
import com.bluepal.modal.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Finds all public and active events across all organizations
    Page<Event> findAllByVisibilityAndStatus(String visibility, String status, Pageable pageable);

    // Inside EventRepository.java
    @Query("SELECT e FROM Event e WHERE e.visibility = 'PUBLIC' AND e.status = 'ACTIVE'")
    Page<Event> findAllPublicEvents(Pageable pageable);

    Page<Event> findByOrganizationId(Long organizationId, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.organization.id = :orgId " +
            "AND (:search IS NULL OR LOWER(CAST(e.title AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Event> searchByTitle(@Param("orgId") Long orgId,
                              @Param("search") String search,
                              Pageable pageable);

    Page<Event> findByStartDateAfter(LocalDateTime date, Pageable pageable);

    Long countByOrganizationId(Long orgId);

    // T6: Active events (Published and not yet started/finished)
    @Query("SELECT COUNT(e) FROM Event e WHERE e.organization.id = :orgId AND e.status = 'ACTIVE' AND e.startDate > CURRENT_TIMESTAMP")
    Long countActiveEvents(@Param("orgId") Long orgId);

    // T8: Next 5 upcoming events
    @Query("SELECT e FROM Event e WHERE e.organization.id = :orgId AND e.startDate > CURRENT_TIMESTAMP ORDER BY e.startDate ASC")
    List<Event> findTop5UpcomingEvents(@Param("orgId") Long orgId, Pageable pageable);

    // Add to EventRepository.java
    @Query("SELECT new com.bluepal.dto.response.PublicEventDTO(" +
            "e.id, e.title, e.description, e.startDate, e.location, e.imagePath, MIN(tc.price)) " +
            "FROM Event e " +
            "JOIN e.ticketCategories tc " +
            "WHERE e.visibility = 'PUBLIC' " +
            "AND e.status = 'ACTIVE' " +
            "AND e.startDate >= CURRENT_TIMESTAMP " +
            "GROUP BY e.id, e.title, e.description, e.startDate, e.location, e.imagePath " +
            "ORDER BY e.startDate ASC")
    Page<PublicEventDTO> findPublicUpcomingEvents(Pageable pageable);

    // Update EventRepository.java
    @Query("SELECT new com.bluepal.dto.response.PublicEventDTO(" +
            "e.id, e.title, e.description, e.startDate, e.location, e.imagePath, MIN(tc.price)) " +
            "FROM Event e " +
            "JOIN e.ticketCategories tc " +
            "WHERE e.visibility = 'PUBLIC' " +
            "AND e.status = 'ACTIVE' " +
            "AND e.startDate >= CURRENT_TIMESTAMP " +
            "AND (:search IS NULL OR " +
            "     (LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "      OR LOWER(e.location) LIKE LOWER(CONCAT('%', :search, '%')))) " +
            "GROUP BY e.id, e.title, e.description, e.startDate, e.location, e.imagePath " +
            "ORDER BY e.startDate ASC")
    Page<PublicEventDTO> findPublicUpcomingEventsWithSearch(
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT new com.bluepal.dto.response.PublicEventDTO(" +
            "e.id, e.title, e.description, e.startDate, e.location, e.imagePath, MIN(tc.price)) " +
            "FROM Event e " +
            "JOIN e.ticketCategories tc " +
            "WHERE e.visibility = 'PUBLIC' " +
            "AND e.status = 'ACTIVE' " +
            "AND e.startDate >= CURRENT_TIMESTAMP " +
            // CAST the parameters to their respective types so Postgres knows how to handle NULL checks
            "AND (CAST(:startDate AS localdatetime) IS NULL OR e.startDate >= :startDate) " +
            "AND (CAST(:endDate AS localdatetime) IS NULL OR e.startDate <= :endDate) " +
            "AND (CAST(:search AS string) IS NULL OR (LOWER(CAST(e.title AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))) " +
            "GROUP BY e.id, e.title, e.description, e.startDate, e.location, e.imagePath " +
            "ORDER BY e.startDate ASC")
    Page<PublicEventDTO> findPublicEventsFiltered(
            @Param("search") String search,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

}