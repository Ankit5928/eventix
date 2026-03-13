package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    // EM-RESERVE-001-T13: Link items with cascade to save automatically
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationItem> items = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;

    private String attendeeEmail;
    private String attendeeName;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    private boolean termsAccepted;

    @Column(name = "session_id")
    private String sessionId;

    // EM-PAY-004: Store the Stripe ID to link the payment to this record
    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    /**
     * EM-PAY-003: Helper to calculate the grand total for Stripe.
     * Iterates through all items and sums (Quantity * PriceAtReservation).
     */
    public double calculateTotal() {
        return items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPriceAtReservation())
                .sum();
    }
}