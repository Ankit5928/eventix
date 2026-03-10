package com.bluepal.repository;


import com.bluepal.modal.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    @Query("SELECT o FROM Organization o " +
            "LEFT JOIN FETCH o.userOrganizations uo " +
            "LEFT JOIN FETCH uo.user " +
            "WHERE o.id = :orgId")
    Optional<Organization> findByIdWithMembers(@Param("orgId") Long orgId);

    boolean existsByName(String name);
}