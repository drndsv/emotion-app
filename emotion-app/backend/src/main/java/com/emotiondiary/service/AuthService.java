package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.*;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.UserRepository;
import com.emotiondiary.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;
  private final MonitoringService monitoringService;

  public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt, MonitoringService monitoringService) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
    this.monitoringService = monitoringService;
  }

  public AuthResponse register(RegisterRequest r){ if(users.findByEmail(r.email()).isPresent()) throw new ApiException("Email already exists"); var u=new AppUser(); u.setEmail(r.email()); u.setPasswordHash(encoder.encode(r.password())); u.setDisplayName(r.displayName()); u=users.save(u); monitoringService.systemLog(u.getId(),"AUTH","INFO","REGISTER","User registered",u.getEmail()); return authResp(u); }
  public AuthResponse login(LoginRequest r){ var u=users.findByEmail(r.email()).orElseThrow(()->new ApiException("Invalid credentials")); if(!encoder.matches(r.password(),u.getPasswordHash())) throw new ApiException("Invalid credentials"); monitoringService.systemLog(u.getId(),"AUTH","INFO","LOGIN","User logged in",u.getEmail()); return authResp(u);} 
  public UserResponse me(Long id){var u=users.findById(id).orElseThrow(()->new ApiException("User not found")); return new UserResponse(u.getId(),String.valueOf(u.getId()),u.getEmail(),u.getDisplayName());}
  public UserResponse updateMe(Long id,UpdateProfileRequest req){var u=users.findById(id).orElseThrow(()->new ApiException("User not found")); u.setDisplayName(req.displayName()); users.save(u); monitoringService.systemLog(id,"AUTH","INFO","PROFILE_UPDATED","User updated profile",null); return me(id);} private AuthResponse authResp(AppUser u){return new AuthResponse(jwt.generate(u.getId(),u.getEmail()),new UserResponse(u.getId(),String.valueOf(u.getId()),u.getEmail(),u.getDisplayName()));}
}
