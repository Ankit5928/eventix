package com.bluepal.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_STRING = "bluepal_eventix_secure_key_1234567890_must_be_very_long_at_least_32_chars";
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

    /**
     * EM-AUTH-002-T3: Standard login token generation with all permitted orgs and roles.
     */
    public String generateToken(String email, List<Long> orgIds, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("orgIds", orgIds); // List of all organizations user belongs to
        claims.put("roles", roles);   // User roles (RBAC)
        return createToken(claims, email);
    }

    /**
     * EM-AUTH-006-T4: Overloaded method for Organization Switching.
     * EM-AUTH-006-T5: Sets a specific 'activeOrgId' to define the RLS context.
     */
    public String generateToken(String email, Long activeOrgId, List<Long> orgIds, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("activeOrgId", activeOrgId);
        claims.put("orgIds", orgIds);
        claims.put("roles", roles);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // EM-AUTH-002-T7: Token valid for 24 hours
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * EM-AUTH-003-T22: Extract the active Organization ID for RLS context.
     * Prioritizes 'activeOrgId' from a switch, falls back to the first available org.
     */
    public Long extractActiveOrgId(String token) {
        final Claims claims = extractAllClaims(token);
        if (claims == null) return null;

        Object activeId = claims.get("activeOrgId");
        if (activeId != null) {
            return Long.valueOf(activeId.toString());
        }

        // Fallback: If no activeOrgId is set (initial login), take the first from orgIds list
        List<Long> orgIds = extractOrgIds(token);
        return (orgIds != null && !orgIds.isEmpty()) ? orgIds.get(0) : null;
    }

    public List<Long> extractOrgIds(String token) {
        final Claims claims = extractAllClaims(token);
        if (claims == null) return null;
        Object orgIdsObj = claims.get("orgIds");
        if (orgIdsObj instanceof List) {
            return ((List<?>) orgIdsObj).stream()
                    .map(id -> Long.valueOf(id.toString()))
                    .collect(Collectors.toList());
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        final Claims claims = extractAllClaims(token);
        return (claims != null) ? (List<String>) claims.get("roles") : null;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return (claims != null) ? claimsResolver.apply(claims) : null;
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            return null;
        }
    }

    public Boolean validateToken(String token) {
        return extractAllClaims(token) != null && !isTokenExpired(token);
    }

    private Boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration != null && expiration.before(new Date());
    }
}