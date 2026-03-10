package com.bluepal.security;

public class OrganizationContextHolder {
    private static final ThreadLocal<Long> currentOrgId = new ThreadLocal<>();

    public static void setOrgId(Long orgId) { currentOrgId.set(orgId); }
    public static Long getOrgId() { return currentOrgId.get(); }
    public static void clear() { currentOrgId.remove(); }
}
