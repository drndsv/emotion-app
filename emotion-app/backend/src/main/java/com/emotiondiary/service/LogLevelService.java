package com.emotiondiary.service;

import com.emotiondiary.entity.LogLevel;
import com.emotiondiary.repository.LogLevelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogLevelService {

  private final LogLevelRepository repository;

  public LogLevel getOrCreate(String name) {
    String normalizedName = normalizeName(name);
    return repository
        .findByNameIgnoreCase(normalizedName)
        .orElseGet(() -> createLogLevel(normalizedName));
  }

  private String normalizeName(String name) {
    return name == null || name.isBlank() ? "INFO" : name.trim().toUpperCase();
  }

  private LogLevel createLogLevel(String name) {
    LogLevel level = new LogLevel();
    level.setName(name);
    return repository.save(level);
  }
}
