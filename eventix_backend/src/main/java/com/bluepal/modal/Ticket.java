package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {
    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_category_id")
    private TicketCategory ticketCategory;

    @Column(unique = true, nullable = false)
    private String ticketCode;

    private String attendeeName;
    private String attendeeEmail;

    private String qrCodePath;
    private String pdfPath;

    private boolean checkedIn = false;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt = LocalDateTime.now();
}