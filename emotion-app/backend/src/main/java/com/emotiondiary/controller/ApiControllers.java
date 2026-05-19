package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto;
import com.emotiondiary.dto.Dto.AnalyzeRequest;
import com.emotiondiary.dto.Dto.AuthResponse;
import com.emotiondiary.dto.Dto.EmotionAnalysisResult;
import com.emotiondiary.dto.Dto.JournalRequest;
import com.emotiondiary.dto.Dto.JournalResponse;
import com.emotiondiary.dto.Dto.LoginRequest;
import com.emotiondiary.dto.Dto.RegisterRequest;
import com.emotiondiary.dto.Dto.UpdateProfileRequest;
import com.emotiondiary.dto.Dto.UserResponse;
import com.emotiondiary.service.AuthService;
import com.emotiondiary.service.EmotionService;
import com.emotiondiary.service.JournalService;
import com.emotiondiary.service.LogService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiControllers {

  private final AuthService auth;

  private final JournalService journal;

  private final EmotionService emotion;

  private final LogService logs;

  private Long uid(Authentication authentication) {
    return Long.valueOf(authentication.getName());
  }

  @PostMapping("/auth/register")
  AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return auth.register(request);
  }

  @PostMapping("/auth/login")
  AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return auth.login(request);
  }

  @GetMapping("/users/me")
  UserResponse me(Authentication authentication) {
    return auth.me(uid(authentication));
  }

  @PutMapping("/users/me")
  UserResponse updateProfile(
    Authentication authentication,
    @Valid @RequestBody UpdateProfileRequest request
  ) {
    return auth.updateMe(uid(authentication), request);
  }

  @GetMapping("/journal")
  List<JournalResponse> all(Authentication authentication) {
    return journal.all(uid(authentication));
  }

  @GetMapping("/journal/{id}")
  JournalResponse get(
    Authentication authentication,
    @PathVariable Long id
  ) {
    return journal.get(uid(authentication), id);
  }

  @PostMapping("/journal")
  JournalResponse create(
    Authentication authentication,
    @Valid @RequestBody JournalRequest request
  ) {
    return journal.create(uid(authentication), request);
  }

  @PutMapping("/journal/{id}")
  JournalResponse update(
    Authentication authentication,
    @PathVariable Long id,
    @Valid @RequestBody JournalRequest request
  ) {
    return journal.update(uid(authentication), id, request);
  }

  @DeleteMapping("/journal/{id}")
  void delete(
    Authentication authentication,
    @PathVariable Long id
  ) {
    journal.delete(uid(authentication), id);
  }

  @PostMapping("/emotion/analyze")
  EmotionAnalysisResult analyze(
    @Valid @RequestBody AnalyzeRequest request
  ) {
    return emotion.analyze(request.text());
  }

  @GetMapping("/analytics/emotions")
  Map<String, Long> emotions(Authentication authentication) {
    return Map.of();
  }

  @GetMapping("/analytics/summary")
  Map<String, Object> summary(Authentication authentication) {
    return Map.of(
      "message",
      "Not implemented yet"
    );
  }

  @PostMapping("/logs")
  Dto.LogResponse createLog(
    Authentication authentication,
    @RequestBody Dto.LogRequest request
  ) {
    return logs.create(uid(authentication), request);
  }

  @GetMapping("/monitoring/summary")
  Dto.MonitoringSummary monitoringSummary() {
    return logs.summary();
  }
}
