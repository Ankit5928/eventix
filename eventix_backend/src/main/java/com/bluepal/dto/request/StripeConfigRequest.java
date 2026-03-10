package com.bluepal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class StripeConfigRequest {
    @NotBlank
    @Pattern(regexp = "^pk_.*")
    private String publishableKey;

    @NotBlank @Pattern(regexp = "^sk_.*")
    private String secretKey;
}
