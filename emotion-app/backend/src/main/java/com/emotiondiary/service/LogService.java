package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {

  private final MonitoringService monitoringService;

  public AppLogResponse create(Long userId, AppLogRequest request) {
    return monitoringService.create(userId, request);
  }

  public MonitoringSummary summary() {
    return monitoringService.summary();
  }
}
