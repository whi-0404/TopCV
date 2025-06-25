package com.TopCV.configuration.SecurityConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/ws/**",
            "/api/v1/auth/**",
            "/api/v1/users/register/**",
            "/api/v1/users/verify-email/**", // Allow email verification without authentication
            "/api/v1/users/otp/**", 
            "/api/v1/employers/register/**",
            "/api/v1/employers/verify-email/**", // Allow employer email verification
            "/api/v1/companies/search/**",
            "/api/v1/companies/{id}/**", // Public company details
            "/api/v1/job-types/**",
            "/api/v1/job-posts/search/**",
            "/api/v1/job-posts/{id}/**", // Public job details
            "/api/v1/job-levels/**",
            "/api/v1/skills/**",
            "/api/v1/ai/**",  // AI endpoints for testing
            "/api/v1/resumes/debug-application/**", // Debug endpoints
            "/api/v1/resumes/debug-all-applications", // Debug all applications
            "/api/v1/resumes/test-debug/**", // Debug endpoints
            "/uploads/**", // Static files (logos, resumes, etc.)
    };

    @Bean
    public SecurityFilterChain securedSecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/companies", "/api/v1/companies/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/companies/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/job-posts", "/api/v1/job-posts/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/job-posts/{id}").permitAll()
                        .requestMatchers("/api/v1/auth/logout").authenticated()
                        .requestMatchers("/api/v1/users/change-password").authenticated()
                        .requestMatchers("/api/v1/users/my-info").authenticated()
                        .requestMatchers("/api/v1/companies/my-company").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/companies").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/companies/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/companies/**").authenticated()
                        .requestMatchers("/api/v1/resumes/debug-employer-access/**").authenticated()
                        .requestMatchers("/api/v1/resumes/test-auth").authenticated()
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint()))
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(jwtAuthenticationEntryPoint()));

        return httpSecurity.build();
    }

    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public CustomJwtDecoder customJwtDecoder() {
        return new CustomJwtDecoder();
    }
}
