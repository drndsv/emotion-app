package com.emotiondiary.repository;

import com.emotiondiary.entity.Emotion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionRepository extends JpaRepository<Emotion, Long> {

  Optional<Emotion> findByNameIgnoreCase(String name);
}
