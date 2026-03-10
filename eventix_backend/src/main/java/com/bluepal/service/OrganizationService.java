package com.bluepal.service;


import com.bluepal.dto.UserDTO;
import com.bluepal.dto.request.AddUserRequest;
import com.bluepal.dto.request.StripeConfigRequest;
import com.bluepal.dto.response.OrganizationResponse;
import com.bluepal.modal.Organization;
import com.bluepal.modal.User;
import com.bluepal.modal.UserOrganization;
import com.bluepal.repository.OrganizationRepository;
import com.bluepal.repository.UserOrganizationRepository;
import com.bluepal.repository.UserRepository;
import com.bluepal.security.EncryptionService;
import com.bluepal.security.OrganizationContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final UserOrganizationRepository userOrgRepository;
    private final PasswordEncoder  passwordEncoder;
    private final EncryptionService encryptionService;

    @Transactional(readOnly = true)
    public OrganizationResponse getOrganizationById(Long orgId) throws AccessDeniedException {

        Long currentAuthenticatedOrgId = OrganizationContextHolder.getOrgId();

        if (!orgId.equals(currentAuthenticatedOrgId)) {
            throw new AccessDeniedException("Access Denied: You do not belong to this organization.");
        }
        // Using the optimized repository method (EM-AUTH-004-T4)
        Organization org = organizationRepository.findByIdWithMembers(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        List<UserDTO> memberDTOs = org.getUserOrganizations().stream()
                .map(uo -> UserDTO.builder()
                        .id(uo.getUser().getId())
                        .email(uo.getUser().getEmail())
                        .role(uo.getRole())
                        .build())
                .collect(Collectors.toList());

        return OrganizationResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .createdAt(org.getCreatedAt())
                .members(memberDTOs)
                .build();
    }

    @Transactional
    public UserDTO addUserToOrganization(Long orgId, AddUserRequest request) throws AccessDeniedException {
        // EM-AUTH-005-T10: Security check - Verify current user belongs to this org
        if (!orgId.equals(OrganizationContextHolder.getOrgId())) {
            throw new AccessDeniedException("Unauthorized access to this organization");
        }

        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // EM-AUTH-005-T4: Check if user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> createNewUser(request.getEmail()));

        // EM-AUTH-005-T5: Prevent duplicate association
        if (userOrgRepository.existsByUserAndOrganization(user, org)) {
            throw new RuntimeException("User is already a member of this organization");
        }

        // EM-AUTH-005-T8: Create association
        UserOrganization association = UserOrganization.builder()
                .user(user)
                .organization(org)
                .role(request.getRole())
                .build();

        userOrgRepository.save(association);
        log.info("User {} added to Organization {} as {}", user.getEmail(), org.getName(), request.getRole());
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(request.getRole())
                .build();
    }

    private User createNewUser(String email) {
        // EM-AUTH-005-T6 & T7: Create new user with secure temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0, 12);

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPasswordHash(passwordEncoder.encode(tempPassword));

        log.info("EM-AUTH-005-T13: Placeholder - Email would be sent to {} with temp password: {}", email, tempPassword);
        return userRepository.save(newUser);
    }

    public void updateStripeConfig(Long orgId, StripeConfigRequest request) throws Exception {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        org.setStripePublishableKey(request.getPublishableKey());
        // T10: Encrypt secret key before storing
        org.setStripeSecretKey(encryptionService.encrypt(request.getSecretKey()));

        organizationRepository.save(org);
    }

    public String getPublishableKey(Long orgId) {
        return organizationRepository.findById(orgId)
                .map(Organization::getStripePublishableKey)
                .orElseThrow(() -> new RuntimeException("Stripe config not found for this organization"));
    }
}