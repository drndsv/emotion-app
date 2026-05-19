package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AuthResponse;
import com.emotiondiary.dto.Dto.LoginRequest;
import com.emotiondiary.dto.Dto.RegisterRequest;
import com.emotiondiary.dto.Dto.UpdateProfileRequest;
import com.emotiondiary.dto.Dto.UserResponse;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.UserRepository;
import com.emotiondiary.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository users;

  private final PasswordEncoder encoder;

  private final JwtService jwt;

  public AuthResponse register(RegisterRequest request) {
    if (users.findByEmail(request.email()).isPresent()) {
      throw new ApiException("Email already exists");
    }

    var user = new AppUser();

    user.setEmail(request.email());
    user.setPasswordHash(
      encoder.encode(request.password())
    );
    user.setDisplayName(request.displayName());

    user = users.save(user);

    return authResponse(user);
  }

  public AuthResponse login(LoginRequest request) {
    var user = users.findByEmail(request.email())
      .orElseThrow(() ->
        new ApiException("Invalid credentials")
      );

    if (!encoder.matches(
      request.password(),
      user.getPasswordHash()
    )) {
      throw new ApiException("Invalid credentials");
    }

    return authResponse(user);
  }

  public UserResponse me(Long id) {
    var user = users.findById(id)
      .orElseThrow(() ->
        new ApiException("User not found")
      );

    return new UserResponse(
      user.getId(),
      String.valueOf(user.getId()),
      user.getEmail(),
      user.getDisplayName(),
      user.getRole().name().toLowerCase()
    );
  }

  public UserResponse updateMe(
    Long id,
    UpdateProfileRequest request
  ) {
    var user = users.findById(id)
      .orElseThrow(() ->
        new ApiException("User not found")
      );

    user.setDisplayName(request.displayName());

    users.save(user);

    return me(id);
  }

  private AuthResponse authResponse(AppUser user) {
    return new AuthResponse(
      jwt.generate(
        user.getId(),
        user.getEmail(),
        user.getRole()
      ),
      new UserResponse(
        user.getId(),
        String.valueOf(user.getId()),
        user.getEmail(),
        user.getDisplayName(),
        user.getRole().name().toLowerCase()
      )
    );
  }
}
