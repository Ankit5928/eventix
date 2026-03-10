package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    private String timezone;

    @Builder.Default
    @Column(nullable = false)
    private String visibility = "PUBLIC";

    @Builder.Default
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    // Inside Event.java

    // T13: Specific venue info (e.g., "Hall A" or "Meeting Room 2")
    @Column(name = "venue_details", columnDefinition = "TEXT")
    private String venueDetails;

    // T12: Mapping your existing imagePath to a getter named getImageUrl
    public String getImageUrl() {
        return this.imagePath;
    }

    // T12: Mapping your existing location to a getter named getVenueDetails if field is missing
    public String getVenueDetails() {
        return this.venueDetails != null ? this.venueDetails : this.location;
    }
    // Inside Event.java - PrePersist
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        // Use string literals or a local Enum, never compare to Spring AOT classes
        if (this.visibility == null) {
            this.visibility = "PUBLIC";
        }

        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder.Default
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketCategory> ticketCategories = new ArrayList<>();

    // Helper method to add categories safely
    public void addTicketCategory(TicketCategory category) {
        ticketCategories.add(category);
        category.setEvent(this);
    }
}