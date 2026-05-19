package com.emotiondiary.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class SecurityConfig {

  private final JwtService jwtService;

  public SecurityConfig(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(
    HttpSecurity http,
    @Value("${app.cors-origin}") String origin
  ) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .cors(cors ->
        cors.configurationSource(request -> {
          var config = new CorsConfiguration();

          config.setAllowedOrigins(List.of(origin));
          config.setAllowedMethods(List.of("*"));
          config.setAllowedHeaders(List.of("*"));

          return config;
        })
      )
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth ->
        auth
          .requestMatchers("/api/auth/**").permitAll()
          .requestMatchers("/api/monitoring/**").hasRole("ADMIN")
          .anyRequest().authenticated()
      )
      .addFilterBefore(
        new OncePerRequestFilter() {
          @Override
          protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
          ) throws ServletException, IOException {
            var header = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (header != null && header.startsWith("Bearer ")) {
              try {
                Claims claims = jwtService.parse(header.substring(7));
                String role = claims.get("role", String.class);

                if (role == null || role.isBlank()) {
                  role = "USER";
                }

                var authentication =
                  new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    AuthorityUtils.createAuthorityList("ROLE_" + role)
                  );

                SecurityContextHolder.getContext().setAuthentication(authentication);
              } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
              }
            }

            filterChain.doFilter(request, response);
          }
        },
        UsernamePasswordAuthenticationFilter.class
      )
      .build();
  }
}
