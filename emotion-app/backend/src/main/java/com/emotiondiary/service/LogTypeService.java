package com.emotiondiary.service;

import com.emotiondiary.entity.LogType;
import com.emotiondiary.repository.LogTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogTypeService {

  private final LogTypeRepository repository;

  public LogType getOrCreate(String name) {
    String normalizedName = normalizeName(name);
    return repository
        .findByNameIgnoreCase(normalizedName)
        .orElseGet(() -> createLogType(normalizedName));
  }

  private String normalizeName(String name) {
    return name == null || name.isBlank() ? "SYSTEM" : name.trim().toUpperCase();
  }

  private LogType createLogType(String name) {
    LogType type = new LogType();
    type.setName(name);
    return repository.save(type);
  }
}
