package com.bluepal.security;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class TenantInterceptor implements HandlerInterceptor {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Long orgId = OrganizationContextHolder.getOrgId();
        if (orgId != null) {
            // EM-AUTH-003-T22: Set the local session variable for RLS
            jdbcTemplate.execute("SET LOCAL app.current_org = '" + orgId + "'");
        }
        return true;
    }
}