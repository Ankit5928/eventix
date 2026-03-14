package com.bluepal.controller;

import com.bluepal.dto.UserDTO;
import com.bluepal.dto.request.AddUserRequest;
import com.bluepal.dto.response.OrganizationResponse;
import com.bluepal.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    /**
     * EM-AUTH-004-T6: Fetch organization details with associated users.
     * EM-AUTH-004-T7: Restricted to OWNER or SYSTEM_ADMIN roles.
     */
    @GetMapping("/{orgId}")
    // ORGANIZERs should be able to view their own organization details as well.
    @PreAuthorize("hasRole('OWNER') or hasRole('SYSTEM_ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<OrganizationResponse> getOrganization(
            @PathVariable Long orgId) throws AccessDeniedException {

        return ResponseEntity.ok(organizationService.getOrganizationById(orgId));
    }

    /**
     * EM-AUTH-005-T9: Add a new or existing user to the organization.
     * EM-AUTH-005-T10: Only an OWNER can perform this action.
     */
    @PostMapping("/{orgId}/users")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UserDTO> addUserToOrganization(
            @PathVariable Long orgId,
            @Valid @RequestBody AddUserRequest request) throws AccessDeniedException {

        UserDTO newUser = organizationService.addUserToOrganization(orgId, request);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }
}