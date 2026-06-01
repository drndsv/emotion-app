package com.emotiondiary.repository;

import com.emotiondiary.entity.LogLevel;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogLevelRepository extends JpaRepository<LogLevel, Long> {

  Optional<LogLevel> findByName(String name);
  Optional<LogLevel> findByNameIgnoreCase(String name);
}
