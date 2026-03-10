package com.bluepal.dto.request;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ORGANIZER|CHECK_IN_OPERATOR",
            message = "Role must be ORGANIZER or CHECK_IN_OPERATOR")
    private String role;
}