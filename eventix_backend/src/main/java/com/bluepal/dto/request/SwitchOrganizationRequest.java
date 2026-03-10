package com.bluepal.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SwitchOrganizationRequest {
    @NotNull(message = "Target Organization ID is required")
    private Long organizationId;
}