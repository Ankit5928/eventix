package com.bluepal.service;



import com.bluepal.dto.request.LoginRequest;
import com.bluepal.dto.request.RegisterRequest;
import com.bluepal.dto.request.SwitchOrganizationRequest;
import com.bluepal.dto.request.SetPasswordRequest;
import com.bluepal.dto.response.LoginResponse;
import com.bluepal.modal.Organization;
import com.bluepal.modal.PasswordResetToken;
import com.bluepal.modal.User;
import com.bluepal.modal.UserOrganization;
import com.bluepal.modal.Role;
import com.bluepal.repository.OrganizationRepository;
import com.bluepal.repository.PasswordResetTokenRepository;
import com.bluepal.repository.UserOrganizationRepository;
import com.bluepal.repository.UserRepository;
import com.bluepal.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public void registerOrganization(RegisterRequest request) {
        // Validation (Task T18)
        if (organizationRepository.existsByName(request.getOrganizationName())) {
            throw new IllegalStateException("Organization name already taken");
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
        user.setRole(Role.OWNER); // Set Global User Role
        user = userRepository.save(user);

        // 3. Create Association in Junction Table (Task T16: Atomic)
        UserOrganization association = new UserOrganization();
        association.setUser(user);
        association.setOrganization(organization);
        association.setRole(Role.OWNER);
        userOrganizationRepository.save(association);
    }

    public LoginResponse login(LoginRequest request) {
        // EM-AUTH-002-T11: Fetch user with their organization context
        User user = userRepository.findByEmailWithOrganizations(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // EM-AUTH-002-T12: Verify password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // EM-AUTH-002-T14: Extract organization IDs and roles for JWT claims
        List<Long> orgIds = user.getUserOrganizations().stream()
                .map(uo -> uo.getOrganization().getId())
                .collect(Collectors.toList());

        List<String> roles = user.getUserOrganizations().stream()
                .map(uo -> uo.getRole().name())
                .distinct()
                .collect(Collectors.toList());

        // EM-AUTH-002-T13: Generate the token (valid for 24 hours)
        String token = jwtUtil.generateToken(user.getEmail(), orgIds, roles);

        Role primaryRole = user.getRole();
        if (user.getUserOrganizations() != null && !user.getUserOrganizations().isEmpty()) {
            primaryRole = user.getUserOrganizations().get(0).getRole();
        }

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .organizationIds(orgIds)
                .role(primaryRole)
                .build();
    }
    public LoginResponse switchOrganization(SwitchOrganizationRequest request) throws AccessDeniedException {
        // Get current authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // EM-AUTH-006-T3: Verify user belongs to the target organization
        List<UserOrganization> userOrgs = userOrganizationRepository.findByUser(user);

        UserOrganization targetOrg = userOrgs.stream()
                .filter(uo -> uo.getOrganization().getId().equals(request.getOrganizationId()))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("EM-AUTH-006-T8: You do not belong to this organization"));

        List<Long> orgIds = userOrgs.stream()
                .map(uo -> uo.getOrganization().getId())
                .collect(Collectors.toList());
        // EM-AUTH-006-T4 & T5: Generate new JWT with updated organization context
        // We pass the new orgId to be embedded in the token claims
        String newToken = jwtUtil.generateToken(
                user.getEmail(),
                targetOrg.getOrganization().getId(),
                orgIds,
                List.of(targetOrg.getRole().name())
        );



        return LoginResponse.builder()
                .token(newToken)
                .userId(user.getId())
                .organizationIds(orgIds)
                .role(targetOrg.getRole())
                .build();
    }

    @Transactional
    public void setPassword(SetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Clean up all tokens for this user once they set their password
        tokenRepository.deleteByUser(user);
    }
}