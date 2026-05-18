package com.emotiondiary.service;
import com.emotiondiary.dto.Dto.*;
import com.emotiondiary.entity.*;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JournalService {
  private final JournalEntryRepository repo;
  private final UserRepository users;

  private AppUser user(Long userId){
    return users.findById(userId)
      .orElseThrow(() ->
        new ApiException("User not found"));
  }

  private JournalResponse map(JournalEntry entry) {
    return new JournalResponse(
      entry.getId(),
      entry.getUser().getId(),
      entry.getText(),
      entry.getSelectedEmotion(),
      entry.getDetectedEmotion(),
      entry.getFinalEmotion(),
      entry.getAnalysis(),
      entry.getRecommendation(),
      String.valueOf(entry.getCreatedAt()),
      String.valueOf(entry.getUpdatedAt())
    );
  }

  public List<JournalResponse> all(Long userId) {
    return repo.findByUserOrderByCreatedAtDesc(user(userId))
      .stream()
      .map(this::map)
      .toList();
  }

  public JournalResponse get(Long userId, Long id) {
    var entry = repo.findById(id)
      .orElseThrow(() -> new ApiException("Entry not found")
      );

    if(!entry.getUser().getId().equals(userId)) {
      throw new ApiException("Forbidden");
    }

    return map(entry);
  }

  public JournalResponse create(Long userId, JournalRequest request) {
    var entry = new JournalEntry();

    entry.setUser(user(userId)); apply(entry,request);

    return map(repo.save(entry));
  }
  public JournalResponse update(Long userId, Long id, JournalRequest request) {
    var entry = repo.findById(id)
      .orElseThrow(() -> new ApiException("Entry not found")
      );

    if(!entry.getUser().getId().equals(userId)) {
      throw new ApiException("Forbidden");
    }

    apply(entry,request);

    return map(repo.save(entry));
  }
  public void delete(Long userId, Long id) {
    var entry = repo.findById(id)
      .orElseThrow(() ->
        new ApiException("Entry not found")
      );

    if(!entry.getUser().getId().equals(userId)) {
      throw new ApiException("Forbidden");
    }
    repo.delete(entry);
  }

  private void apply(JournalEntry entry, JournalRequest request) {
    entry.setText(request.text());
    entry.setSelectedEmotion(request.selectedEmotion());
    entry.setDetectedEmotion(request.detectedEmotion());
    entry.setFinalEmotion(request.finalEmotion());
    entry.setAnalysis(request.analysis());
    entry.setRecommendation(request.recommendation());
  }
}
