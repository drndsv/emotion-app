package com.emotiondiary.service;

import com.emotiondiary.entity.Emotion;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.EmotionRepository;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmotionService {

  public static final List<String> DEFAULT_EMOTIONS =
      List.of("joy", "calm", "neutral", "anxiety", "sadness", "anger");

  private static final Set<String> DEFAULT_EMOTION_SET = Set.copyOf(DEFAULT_EMOTIONS);
  private static final String DEFAULT_EMOTION = "neutral";

  private final EmotionRepository emotionRepository;

  public Emotion getOrCreate(String name) {
    String normalizedName = normalizeName(name);
    return emotionRepository
        .findByNameIgnoreCase(normalizedName)
        .orElseGet(() -> createEmotion(normalizedName));
  }

  public String getName(Emotion emotion) {
    return emotion == null ? null : emotion.getName();
  }

  public String normalizeName(String name) {
    String normalizedName = name == null ? DEFAULT_EMOTION : name.trim().toLowerCase();
    if (normalizedName.isBlank()) {
      return DEFAULT_EMOTION;
    }
    return DEFAULT_EMOTION_SET.contains(normalizedName) ? normalizedName : DEFAULT_EMOTION;
  }

  public List<Emotion> findAll() {
    return emotionRepository.findAll();
  }

  private Emotion createEmotion(String name) {
    Emotion emotion = new Emotion();
    emotion.setName(name);
    try {
      return emotionRepository.save(emotion);
    } catch (RuntimeException ex) {
      return emotionRepository
          .findByNameIgnoreCase(name)
          .orElseThrow(() -> new ApiException("Unable to create emotion: " + name));
    }
  }
}
