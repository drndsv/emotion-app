package com.emotiondiary.service;

import com.emotiondiary.entity.LogLevel;
import com.emotiondiary.repository.LogLevelRepository;
import org.springframework.stereotype.Service;

@Service
public class LogLevelService {
  private final LogLevelRepository repository;

  public LogLevelService(LogLevelRepository repository) {
    this.repository = repository;
  }

  public LogLevel getOrCreate(String name) {
    return repository.findByNameIgnoreCase(name).orElseGet(() -> {
      LogLevel level = new LogLevel();
      level.setName(name.toUpperCase());
      return repository.save(level);
    });
  }
}
