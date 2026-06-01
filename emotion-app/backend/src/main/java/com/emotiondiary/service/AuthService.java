package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AuthResponse;
import com.emotiondiary.dto.Dto.LoginRequest;
import com.emotiondiary.dto.Dto.RegisterRequest;
import com.emotiondiary.dto.Dto.UpdateEmailRequest;
import com.emotiondiary.dto.Dto.UpdatePasswordRequest;
import com.emotiondiary.dto.Dto.UpdateProfileRequest;
import com.emotiondiary.dto.Dto.UserResponse;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.entity.Role;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.UserRepository;
import com.emotiondiary.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final MonitoringService monitoringService;

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new ApiException("Email already exists");
    }

    AppUser user = new AppUser();
    user.setEmail(request.email());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setDisplayName(request.displayName());
    user.setRole(Role.USER);

    AppUser savedUser = userRepository.save(user);
    monitoringService.systemLog(
        savedUser.getId(), "AUTH", "INFO", "REGISTER", "User registered", savedUser.getEmail());
    return authResponse(savedUser);
  }

  public AuthResponse login(LoginRequest request) {
    AppUser user =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(() -> new ApiException("Invalid credentials"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ApiException("Invalid credentials");
    }

    monitoringService.systemLog(
        user.getId(), "AUTH", "INFO", "LOGIN", "User logged in", user.getEmail());
    return authResponse(user);
  }

  public UserResponse me(Long id) {
    return mapUser(findUser(id));
  }

  public UserResponse updateMe(Long id, UpdateProfileRequest request) {
    AppUser user = findUser(id);
    user.setDisplayName(request.displayName());
    AppUser savedUser = userRepository.save(user);
    monitoringService.systemLog(
        id, "AUTH", "INFO", "PROFILE_UPDATED", "User updated profile", null);
    return mapUser(savedUser);
  }

  public AuthResponse updateEmail(Long id, UpdateEmailRequest request) {
    AppUser user = findUser(id);
    validateCurrentPassword(request.currentPassword(), user);

    userRepository
        .findByEmail(request.newEmail())
        .filter(existingUser -> !existingUser.getId().equals(id))
        .ifPresent(
            existingUser -> {
              throw new ApiException("Email already exists");
            });

    user.setEmail(request.newEmail());
    AppUser savedUser = userRepository.save(user);
    monitoringService.systemLog(
        id, "AUTH", "INFO", "EMAIL_UPDATED", "User updated email", savedUser.getEmail());
    return authResponse(savedUser);
  }

  public void updatePassword(Long id, UpdatePasswordRequest request) {
    AppUser user = findUser(id);
    validateCurrentPassword(request.currentPassword(), user);

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
    monitoringService.systemLog(
        id, "AUTH", "INFO", "PASSWORD_UPDATED", "User updated password", null);
  }

  private void validateCurrentPassword(String currentPassword, AppUser user) {
    if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
      throw new ApiException("Invalid credentials");
    }
  }

  private AppUser findUser(Long id) {
    return userRepository.findById(id).orElseThrow(() -> new ApiException("User not found"));
  }

  private AuthResponse authResponse(AppUser user) {
    return new AuthResponse(
        jwtService.generate(user.getId(), user.getEmail(), resolveRole(user)), mapUser(user));
  }

  private Role resolveRole(AppUser user) {
    return user.getRole() == null ? Role.USER : user.getRole();
  }

  private UserResponse mapUser(AppUser user) {
    return new UserResponse(
        user.getId(),
        String.valueOf(user.getId()),
        user.getEmail(),
        user.getDisplayName(),
        resolveRole(user).name().toLowerCase());
  }
}
