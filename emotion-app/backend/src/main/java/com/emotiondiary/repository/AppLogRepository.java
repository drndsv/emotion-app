package com.emotiondiary.repository;

import com.emotiondiary.entity.AppLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AppLogRepository extends JpaRepository<AppLog, Long> {

  long countByType(String type);

  List<AppLog> findTop10ByTypeOrderByCreatedAtDesc(String type);

  @Query("""
      select l.name, count(l)
      from AppLog l
      where l.type = 'event'
      group by l.name
      order by count(l) desc
      limit 5
      """)
  List<Object[]> findPopularEvents();
}
