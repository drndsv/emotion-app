package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.LogRequest;
import com.emotiondiary.dto.Dto.LogResponse;
import com.emotiondiary.dto.Dto.MonitoringEventStat;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import com.emotiondiary.entity.AppLog;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.AppLogRepository;
import com.emotiondiary.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {

  private final AppLogRepository logs;
  private final UserRepository users;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public LogResponse create(Long userId, LogRequest request) {
    var log = new AppLog();

    AppUser user = users.findById(userId)
      .orElseThrow(() -> new ApiException("User not found"));

    log.setUser(user);
    log.setType(request.type());
    log.setLevel(request.level());
    log.setName(request.name());
    log.setMessage(request.message());
    log.setDetails(toJson(request.details()));

    return map(logs.save(log));
  }

  public MonitoringSummary summary() {
    var totalLogs = logs.count();
    var totalEvents = logs.countByType("event");
    var totalErrors = logs.countByType("error");

    var popularEvents = logs.findPopularEvents()
      .stream()
      .map(row -> new MonitoringEventStat(
        String.valueOf(row[0]),
        (Long) row[1]
      ))
      .toList();

    var recentErrors = logs.findTop10ByTypeOrderByCreatedAtDesc("error")
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

  private LogResponse map(AppLog log) {
    return new LogResponse(
      log.getId(),
      log.getUser() == null ? null : log.getUser().getId(),
      log.getType(),
      log.getLevel(),
      log.getName(),
      log.getMessage(),
      fromJson(log.getDetails()),
      String.valueOf(log.getCreatedAt())
    );
  }

  private String toJson(Map<String, Object> details) {
    if (details == null) {
      return null;
    }

    try {
      return objectMapper.writeValueAsString(details);
    } catch (Exception exception) {
      return "{}";
    }
  }

  private Map<String, Object> fromJson(String details) {
    if (details == null || details.isBlank()) {
      return Map.of();
    }

    try {
      return objectMapper.readValue(
        details,
        new TypeReference<Map<String, Object>>() {}
      );
    } catch (Exception exception) {
      return Map.of();
    }
  }
}
