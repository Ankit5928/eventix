package com.bluepal.scheduler;


import com.bluepal.modal.Reservation;
import com.bluepal.modal.ReservationStatus;
import com.bluepal.modal.TicketCategory;
import com.bluepal.repository.ReservationRepository;
import com.bluepal.repository.TicketCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final TicketCategoryRepository categoryRepository;

    /**
     * EM-RESERVE-002-T1: Runs every minute to release expired ticket holds.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredReservations() {
        // EM-RESERVE-002-T5: Find all PENDING reservations that have expired
        List<Reservation> expiredReservations = reservationRepository
                .findByStatusAndExpiresAtBefore(ReservationStatus.PENDING, LocalDateTime.now());

        if (expiredReservations.isEmpty()) return;

        log.info("Found {} expired reservations to release", expiredReservations.size());

        for (Reservation reservation : expiredReservations) {
            // EM-RESERVE-002-T8: Return tickets to the available pool
            for (var item : reservation.getItems()) {
                TicketCategory category = item.getTicketCategory();
                category.setQuantityAvailable(category.getQuantityAvailable() + item.getQuantity());
                categoryRepository.save(category);
            }

            // EM-RESERVE-002-T12: Update status to EXPIRED
            reservation.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(reservation);
        }
    }
}