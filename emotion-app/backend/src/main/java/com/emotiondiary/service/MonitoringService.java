package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.entity.AppLog;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.AppLogRepository;
import com.emotiondiary.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MonitoringService {
  private final AppLogRepository appLogRepository;
  private final UserRepository userRepository;
  private final LogTypeService logTypeService;
  private final LogLevelService logLevelService;

  public MonitoringService(AppLogRepository appLogRepository, UserRepository userRepository, LogTypeService logTypeService, LogLevelService logLevelService) {
    this.appLogRepository = appLogRepository;
    this.userRepository = userRepository;
    this.logTypeService = logTypeService;
    this.logLevelService = logLevelService;
  }

  public AppLogResponse create(Long userId, AppLogRequest request) {
    AppUser user = userRepository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
    AppLog log = new AppLog();
    log.setUser(user);
    log.setEventType(logTypeService.getOrCreate(request.type()));
    log.setLogLevel(logLevelService.getOrCreate(request.level()));
    log.setName(request.name());
    log.setMessage(request.message());
    log.setDetails(request.details());
    return map(appLogRepository.save(log));
  }

  public List<AppLogResponse> latest(Long userId) {
    AppUser user = userRepository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
    return appLogRepository.findTop100ByUserOrderByCreatedAtDesc(user).stream().map(this::map).toList();
  }

  public void systemLog(Long userId, String type, String level, String name, String message, String details) {
    AppLogRequest req = new AppLogRequest(type, level, name, message, details);
    create(userId, req);
  }

  private AppLogResponse map(AppLog log) {
    return new AppLogResponse(
        log.getId(),
        log.getLogLevel().getName(),
        log.getEventType().getName(),
        log.getName(),
        log.getMessage(),
        log.getDetails(),
        log.getCreatedAt() == null ? null : log.getCreatedAt().toString());
  }
}
