package com.emotiondiary.repository;

import com.emotiondiary.entity.AppLog;
import com.emotiondiary.entity.AppUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppLogRepository extends JpaRepository<AppLog, Long> {
  List<AppLog> findTop100ByUserOrderByCreatedAtDesc(AppUser user);
}
