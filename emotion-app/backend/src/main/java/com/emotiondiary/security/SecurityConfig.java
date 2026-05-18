package com.emotiondiary.security;

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
  SecurityFilterChain filterChain(HttpSecurity http, @Value("${app.cors-origin}") String origin)
      throws Exception {
    return http
        .csrf(c -> c.disable())
        .cors(
            c ->
                c.configurationSource(
                    request -> {
                      var cfg = new CorsConfiguration();
                      cfg.setAllowedOrigins(List.of(origin));
                      cfg.setAllowedMethods(List.of("*"));
                      cfg.setAllowedHeaders(List.of("*"));
                      return cfg;
                    }))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            auth -> auth.requestMatchers("/api/auth/**").permitAll().anyRequest().authenticated())
        .addFilterBefore(
            new OncePerRequestFilter() {
              @Override
              protected void doFilterInternal(
                  HttpServletRequest request,
                  HttpServletResponse response,
                  FilterChain filterChain)
                  throws ServletException, IOException {
                var header = request.getHeader(HttpHeaders.AUTHORIZATION);
                if (header != null && header.startsWith("Bearer ")) {
                  try {
                    var claims = jwtService.parse(header.substring(7));
                    var auth =
                        new UsernamePasswordAuthenticationToken(
                            claims.getSubject(), null, AuthorityUtils.NO_AUTHORITIES);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                  } catch (Exception ignored) {
                    // unauthenticated request will be handled by Spring Security
                  }
                }
                filterChain.doFilter(request, response);
              }
            },
            UsernamePasswordAuthenticationFilter.class)
        .build();
  }
}
