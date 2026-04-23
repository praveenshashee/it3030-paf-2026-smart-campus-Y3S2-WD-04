package com.smartcampus.hub.config;

import com.smartcampus.hub.service.CustomOidcUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomOidcUserService customOidcUserService;
    private final DevSessionAuthenticationFilter devSessionAuthenticationFilter;

    public SecurityConfig(
            CustomOidcUserService customOidcUserService,
            DevSessionAuthenticationFilter devSessionAuthenticationFilter) {
        this.customOidcUserService = customOidcUserService;
        this.devSessionAuthenticationFilter = devSessionAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/error", "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/cancel").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/bookings/**").authenticated()
                        .requestMatchers("/api/tickets/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(devSessionAuthenticationFilter, AnonymousAuthenticationFilter.class)
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(customOidcUserService))
                        .defaultSuccessUrl("http://localhost:5173", true))
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:5173"));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:5173"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true);
            return config;
        };
    }
}
