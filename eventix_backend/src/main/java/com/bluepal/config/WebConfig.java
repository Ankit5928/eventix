package com.bluepal.config;

import com.bluepal.security.TenantInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final TenantInterceptor tenantInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // EM-AUTH-003-T22: Apply RLS interceptor to all API routes
        registry.addInterceptor(tenantInterceptor)
                .addPathPatterns("/api/v1/**")           // Run for all API endpoints
                .excludePathPatterns("/api/v1/auth/**")  // Exclude login/signup (no org context yet)
                .excludePathPatterns("/swagger-ui/**")   // Exclude documentation
                .excludePathPatterns("/v3/api-docs/**");
    }
}
