/**
 * Обработка HTTP-запросов клиентского приложения, предоставление REST API для регистрации пользователей, работы с дневниковыми записями, анализа эмоционального состояния и мониторинга.
 *
 * Разработчик: Денисова Д.И.
 *
 * Дата разработки: 2026 г.
 *
 * Язык программирования: Java 21
 *
 * Средства разработки: Spring Boot, Spring MVC
 *
 * Входные данные:
 * HTTP-запросы от клиентской части приложения.
 *
 * Выходные данные:
 * JSON-ответы с результатами выполнения операций.
 *
 * Связанные модули:
 * AuthService, JournalService, EmotionService, MonitoringService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.AnalyzeRequest;
import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.dto.Dto.AuthResponse;
import com.emotiondiary.dto.Dto.EmotionAnalysisResult;
import com.emotiondiary.dto.Dto.JournalRequest;
import com.emotiondiary.dto.Dto.JournalResponse;
import com.emotiondiary.dto.Dto.LoginRequest;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import com.emotiondiary.dto.Dto.RegisterRequest;
import com.emotiondiary.dto.Dto.UpdateEmailRequest;
import com.emotiondiary.dto.Dto.UpdatePasswordRequest;
import com.emotiondiary.dto.Dto.UpdateProfileRequest;
import com.emotiondiary.dto.Dto.UserResponse;
import com.emotiondiary.service.AuthService;
import com.emotiondiary.service.EmotionAnalysisService;
import com.emotiondiary.service.JournalService;
import com.emotiondiary.service.MonitoringService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiControllers {

  private final AuthService authService;
  private final JournalService journalService;
  private final EmotionAnalysisService emotionAnalysisService;
  private final MonitoringService monitoringService;

  @PostMapping("/auth/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/auth/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @GetMapping("/users/me")
  public UserResponse me(Authentication authentication) {
    return authService.me(uid(authentication));
  }

  @PutMapping("/users/me")
  public UserResponse updateMe(
      Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
    return authService.updateMe(uid(authentication), request);
  }

  @PutMapping("/users/me/email")
  public AuthResponse updateEmail(
      Authentication authentication, @Valid @RequestBody UpdateEmailRequest request) {
    return authService.updateEmail(uid(authentication), request);
  }

  @PutMapping("/users/me/password")
  public void updatePassword(
      Authentication authentication, @Valid @RequestBody UpdatePasswordRequest request) {
    authService.updatePassword(uid(authentication), request);
  }

  @GetMapping("/journal")
  public List<JournalResponse> all(Authentication authentication) {
    return journalService.all(uid(authentication));
  }

  @GetMapping("/journal/{id}")
  public JournalResponse get(Authentication authentication, @PathVariable Long id) {
    return journalService.get(uid(authentication), id);
  }

  @PostMapping("/journal")
  public JournalResponse create(
      Authentication authentication, @Valid @RequestBody JournalRequest request) {
    return journalService.create(uid(authentication), request);
  }

  @PutMapping("/journal/{id}")
  public JournalResponse update(
      Authentication authentication,
      @PathVariable Long id,
      @Valid @RequestBody JournalRequest request) {
    return journalService.update(uid(authentication), id, request);
  }

  @DeleteMapping("/journal/{id}")
  public void delete(Authentication authentication, @PathVariable Long id) {
    journalService.delete(uid(authentication), id);
  }

  @PostMapping("/emotion/analyze")
  public EmotionAnalysisResult analyze(@Valid @RequestBody AnalyzeRequest request) {
    return emotionAnalysisService.analyze(request.text());
  }

  @PostMapping("/monitoring/logs")
  public AppLogResponse createLog(
      Authentication authentication, @Valid @RequestBody AppLogRequest request) {
    return monitoringService.create(uid(authentication), request);
  }

  @GetMapping("/monitoring/logs")
  public List<AppLogResponse> logs(Authentication authentication) {
    return monitoringService.latest(uid(authentication));
  }

  @GetMapping("/analytics/emotions")
  public Map<String, Long> emotions(Authentication authentication) {
    return journalService.all(uid(authentication)).stream()
        .filter(entry -> entry.finalEmotion() != null)
        .collect(
            java.util.stream.Collectors.groupingBy(
                JournalResponse::finalEmotion, java.util.stream.Collectors.counting()));
  }

  @GetMapping("/analytics/summary")
  public MonitoringSummary summary() {
    return monitoringService.summary();
  }

  private Long uid(Authentication authentication) {
    return Long.valueOf(authentication.getName());
  }
}
