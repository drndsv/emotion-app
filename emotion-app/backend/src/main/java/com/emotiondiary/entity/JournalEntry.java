/**
 * Класс предназначен для хранения дневниковых записей пользователя, результатов анализа эмоционального состояния и рекомендаций, полученных в процессе обработки текста.
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
 * Текст записи пользователя, выбранное эмоциональное состояние, результаты анализа.
 *
 * Выходные данные:
 * Объект дневниковой записи, сохраняемый в базе данных PostgreSQL.
 *
 * Связанные модули:
 * AppUser, Emotion, JournalService, EmotionService.
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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "journal_entry")
@Getter
@Setter
@NoArgsConstructor
public class JournalEntry {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private AppUser user;

  @Column(columnDefinition = "text", nullable = false)
  private String text;

  @ManyToOne
  @JoinColumn(name = "selected_emotion_id")
  private Emotion selectedEmotion;

  @ManyToOne
  @JoinColumn(name = "detected_emotion_id")
  private Emotion detectedEmotion;

  @ManyToOne
  @JoinColumn(name = "final_emotion_id")
  private Emotion finalEmotion;

  @Column(columnDefinition = "text")
  private String analysis;

  @Column(columnDefinition = "text")
  private String recommendation;

  private Instant createdAt;

  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    createdAt = Instant.now();
    updatedAt = createdAt;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }
}
