package com.bluepal.controller;

import com.bluepal.dto.request.LoginRequest;
import com.bluepal.dto.request.RegisterRequest;
import com.bluepal.dto.request.SwitchOrganizationRequest;
import com.bluepal.dto.response.LoginResponse;
import com.bluepal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // EM-AUTH-001-T19: Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.registerOrganization(request);
            return new ResponseEntity<>("Organization and Owner registered successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // EM-AUTH-001-T21: Basic error handling for duplicates
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/switch-organization")
    public ResponseEntity<LoginResponse> switchOrganization(
            @Valid @RequestBody SwitchOrganizationRequest request) throws AccessDeniedException {

        LoginResponse response = authService.switchOrganization(request);
        return ResponseEntity.ok(response);
    }
}