package com.emotiondiary.entity;
import jakarta.persistence.*;import lombok.*;import java.time.Instant;
@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor
public class AppUser{ @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(unique=true,nullable=false) private String email; @Column(nullable=false) private String passwordHash; private String displayName; private Instant createdAt; private Instant updatedAt;
@PrePersist void pre(){createdAt=Instant.now();updatedAt=createdAt;} @PreUpdate void upd(){updatedAt=Instant.now();}}
