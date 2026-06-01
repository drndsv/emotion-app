package com.emotiondiary.config;

import com.emotiondiary.service.LogLevelService;
import com.emotiondiary.service.LogTypeService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogDictionaryConfig {
  @Bean
  CommandLineRunner seedLogDictionaries(LogLevelService logLevelService, LogTypeService logTypeService) {
    return args -> {
      logLevelService.getOrCreate("INFO");
      logLevelService.getOrCreate("WARN");
      logLevelService.getOrCreate("ERROR");
      logTypeService.getOrCreate("AUTH");
      logTypeService.getOrCreate("JOURNAL");
      logTypeService.getOrCreate("ANALYSIS");
      logTypeService.getOrCreate("SYSTEM");
      logTypeService.getOrCreate("MONITORING");
    };
  }
}
