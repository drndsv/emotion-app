package com.emotiondiary.service;

import com.emotiondiary.entity.LogType;
import com.emotiondiary.repository.LogTypeRepository;
import org.springframework.stereotype.Service;

@Service
public class LogTypeService {
  private final LogTypeRepository repository;

  public LogTypeService(LogTypeRepository repository) {
    this.repository = repository;
  }

  public LogType getOrCreate(String name) {
    return repository.findByNameIgnoreCase(name).orElseGet(() -> {
      LogType type = new LogType();
      type.setName(name.toUpperCase());
      return repository.save(type);
    });
  }
}
