package com.bluepal.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckInResponse {
    private boolean success;
    private String message;
    private String checkInTime;
    private String attendeeName;
}