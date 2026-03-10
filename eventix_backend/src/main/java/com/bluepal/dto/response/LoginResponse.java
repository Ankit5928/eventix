package com.bluepal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    /**
     * EM-AUTH-002-T16: The Bearer JWT token valid for 24 hours.
     */
    private String token;

    /**
     * Unique identifier for the authenticated user.
     */
    private Long userId;

    /**
     * EM-AUTH-002-T9: List of organization IDs the user belongs to.
     * Required by the frontend to set the initial organization context.
     */
    private List<Long> organizationIds;

    /**
     * The primary role of the user (e.g., 'OWNER', 'ORGANIZER').
     */
    private String role;
}