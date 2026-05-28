package com.emotiondiary.repository;

import com.emotiondiary.entity.LogType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogTypeRepository extends JpaRepository<LogType, Long> {
  Optional<LogType> findByNameIgnoreCase(String name);
}
