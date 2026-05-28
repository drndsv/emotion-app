package com.emotiondiary.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_log")
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
  void prePersist() { createdAt = Instant.now(); }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }
  public LogType getEventType() { return eventType; }
  public void setEventType(LogType eventType) { this.eventType = eventType; }
  public LogLevel getLogLevel() { return logLevel; }
  public void setLogLevel(LogLevel logLevel) { this.logLevel = logLevel; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public String getDetails() { return details; }
  public void setDetails(String details) { this.details = details; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
