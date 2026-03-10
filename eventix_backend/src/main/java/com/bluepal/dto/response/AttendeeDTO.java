package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AttendeeDTO {
    private String name;
    private String email;
    private String ticketCategory;
    private UUID ticketCode;
    private boolean checkedIn;
}