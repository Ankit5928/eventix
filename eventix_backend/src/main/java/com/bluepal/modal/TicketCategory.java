package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "ticket_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class TicketCategory {
    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String name; // e.g., "VIP"

    private String description; // e.g., "Front row access"

    @Column(nullable = false)
    private Double price; // 5000

    @Column(nullable = false)
    private Integer quantityTotal; // 50

    @Column(nullable = false)
    private Integer quantityAvailable; // Decrements in real-time

    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Inside TicketCategory.java
    public boolean isSalesPeriodActive() {
        LocalDateTime now = LocalDateTime.now();

        // If start is set, must be after start. If end is set, must be before end.
        boolean hasStarted = (salesStart == null || now.isAfter(salesStart));
        boolean hasNotEnded = (salesEnd == null || now.isBefore(salesEnd));

        return hasStarted && hasNotEnded;
    }


    // Inside com.bluepal.modal.TicketCategory

    /**
     * Checks if there are enough tickets available for a reservation.
     */
    public boolean hasStock(int requestedQuantity) {
        return quantityAvailable >= requestedQuantity;
    }

    /**
     * Decrements the stock.
     * Note: This should be called within a Transactional service
     * using a Pessimistic Lock for thread safety.
     */
    public void reserveStock(int quantity) {
        if (!hasStock(quantity)) {
            throw new RuntimeException("Not enough tickets available for category: " + this.name);
        }
        this.quantityAvailable -= quantity;
    }

    /**
     * Restores stock if a reservation expires or is cancelled.
     */
    public void releaseStock(int quantity) {
        this.quantityAvailable += quantity;
    }

}