package com.bluepal.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_organization")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOrganization {

    @EmbeddedId
    private UserOrganizationId id = new UserOrganizationId();   // ⭐ IMPORTANT FIX

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("organizationId")
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(nullable = false)
    private String role;
}