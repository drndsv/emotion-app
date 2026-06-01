package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.dto.Dto.MonitoringEventStat;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import com.emotiondiary.entity.AppLog;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.AppLogRepository;
import com.emotiondiary.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonitoringService {

  private static final String EVENT_TYPE = "EVENT";
  private static final String ERROR_LEVEL = "ERROR";

  private final AppLogRepository appLogRepository;
  private final UserRepository userRepository;
  private final LogTypeService logTypeService;
  private final LogLevelService logLevelService;

  public AppLogResponse create(Long userId, AppLogRequest request) {
    AppUser user = findUser(userId);

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
    return appLogRepository.findTop100ByUserOrderByCreatedAtDesc(findUser(userId)).stream()
        .map(this::map)
        .toList();
  }

  public MonitoringSummary summary() {
    List<MonitoringEventStat> popularEvents =
        appLogRepository.findPopularEvents(EVENT_TYPE).stream()
            .map(row -> new MonitoringEventStat(String.valueOf(row[0]), (Long) row[1]))
            .toList();

    List<AppLogResponse> recentErrors =
        appLogRepository.findTop10ByLogLevelNameIgnoreCaseOrderByCreatedAtDesc(ERROR_LEVEL).stream()
            .map(this::map)
            .toList();

    return new MonitoringSummary(
        appLogRepository.count(),
        appLogRepository.countByEventTypeNameIgnoreCase(EVENT_TYPE),
        appLogRepository.countByLogLevelNameIgnoreCase(ERROR_LEVEL),
        popularEvents,
        recentErrors);
  }

  public void systemLog(
      Long userId, String type, String level, String name, String message, String details) {
    create(userId, new AppLogRequest(type, level, name, message, details));
  }

  private AppUser findUser(Long userId) {
    return userRepository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
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
