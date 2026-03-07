package com.bluepal.repository;

import com.bluepal.modal.EventTicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventTicketTypeRepository extends JpaRepository<EventTicketType, Long> {

    List<EventTicketType> findByEventId(Long eventId);

}