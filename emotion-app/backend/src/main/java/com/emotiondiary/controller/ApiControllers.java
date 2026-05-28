package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.*;
import com.emotiondiary.service.AuthService;
import com.emotiondiary.service.EmotionService;
import com.emotiondiary.service.JournalService;
import com.emotiondiary.service.MonitoringService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiControllers {
  private final AuthService auth;
  private final JournalService journal;
  private final EmotionService emotion;
  private final MonitoringService monitoring;

  public ApiControllers(AuthService auth, JournalService journal, EmotionService emotion, MonitoringService monitoring) {
    this.auth = auth;
    this.journal = journal;
    this.emotion = emotion;
    this.monitoring = monitoring;
  }

  private Long uid(Authentication a) { return Long.valueOf(a.getName()); }

  @PostMapping("/auth/register") AuthResponse register(@Valid @RequestBody RegisterRequest r){return auth.register(r);} 
  @PostMapping("/auth/login") AuthResponse login(@Valid @RequestBody LoginRequest r){return auth.login(r);} 
  @GetMapping("/users/me") UserResponse me(Authentication a){return auth.me(uid(a));} 
  @PutMapping("/users/me") UserResponse upd(Authentication a,@Valid @RequestBody UpdateProfileRequest r){return auth.updateMe(uid(a),r);} 
  @GetMapping("/journal") List<JournalResponse> all(Authentication a){return journal.all(uid(a));} 
  @GetMapping("/journal/{id}") JournalResponse get(Authentication a,@PathVariable Long id){return journal.get(uid(a),id);} 
  @PostMapping("/journal") JournalResponse create(Authentication a,@Valid @RequestBody JournalRequest r){return journal.create(uid(a),r);} 
  @PutMapping("/journal/{id}") JournalResponse update(Authentication a,@PathVariable Long id,@Valid @RequestBody JournalRequest r){return journal.update(uid(a),id,r);} 
  @DeleteMapping("/journal/{id}") void del(Authentication a,@PathVariable Long id){journal.del(uid(a),id);} 
  @PostMapping("/emotion/analyze") EmotionAnalysisResult analyze(@Valid @RequestBody AnalyzeRequest r){return emotion.analyze(r.text());}

  @PostMapping("/monitoring/logs")
  AppLogResponse createLog(Authentication a, @Valid @RequestBody AppLogRequest r) { return monitoring.create(uid(a), r); }

  @GetMapping("/monitoring/logs")
  List<AppLogResponse> logs(Authentication a) { return monitoring.latest(uid(a)); }

  @GetMapping("/analytics/emotions") Map<String,Long> emotions(Authentication a){return Map.of();} 
  @GetMapping("/analytics/summary") Map<String,Object> summary(Authentication a){return Map.of("message","Not implemented yet");}
}
