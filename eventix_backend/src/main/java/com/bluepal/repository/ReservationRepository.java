package com.bluepal.repository;

import com.bluepal.modal.Reservation;
import com.bluepal.modal.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    // EM-RESERVE-002: Finds PENDING reservations that have passed their expiry time
    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' AND r.expiresAt < :now")
    List<Reservation> findAllExpired(@Param("now") LocalDateTime now);

    List<Reservation> findByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime now);

    List<Reservation> findByAttendeeEmail(String email);

    /**
     * EM-PAY-005: Fetches the reservation with all ticket items and event details
     * in a single query to avoid LazyInitializationException in the Webhook.
     */
    @Query("SELECT r FROM Reservation r " +
            "LEFT JOIN FETCH r.items i " +
            "LEFT JOIN FETCH i.ticketCategory " +
            "LEFT JOIN FETCH r.event " +
            "WHERE r.id = :id")
    Optional<Reservation> findByIdWithDetails(@Param("id") UUID id);

    // EM-PAY-004: Used by Webhook to find the reservation based on Stripe's signal
    Optional<Reservation> findByStripePaymentIntentId(String stripePaymentIntentId);
}