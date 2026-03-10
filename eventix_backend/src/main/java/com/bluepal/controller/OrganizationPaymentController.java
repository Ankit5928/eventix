package com.bluepal.controller;


import com.bluepal.dto.request.StripeConfigRequest;
import com.bluepal.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationPaymentController {

    private final OrganizationService organizationService;

    /**
     * EM-PAY-001-T12: Update Stripe configuration (Publishable & Secret keys).
     * EM-PAY-001-T13: Restricted to OWNER role only.
     */
    @PutMapping("/{orgId}/stripe-config")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> updateStripeConfig(
            @PathVariable Long orgId,
            @Valid @RequestBody StripeConfigRequest request) throws Exception {

        organizationService.updateStripeConfig(orgId, request);
        return ResponseEntity.ok("Stripe configuration updated successfully"); // T14
    }

    /**
     * EM-PAY-001-T15: Retrieve the publishable key for the frontend Stripe elements.
     * EM-PAY-001-T16: NEVER returns the secret key.
     */
    @GetMapping("/{orgId}/stripe-publishable-key")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<String> getPublishableKey(@PathVariable Long orgId) {
        String publishableKey = organizationService.getPublishableKey(orgId);
        return ResponseEntity.ok(publishableKey);
    }
}
