package com.bluepal.dto;

import lombok.Builder;
import lombok.Data;
import com.bluepal.modal.Role;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private Role role;
}