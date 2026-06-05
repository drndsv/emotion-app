/**
 * Контроллер предназначен для получения и изменения данных текущего пользователя.
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
 * HTTP-запросы на получение и обновление профиля, email и пароля пользователя.
 *
 * Выходные данные:
 * JSON-ответы с актуальными данными пользователя и JWT-токеном либо пустой ответ после смены пароля.
 *
 * Связанные модули:
 * AuthService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.AuthResponse;
import com.emotiondiary.dto.Dto.UpdateEmailRequest;
import com.emotiondiary.dto.Dto.UpdatePasswordRequest;
import com.emotiondiary.dto.Dto.UpdateProfileRequest;
import com.emotiondiary.dto.Dto.UserResponse;
import com.emotiondiary.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

  private final AuthService authService;

  @GetMapping("/me")
  public UserResponse me(Authentication authentication) {
    return authService.me(uid(authentication));
  }

  @PutMapping("/me")
  public UserResponse updateMe(
      Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
    return authService.updateMe(uid(authentication), request);
  }

  @PutMapping("/me/email")
  public AuthResponse updateEmail(
      Authentication authentication, @Valid @RequestBody UpdateEmailRequest request) {
    return authService.updateEmail(uid(authentication), request);
  }

  @PutMapping("/me/password")
  public void updatePassword(
      Authentication authentication, @Valid @RequestBody UpdatePasswordRequest request) {
    authService.updatePassword(uid(authentication), request);
  }
}
