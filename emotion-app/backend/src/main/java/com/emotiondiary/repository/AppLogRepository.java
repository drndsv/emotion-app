package com.emotiondiary.repository;

import com.emotiondiary.entity.AppLog;
import com.emotiondiary.entity.AppUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppLogRepository extends JpaRepository<AppLog, Long> {

  long countByEventTypeNameIgnoreCase(String name);

  long countByLogLevelNameIgnoreCase(String name);

  List<AppLog> findTop10ByLogLevelNameIgnoreCaseOrderByCreatedAtDesc(String name);

  List<AppLog> findTop100ByUserOrderByCreatedAtDesc(AppUser user);

  @Query(
      """
      select log.name, count(log)
      from AppLog log
      where lower(log.eventType.name) = lower(:eventTypeName)
      group by log.name
      order by count(log) desc
      """)
  List<Object[]> findPopularEvents(@Param("eventTypeName") String eventTypeName);
}
