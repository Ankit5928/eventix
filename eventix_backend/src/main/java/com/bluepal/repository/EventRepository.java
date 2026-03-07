package com.bluepal.repository;

import com.bluepal.modal.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizationId(Long organizationId);

    List<Event> findByStartDateAfter(LocalDateTime date);

}