package com.emotiondiary.service;

import com.emotiondiary.dto.Dto.*;
import com.emotiondiary.entity.*;
import com.emotiondiary.exception.ApiException;
import com.emotiondiary.repository.*;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class JournalService{ private final JournalEntryRepository repo; private final UserRepository users; private final MonitoringService monitoringService;
public JournalService(JournalEntryRepository repo, UserRepository users, MonitoringService monitoringService) { this.repo = repo; this.users = users; this.monitoringService = monitoringService; }
private AppUser u(Long uid){return users.findById(uid).orElseThrow(()->new ApiException("User not found"));}
private JournalResponse map(JournalEntry e){return new JournalResponse(e.getId(),e.getUser().getId(),e.getText(),e.getSelectedEmotion(),e.getDetectedEmotion(),e.getFinalEmotion(),e.getAnalysis(),e.getRecommendation(),String.valueOf(e.getCreatedAt()),String.valueOf(e.getUpdatedAt()));}
public List<JournalResponse> all(Long uid){return repo.findByUserOrderByCreatedAtDesc(u(uid)).stream().map(this::map).toList();}
public JournalResponse get(Long uid,Long id){var e=repo.findById(id).orElseThrow(()->new ApiException("Entry not found")); if(!e.getUser().getId().equals(uid)) throw new ApiException("Forbidden"); return map(e);} 
public JournalResponse create(Long uid,JournalRequest r){var e=new JournalEntry(); e.setUser(u(uid)); apply(e,r); e = repo.save(e); monitoringService.systemLog(uid,"JOURNAL","INFO","JOURNAL_CREATED","Journal entry created",String.valueOf(e.getId())); return map(e);} 
public JournalResponse update(Long uid,Long id,JournalRequest r){var e=repo.findById(id).orElseThrow(()->new ApiException("Entry not found")); if(!e.getUser().getId().equals(uid)) throw new ApiException("Forbidden"); apply(e,r); e = repo.save(e); monitoringService.systemLog(uid,"JOURNAL","INFO","JOURNAL_UPDATED","Journal entry updated",String.valueOf(e.getId())); return map(e);} 
public void del(Long uid,Long id){var e=repo.findById(id).orElseThrow(()->new ApiException("Entry not found")); if(!e.getUser().getId().equals(uid)) throw new ApiException("Forbidden"); repo.delete(e); monitoringService.systemLog(uid,"JOURNAL","WARN","JOURNAL_DELETED","Journal entry deleted",String.valueOf(id));} private void apply(JournalEntry e,JournalRequest r){e.setText(r.text());e.setSelectedEmotion(r.selectedEmotion());e.setDetectedEmotion(r.detectedEmotion());e.setFinalEmotion(r.finalEmotion());e.setAnalysis(r.analysis());e.setRecommendation(r.recommendation());}}
