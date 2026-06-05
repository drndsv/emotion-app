/**
 * Контроллер предназначен для получения аналитических данных по эмоциональным состояниям.
 *
 * Разработчик: Денисова Д.И.
 *
 * Дата разработки: 2026 г.
 *
 * Язык программирования: Java 21
 *
 * Средства разработки: Spring Boot, Spring MVC
 *
 * Входные данные:
 * HTTP-запросы на получение аналитики эмоций и сводки мониторинга.
 *
 * Выходные данные:
 * JSON-ответы с агрегированными данными по эмоциям и сводкой мониторинга.
 *
 * Связанные модули:
 * JournalService, MonitoringService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.JournalResponse;
import com.emotiondiary.dto.Dto.MonitoringSummary;
import com.emotiondiary.service.JournalService;
import com.emotiondiary.service.MonitoringService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController extends BaseController {

  private final JournalService journalService;
  private final MonitoringService monitoringService;

  @GetMapping("/emotions")
  public Map<String, Long> emotions(Authentication authentication) {
    return journalService.all(uid(authentication)).stream()
        .filter(entry -> entry.finalEmotion() != null)
        .collect(
            java.util.stream.Collectors.groupingBy(
                JournalResponse::finalEmotion, java.util.stream.Collectors.counting()));
  }

  @GetMapping("/summary")
  public MonitoringSummary summary() {
    return monitoringService.summary();
  }
}
