package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "reservation_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class ReservationItem {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "ticket_category_id")
    private TicketCategory ticketCategory;

    private Integer quantity;

    @Column(nullable = false)
    private Double priceAtReservation;
}
