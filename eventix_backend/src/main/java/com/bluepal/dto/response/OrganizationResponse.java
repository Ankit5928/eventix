package com.bluepal.dto.response;

import com.bluepal.dto.UserDTO;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrganizationResponse {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private List<UserDTO> members;
}