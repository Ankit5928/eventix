package com.bluepal.repository;

import com.bluepal.modal.TicketCategory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, UUID> {

    // Lock row for update (prevent overselling)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT tc FROM TicketCategory tc WHERE tc.id = :id")
    Optional<TicketCategory> findByIdForUpdate(@Param("id") UUID id);

    List<TicketCategory> findByEventId(Long eventId);

    @Modifying
    @Query("UPDATE TicketCategory tc " +
            "SET tc.quantityAvailable = tc.quantityAvailable - :qty " +
            "WHERE tc.id = :id AND tc.quantityAvailable >= :qty")
    int decrementAvailability(@Param("id") UUID id, @Param("qty") Integer qty);

    @Modifying
    @Query("UPDATE TicketCategory tc " +
            "SET tc.quantityAvailable = tc.quantityAvailable + :qty " +
            "WHERE tc.id = :id")
    int incrementAvailability(@Param("id") UUID id, @Param("qty") Integer qty);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TicketCategory t WHERE t.id = :id")
    Optional<TicketCategory> findByIdWithLock(@Param("id") UUID id);

    @Query("SELECT SUM(tc.quantityTotal) FROM TicketCategory tc WHERE tc.event.id = :eventId")
    Long getTotalCapacityByEvent(@Param("eventId") Long eventId);
}