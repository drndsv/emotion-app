package com.emotiondiary.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

public class Dto {

  public record RegisterRequest(
    @Email String email,
    @Size(min = 6) String password,
    @NotBlank String displayName
  ) {}

  public record LoginRequest(
    @Email String email,
    @NotBlank String password
  ) {}

  public record AuthResponse(
    String token,
    UserResponse user
  ) {}

  public record UserResponse(
    Long id,
    String uid,
    String email,
    String displayName,
    String role
  ) {}

  public record UpdateProfileRequest(
    @NotBlank String displayName
  ) {}

  public record ChangeEmailRequest(
    @NotBlank String currentPassword,
    @Email String newEmail
  ) {}

  public record ChangePasswordRequest(
    @NotBlank String currentPassword,
    @Size(min = 6) String newPassword
  ) {}

  public record AnalyzeRequest(
    @NotBlank String text
  ) {}

  public record EmotionAnalysisResult(
    String detectedEmotion,
    String analysis,
    String recommendation
  ) {}

  public record JournalRequest(
    @NotBlank String text,
    String selectedEmotion,
    String detectedEmotion,
    String finalEmotion,
    String analysis,
    String recommendation
  ) {}

  public record JournalResponse(
    Long id,
    Long userId,
    String text,
    String selectedEmotion,
    String detectedEmotion,
    String finalEmotion,
    String analysis,
    String recommendation,
    String createdAt,
    String updatedAt
  ) {}

  public record LogRequest(
    String type,
    String level,
    String name,
    String message,
    Map<String, Object> details
  ) {}

  public record LogResponse(
    Long id,
    Long userId,
    String type,
    String level,
    String name,
    String message,
    Map<String, Object> details,
    String createdAt
  ) {}

  public record MonitoringEventStat(
    String name,
    Long count
  ) {}

  public record MonitoringSummary(
    Long totalLogs,
    Long totalEvents,
    Long totalErrors,
    List<MonitoringEventStat> popularEvents,
    List<LogResponse> recentErrors
  ) {}
}
