package com.emotiondiary.dto;
import jakarta.validation.constraints.*;
public class Dto {
  public record RegisterRequest(@Email String email,@Size(min=6) String password,@NotBlank String displayName){}
  public record LoginRequest(@Email String email,@NotBlank String password){}
  public record AuthResponse(String token,UserResponse user){}
  public record UserResponse(Long id,String uid,String email,String displayName){}
  public record UpdateProfileRequest(@NotBlank String displayName){}
  public record AnalyzeRequest(@NotBlank String text){}
  public record EmotionAnalysisResult(String detectedEmotion,String analysis,String recommendation){}
  public record JournalRequest(@NotBlank String text,String selectedEmotion,String detectedEmotion,String finalEmotion,String analysis,String recommendation){}
  public record JournalResponse(Long id,Long userId,String text,String selectedEmotion,String detectedEmotion,String finalEmotion,String analysis,String recommendation,String createdAt,String updatedAt){}

  public record AppLogRequest(@NotBlank String type,@NotBlank String level,@NotBlank String name,String message,String details){}
  public record AppLogResponse(Long id,String level,String type,String name,String message,String details,String createdAt){}
}
