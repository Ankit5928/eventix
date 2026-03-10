package com.bluepal.repository;

import com.bluepal.modal.Organization;
import com.bluepal.modal.User;
import com.bluepal.modal.UserOrganization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserOrganizationRepository extends JpaRepository<UserOrganization, Long> {
    boolean existsByUserAndOrganization(User user, Organization org);
    List<UserOrganization> findByUser(User user);
}