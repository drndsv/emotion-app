/**
 * Класс предназначен для хранения справочной информации об эмоциональных состояниях, используемых в программном приложении. Обеспечивает единое представление эмоций, применяемых при анализе дневниковых записей пользователя и формировании статистики эмоционального состояния.
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
 * Наименование эмоционального состояния.
 *
 * Выходные данные:
 * Объект эмоционального состояния, сохраняемый в базе данных PostgreSQL и используемый при анализе и обработке дневниковых записей.
 *
 * Основные атрибуты класса:
 *
 * id — уникальный идентификатор эмоционального состояния;
 * name — наименование эмоционального состояния.
 *
 * Связанные модули: JournalEntry, EmotionService
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
@Table(name = "emotion")
@Getter
@Setter
@NoArgsConstructor
public class Emotion {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;
}
