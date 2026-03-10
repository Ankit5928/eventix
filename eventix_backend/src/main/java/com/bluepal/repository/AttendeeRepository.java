package com.bluepal.repository;

import com.bluepal.modal.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    boolean existsByReservationId(java.util.UUID reservationId);
}