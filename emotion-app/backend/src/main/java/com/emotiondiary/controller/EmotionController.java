/**
 * Контроллер предназначен для анализа эмоционального состояния пользователя по текстовой записи.
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
 * HTTP-запросы с текстом дневниковой записи для анализа эмоции.
 *
 * Выходные данные:
 * JSON-ответы с результатом анализа эмоционального состояния.
 *
 * Связанные модули:
 * EmotionAnalysisService.
 */
package com.emotiondiary.controller;

import com.emotiondiary.dto.Dto.AnalyzeRequest;
import com.emotiondiary.dto.Dto.EmotionAnalysisResult;
import com.emotiondiary.service.EmotionAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
public class EmotionController {

  private final EmotionAnalysisService emotionAnalysisService;

  @PostMapping("/analyze")
  public EmotionAnalysisResult analyze(@Valid @RequestBody AnalyzeRequest request) {
    return emotionAnalysisService.analyze(request.text());
  }
}
