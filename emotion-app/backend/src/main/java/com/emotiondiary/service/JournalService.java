package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.JournalRequest;
import com.emotiondiary.dto.Dto.JournalResponse;
import com.emotiondiary.entity.AppUser;
import com.emotiondiary.entity.JournalEntry;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.JournalEntryRepository;
import com.emotiondiary.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JournalService {

  private final JournalEntryRepository journalEntryRepository;
  private final UserRepository userRepository;
  private final EmotionService emotionService;
  private final MonitoringService monitoringService;

  public List<JournalResponse> all(Long userId) {
    return journalEntryRepository.findByUserOrderByCreatedAtDesc(findUser(userId)).stream()
        .map(this::map)
        .toList();
  }

  public JournalResponse get(Long userId, Long id) {
    JournalEntry entry = findOwnedEntry(userId, id);
    return map(entry);
  }

  public JournalResponse create(Long userId, JournalRequest request) {
    JournalEntry entry = new JournalEntry();
    entry.setUser(findUser(userId));
    apply(entry, request);

    JournalEntry savedEntry = journalEntryRepository.save(entry);
    monitoringService.systemLog(
        userId,
        "JOURNAL",
        "INFO",
        "JOURNAL_CREATED",
        "Journal entry created",
        String.valueOf(savedEntry.getId()));
    return map(savedEntry);
  }

  public JournalResponse update(Long userId, Long id, JournalRequest request) {
    JournalEntry entry = findOwnedEntry(userId, id);
    apply(entry, request);

    JournalEntry savedEntry = journalEntryRepository.save(entry);
    monitoringService.systemLog(
        userId,
        "JOURNAL",
        "INFO",
        "JOURNAL_UPDATED",
        "Journal entry updated",
        String.valueOf(savedEntry.getId()));
    return map(savedEntry);
  }

  public void delete(Long userId, Long id) {
    JournalEntry entry = findOwnedEntry(userId, id);
    journalEntryRepository.delete(entry);
    monitoringService.systemLog(
        userId, "JOURNAL", "WARN", "JOURNAL_DELETED", "Journal entry deleted", String.valueOf(id));
  }

  private AppUser findUser(Long userId) {
    return userRepository.findById(userId).orElseThrow(() -> new ApiException("User not found"));
  }

  private JournalEntry findOwnedEntry(Long userId, Long entryId) {
    JournalEntry entry =
        journalEntryRepository.findById(entryId).orElseThrow(() -> new ApiException("Entry not found"));
    if (!entry.getUser().getId().equals(userId)) {
      throw new ApiException("Forbidden");
    }
    return entry;
  }

  private JournalResponse map(JournalEntry entry) {
    return new JournalResponse(
        entry.getId(),
        entry.getUser().getId(),
        entry.getText(),
        emotionService.getName(entry.getSelectedEmotion()),
        emotionService.getName(entry.getDetectedEmotion()),
        emotionService.getName(entry.getFinalEmotion()),
        entry.getAnalysis(),
        entry.getRecommendation(),
        entry.getCreatedAt() == null ? null : entry.getCreatedAt().toString(),
        entry.getUpdatedAt() == null ? null : entry.getUpdatedAt().toString());
  }

  private void apply(JournalEntry entry, JournalRequest request) {
    entry.setText(request.text());
    entry.setSelectedEmotion(emotionService.getOrCreate(request.selectedEmotion()));
    entry.setDetectedEmotion(emotionService.getOrCreate(request.detectedEmotion()));
    entry.setFinalEmotion(emotionService.getOrCreate(request.finalEmotion()));
    entry.setAnalysis(request.analysis());
    entry.setRecommendation(request.recommendation());
  }
}
