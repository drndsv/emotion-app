/**
 * Обеспечение аутентификации и авторизации пользователей, настройка политики безопасности приложения и обработка JWT-токенов.
 *
 * Разработчик: Денисова Д.И.
 *
 * Дата разработки: 2026 г.
 *
 * Язык программирования: Java 21
 *
 * Средства разработки: Spring Security, JWT
 *
 * Входные данные:
 * HTTP-запросы пользователей и JWT-токены.
 *
 * Выходные данные:
 * Настроенный контекст безопасности приложения.
 *
 * Связанные модули:
 * AuthService, JwtService, AuthController, UserController, JournalController, EmotionController, MonitoringController, AnalyticsController.
 */
package com.emotiondiary.security;

import com.emotiondiary.entity.Role;
import com.emotiondiary.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtService jwtService;
  private final UserRepository userRepository;

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
          CorsConfiguration config = new CorsConfiguration();
          config.setAllowedOrigins(List.of(origin));
          config.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
          ));
          config.setAllowedHeaders(List.of("*"));
          config.setAllowCredentials(true);

          return config;
        })
      )
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(
        jwtAuthenticationFilter(),
        UsernamePasswordAuthenticationFilter.class
      )
      .build();
  }

  private OncePerRequestFilter jwtAuthenticationFilter() {
    return new OncePerRequestFilter() {
      @Override
      protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
      ) throws ServletException, IOException {
        SecurityContextHolder.clearContext();

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")) {
          authenticate(header.substring(7));
        }

        filterChain.doFilter(request, response);
      }
    };
  }

  private void authenticate(String token) {
    try {
      var claims = jwtService.parse(token);
      Long userId = Long.valueOf(claims.getSubject());

      userRepository
        .findById(userId)
        .ifPresent(user -> {
          Role role = user.getRole() == null ? Role.USER : user.getRole();

          var authentication =
            new UsernamePasswordAuthenticationToken(
              claims.getSubject(),
              null,
              List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
            );

          SecurityContextHolder.getContext().setAuthentication(authentication);
        });
    } catch (Exception ignored) {
      SecurityContextHolder.clearContext();
    }
  }
}
