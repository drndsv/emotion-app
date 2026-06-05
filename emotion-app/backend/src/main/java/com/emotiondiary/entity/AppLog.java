/**
 * Назначение модуля:
 * Класс предназначен для хранения журналов событий приложения, пользовательских действий, информационных сообщений и ошибок системы.
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
 * Тип события, уровень логирования, сообщение и дополнительная информация.
 *
 * Выходные данные:
 * Запись журнала событий, сохраняемая в базе данных PostgreSQL.
 *
 * Связанные модули:
 * MonitoringService, AppUser, LogType, LogLevel.
 */
package com.emotiondiary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_log")
@Getter
@Setter
@NoArgsConstructor
public class AppLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private AppUser user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "type_id")
  private LogType eventType;

  @ManyToOne(optional = false)
  @JoinColumn(name = "level_id")
  private LogLevel logLevel;

  @Column(nullable = false)
  private String name;

  @Column(columnDefinition = "text")
  private String message;

  @Column(columnDefinition = "text")
  private String details;

  @Column(nullable = false)
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    createdAt = Instant.now();
  }
}
