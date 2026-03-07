package com.bluepal.repository;

import com.bluepal.modal.UserOrganization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {
}