/**
 * Класс предназначен для хранения уровней логирования и определения степени важности событий системы.
 *
 * Разработчик: Денисова Д.И.
 *
 * Дата разработки: 2026 г.
 *
 * Язык программирования: Java 21
 *
 * Средства разработки: Spring Boot, JPA (Hibernate), Lombok
 *
 * Входные данные:
 * Наименование уровня логирования.
 *
 * Выходные данные:
 * Объект уровня логирования, используемый при регистрации событий системы.
 *
 * Связанные модули:
 * AppLog, MonitoringService.
 */
package com.emotiondiary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "log_level")
@Getter
@Setter
@NoArgsConstructor
public class LogLevel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;
}
