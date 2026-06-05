/**
 * Контроллер предназначен для управления дневниковыми записями пользователя.
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
 * HTTP-запросы на получение, создание, изменение и удаление дневниковых записей.
 *
 * Выходные данные:
 * JSON-ответы с дневниковыми записями либо пустой ответ после удаления записи.
 *
 * Связанные модули:
 * JournalService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.JournalRequest;
import com.emotiondiary.dto.Dto.JournalResponse;
import com.emotiondiary.service.JournalService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController extends BaseController {

  private final JournalService journalService;

  @GetMapping
  public List<JournalResponse> all(Authentication authentication) {
    return journalService.all(uid(authentication));
  }

  @GetMapping("/{id}")
  public JournalResponse get(Authentication authentication, @PathVariable Long id) {
    return journalService.get(uid(authentication), id);
  }

  @PostMapping
  public JournalResponse create(
      Authentication authentication, @Valid @RequestBody JournalRequest request) {
    return journalService.create(uid(authentication), request);
  }

  @PutMapping("/{id}")
  public JournalResponse update(
      Authentication authentication,
      @PathVariable Long id,
      @Valid @RequestBody JournalRequest request) {
    return journalService.update(uid(authentication), id, request);
  }

  @DeleteMapping("/{id}")
  public void delete(Authentication authentication, @PathVariable Long id) {
    journalService.delete(uid(authentication), id);
  }
}
