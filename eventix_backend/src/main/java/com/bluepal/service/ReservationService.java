package com.bluepal.service;


import com.bluepal.dto.request.AttendeeDetailRequest;
import com.bluepal.dto.request.ReservationRequest;
import com.bluepal.dto.response.OrderItemDTO;
import com.bluepal.dto.response.ReservationResponse;
import com.bluepal.dto.response.ReservationSummaryDTO;
import com.bluepal.exception.InsufficientInventoryException;
import com.bluepal.exception.ReservationExpiredException;
import com.bluepal.modal.*;
import com.bluepal.repository.*;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final TicketCategoryRepository ticketCategoryRepository;
    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;

    @Transactional
    public Reservation createReservation(Long eventId, ReservationRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Reservation reservation = new Reservation();
        reservation.setEvent(event);
        reservation.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        reservation.setStatus(ReservationStatus.PENDING);

        for (ReservationRequest.TicketItemRequest itemReq : request.getItems()) {
            // T20: Pessimistic lock ensures we have the latest price and stock
            TicketCategory category = ticketCategoryRepository.findByIdForUpdate(itemReq.getTicketCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            if (category.getQuantityAvailable() < itemReq.getQuantity()) {
                throw new InsufficientInventoryException("Sold out: " + category.getName());
            }

            // T23: Atomically decrement
            category.setQuantityAvailable(category.getQuantityAvailable() - itemReq.getQuantity());
            ticketCategoryRepository.save(category);

            ReservationItem item = new ReservationItem();
            item.setReservation(reservation);
            item.setTicketCategory(category);
            item.setQuantity(itemReq.getQuantity());

            // EM-RESERVE-001-T28: Capture the price NOW to prevent future changes
            // from affecting this specific reservation.
            item.setPriceAtReservation(category.getPrice());

            reservation.getItems().add(item);
        }

        return reservationRepository.save(reservation);
    }
    public ReservationResponse getReservationStatus(UUID id) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        ReservationResponse response = new ReservationResponse();
        response.setReservationId(res.getId());
        response.setExpiresAt(res.getExpiresAt());
        response.setStatus(res.getStatus().toString());

        // Optional: Check if it is expired in real-time
        if (res.isExpired() && res.getStatus() == ReservationStatus.PENDING) {
            response.setStatus(ReservationStatus.EXPIRED.toString());
        }

        return response;
    }

    @Transactional
    public void updateAttendeeInfo(UUID reservationId, AttendeeDetailRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.isExpired()) {
            throw new RuntimeException("Reservation has expired");
        }

        reservation.setAttendeeName(request.getFirstName());
        reservation.setAttendeeEmail(request.getEmail());

        reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public ReservationSummaryDTO getReservationSummary(UUID reservationId) {
        // T4 & T9: Fetch with details or throw 404
        Reservation res = reservationRepository.findByIdWithDetails(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // T10: Return 400 if expired
        if (res.isExpired()) {
            throw new RuntimeException("Reservation has expired. Please start over.");
        }

        // T5 & T6: Calculate subtotals and grand total
        double grandTotal = 0.0;
        List<OrderItemDTO> itemDTOs = new ArrayList<>();

        for (ReservationItem item : res.getItems()) {
            double subtotal = item.getQuantity() * item.getPriceAtReservation();
            grandTotal += subtotal;

            itemDTOs.add(OrderItemDTO.builder()
                    .categoryName(item.getTicketCategory().getName())
                    .quantity(item.getQuantity())
                    .priceAtReservation(item.getPriceAtReservation())
                    .subtotal(subtotal)
                    .build());
        }

        // T7: Map to final summary
        return ReservationSummaryDTO.builder()
                .reservationId(res.getId())
                .eventName(res.getEvent().getTitle())
                .attendeeName(res.getAttendeeName())
                .attendeeEmail(res.getAttendeeEmail())
                .items(itemDTOs)
                .totalAmount(grandTotal)
                .expiresAt(res.getExpiresAt().toString())
                .build();
    }

    @Transactional
    public void addAttendeeInfo(UUID reservationId, AttendeeDetailRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.isExpired()) {
            throw new ReservationExpiredException("Reservation has expired");
        }

        // Map to the dedicated Attendee entity (EM-RESERVE-004-T13)
        Attendee attendee = Attendee.builder()
                .reservation(reservation)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        attendeeRepository.save(attendee);

        // Update the Reservation's flat fields if you still want them for quick access
        reservation.setAttendeeName(request.getFirstName() + " " + request.getLastName());
        reservation.setAttendeeEmail(request.getEmail());
        reservation.setTermsAccepted(request.isTermsAccepted());
        reservationRepository.save(reservation);
    }


    public boolean isReservationActive(UUID reservationId) {
        // T2: Check both status and the 15-minute clock
        return reservationRepository.findById(reservationId)
                .map(res -> res.getStatus() == ReservationStatus.PENDING && !res.isExpired())
                .orElse(false); // T3: Return false if not found or inactive
    }
    public void validateReservationForPayment(UUID reservationId) {
        if (!isReservationActive(reservationId)) {
            // T5 & T7: Triggers 400 Bad Request
            throw new ReservationExpiredException("Your ticket hold has expired. Please return to the event page to try again.");
        }
    }


    @Transactional
    public ReservationResponse createAnonymousReservation(Long eventId, ReservationRequest request) {
        // T3: Generate a temporary session ID for this guest
        String guestSessionId = UUID.randomUUID().toString();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Reservation reservation = Reservation.builder()
                .event(event)
                .sessionId(guestSessionId)
                .status(ReservationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .items(new ArrayList<>())
                .build();

        // Fix: Using TicketItemRequest as defined in your DTO
        for (ReservationRequest.TicketItemRequest item : request.getItems()) {
            // Fix: Use the correct method name getTicketCategoryId()
            TicketCategory category = ticketCategoryRepository.findById(item.getTicketCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + item.getTicketCategoryId()));

            // T2: Use your modal logic to reserve stock
            category.reserveStock(item.getQuantity());

            ReservationItem resItem = ReservationItem.builder()
                    .reservation(reservation)
                    .ticketCategory(category)
                    .quantity(item.getQuantity())
                    .priceAtReservation(category.getPrice())
                    .build();

            reservation.getItems().add(resItem);
        }

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(java.util.UUID reservationId) {
        // 1. Fetch from repository
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));

        // 2. Check if the reservation has already expired
        if (reservation.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("This reservation has expired. Please select tickets again.");
        }

        // 3. Reuse our existing mapper to return the DTO
        return mapToResponse(reservation);
    }

    /**
     * T31: Maps the Reservation entity to a structured response for the Frontend.
     */
    private ReservationResponse mapToResponse(Reservation reservation) {
        // Calculate the total amount across all ticket items
        Double totalAmount = reservation.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getPriceAtReservation())
                .sum();

        // Map individual items to ItemDto
        List<ReservationResponse.ItemDto> itemDtos = reservation.getItems().stream()
                .map(item -> ReservationResponse.ItemDto.builder()
                        .categoryName(item.getTicketCategory().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPriceAtReservation())
                        .subtotal(item.getQuantity() * item.getPriceAtReservation())
                        .build())
                .collect(Collectors.toList());

        return ReservationResponse.builder()
                .reservationId(reservation.getId())
                .eventId(reservation.getEvent().getId())
                .eventTitle(reservation.getEvent().getTitle())
                .expiresAt(reservation.getExpiresAt()) // CRITICAL: Used for the 10-min timer
                .status(reservation.getStatus().toString())
                .totalAmount(totalAmount)
                .items(itemDtos)
                .build();
    }
}