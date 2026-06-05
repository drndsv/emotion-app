/**
 * Класс предназначен для хранения типов журналируемых событий и классификации записей журнала системы.
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
 * Наименование типа события.
 *
 * Выходные данные:
 * Объект типа события, используемый в системе логирования.
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
@Table(name = "log_type")
@Getter
@Setter
@NoArgsConstructor
public class LogType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;
}
