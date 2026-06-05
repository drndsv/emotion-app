/**
 * Контроллер предназначен для логирования и мониторинга событий системы.
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
 * HTTP-запросы на сохранение событий приложения и просмотр журналов мониторинга.
 *
 * Выходные данные:
 * JSON-ответы с сохраненными и полученными журналами мониторинга.
 *
 * Связанные модули:
 * MonitoringService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.AppLogRequest;
import com.emotiondiary.dto.Dto.AppLogResponse;
import com.emotiondiary.service.MonitoringService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/monitoring/logs")
@RequiredArgsConstructor
public class MonitoringController extends BaseController {

  private final MonitoringService monitoringService;

  @PostMapping
  public AppLogResponse createLog(
      Authentication authentication, @Valid @RequestBody AppLogRequest request) {
    return monitoringService.create(uid(authentication), request);
  }

  @GetMapping
  public List<AppLogResponse> logs(Authentication authentication) {
    return monitoringService.latest(uid(authentication));
  }
}
