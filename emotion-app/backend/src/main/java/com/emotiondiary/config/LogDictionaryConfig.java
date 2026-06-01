package com.emotiondiary.config;

import com.emotiondiary.service.EmotionService;
import com.emotiondiary.service.LogLevelService;
import com.emotiondiary.service.LogTypeService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogDictionaryConfig {

  @Bean
  CommandLineRunner seedDictionaries(
      LogLevelService logLevelService, LogTypeService logTypeService, EmotionService emotionService) {
    return args -> {
      seedLogLevels(logLevelService);
      seedLogTypes(logTypeService);
      seedEmotions(emotionService);
    };
  }

  private void seedLogLevels(LogLevelService logLevelService) {
    logLevelService.getOrCreate("INFO");
    logLevelService.getOrCreate("WARN");
    logLevelService.getOrCreate("ERROR");
  }

  private void seedLogTypes(LogTypeService logTypeService) {
    logTypeService.getOrCreate("AUTH");
    logTypeService.getOrCreate("JOURNAL");
    logTypeService.getOrCreate("ANALYSIS");
    logTypeService.getOrCreate("SYSTEM");
    logTypeService.getOrCreate("MONITORING");
    logTypeService.getOrCreate("EVENT");
    logTypeService.getOrCreate("ERROR");
  }

  private void seedEmotions(EmotionService emotionService) {
    EmotionService.DEFAULT_EMOTIONS.forEach(emotionService::getOrCreate);
  }
}
