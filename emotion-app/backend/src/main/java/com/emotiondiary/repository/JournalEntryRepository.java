package com.emotiondiary.repository;

import com.emotiondiary.entity.AppUser;
import com.emotiondiary.entity.JournalEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryRepository
  extends JpaRepository<JournalEntry, Long> {

  List<JournalEntry> findByUserOrderByCreatedAtDesc(AppUser user);
}
