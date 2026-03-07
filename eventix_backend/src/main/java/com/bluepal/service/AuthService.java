package com.bluepal.service;



import com.bluepal.dto.request.LoginRequest;
import com.bluepal.dto.request.RegisterRequest;
import com.bluepal.dto.response.LoginResponse;
import com.bluepal.modal.Organization;
import com.bluepal.modal.User;
import com.bluepal.modal.UserOrganization;
import com.bluepal.repository.OrganizationRepository;
import com.bluepal.repository.UserOrganizationRepository;
import com.bluepal.repository.UserRepository;
import com.bluepal.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public void registerOrganization(RegisterRequest request) {
        // Validation (Task T18)
        if (organizationRepository.existsByName(request.getOrganizationName())) {
            throw new RuntimeException("Organization name already taken");
        }
        if (userRepository.existsByEmail(request.getOwnerEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 1. Save Organization
        Organization organization = new Organization();
        organization.setName(request.getOrganizationName());
        organization = organizationRepository.save(organization);

        // 2. Save User (Task T17: BCrypt hashing)
        User user = new User();
        user.setEmail(request.getOwnerEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);

        // 3. Create Association in Junction Table (Task T16: Atomic)
        UserOrganization association = new UserOrganization();
        association.setUser(user);
        association.setOrganization(organization);
        association.setRole("OWNER");
        userOrganizationRepository.save(association);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user.getId(), user.getEmail());
    }
}