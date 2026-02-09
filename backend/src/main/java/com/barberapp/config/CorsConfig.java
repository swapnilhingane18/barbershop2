package com.barberapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS Configuration
 * 
 * Allows cross-origin requests from frontend applications.
 * 
 * PRODUCTION NOTE:
 * - Change allowedOrigins("*") to specific domains (e.g.,
 * "https://yourdomain.com")
 * - Consider using environment variables for allowed origins
 * - Review allowedMethods based on actual API requirements
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // TODO: Replace with specific origins in production
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false); // Set to true if using cookies/auth
    }
}
