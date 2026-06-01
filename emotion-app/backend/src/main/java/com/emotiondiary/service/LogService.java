package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.dto.Dto.MonitoringEventStat;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import com.emotiondiary.entity.AppLog;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.AppLogRepository;
import com.emotiondiary.repository.LogLevelRepository;
import com.emotiondiary.repository.LogTypeRepository;
import com.emotiondiary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {

  private final AppLogRepository logs;
  private final UserRepository users;
  private final LogTypeRepository logTypes;
  private final LogLevelRepository logLevels;

  public AppLogResponse create(Long userId, AppLogRequest request) {
    var user = users.findById(userId)
      .orElseThrow(() -> new ApiException("User not found"));

    var type = logTypes.findByName(request.type())
      .orElseThrow(() -> new ApiException("Log type not found"));

    var level = logLevels.findByName(request.level())
      .orElseThrow(() -> new ApiException("Log level not found"));

    var log = new AppLog();

    log.setUser(user);
    log.setEventType(type);
    log.setLogLevel(level);
    log.setName(request.name());
    log.setMessage(request.message());
    log.setDetails(request.details());

    return map(logs.save(log));
  }

  public MonitoringSummary summary() {
    var totalLogs = logs.count();
    var totalEvents = logs.countByEventTypeName("event");
    var totalErrors = logs.countByEventTypeName("error");

    var popularEvents = logs.findPopularEvents()
      .stream()
      .map(row -> new MonitoringEventStat(
        String.valueOf(row[0]),
        (Long) row[1]
      ))
      .toList();

    var recentErrors = logs.findTop10ByEventTypeNameOrderByCreatedAtDesc("error")
      .stream()
      .map(this::map)
      .toList();

    return new MonitoringSummary(
      totalLogs,
      totalEvents,
      totalErrors,
      popularEvents,
      recentErrors
    );
  }

  private AppLogResponse map(AppLog log) {
    return new AppLogResponse(
      log.getId(),
      log.getLogLevel().getName(),
      log.getEventType().getName(),
      log.getName(),
      log.getMessage(),
      log.getDetails(),
      String.valueOf(log.getCreatedAt())
    );
  }
}
