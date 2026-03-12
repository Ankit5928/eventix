package com.bluepal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtUtil.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtUtil.validateToken(jwt)) {
                // EM-AUTH-003-T22: Extract Organization Context for RLS
                List<Long> orgIds = jwtUtil.extractOrgIds(jwt);

                // For this request, we use the first Org ID or a header-specified ID
                // In a production multi-org scenario, the frontend usually sends
                // an 'X-Organization-Id' header to pick which context to use.
                String headerOrgId = request.getHeader("X-Organization-Id");
                if (headerOrgId != null) {
                    OrganizationContextHolder.setOrgId(Long.parseLong(headerOrgId));
                } else if (orgIds != null && !orgIds.isEmpty()) {
                    OrganizationContextHolder.setOrgId(orgIds.get(0));
                }

                List<String> jwtRoles = jwtUtil.extractRoles(jwt);
                List<SimpleGrantedAuthority> authorities = jwtRoles != null ? jwtRoles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList()) : List.of(new SimpleGrantedAuthority("ROLE_USER"));
                        
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // CRITICAL: Clear the context after the request finishes to prevent
            // thread-local leaks (NFR-002: Performance & Security)
            OrganizationContextHolder.clear();
        }
    }
}