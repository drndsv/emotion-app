jest.mock('@emotion-app/emotion-analysis', () => ({
  EmotionAnalysisService: class EmotionAnalysisService {},
}));

jest.mock('../../../core/services/auth.service', () => ({
  AuthService: class AuthService {},
}));

jest.mock('../../../core/services/journal.service', () => ({
  JournalService: class JournalService {},
}));

jest.mock('../../../core/services/logger.service', () => ({
  LoggerService: class LoggerService {},
}));

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EmotionAnalysisService } from '@emotion-app/emotion-analysis';
import { Timestamp } from 'firebase/firestore';
import { of, throwError } from 'rxjs';

import { getEmotionLabel } from '../../../core/constants/emotion-states';
import {
  JOURNAL_FALLBACK_DETECTED_STATE,
  JOURNAL_FORM_MESSAGES,
} from '../../../core/constants/journal-form';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import { LoggerService } from '../../../core/services/logger.service';

import { JournalFormPageComponent } from './journal-form-page.component';

function createEntry(): JournalEntry {
  const createdAt = Timestamp.fromDate(new Date(2026, 4, 12, 14, 30));

  return {
    id: 'entry-id',
    userId: 'user-id',
    text: 'Текст записи',
    selectedState: 'calm',
    detectedState: 'joy',
    finalState: 'joy',
    analysis: 'Анализ записи',
    recommendation: 'Рекомендация',
    createdAt,
    updatedAt: createdAt,
  };
}

function setup(
  params: {
    entryId?: string | null;
    entry?: JournalEntry | null;
    loadError?: boolean;
    currentUser?: { uid: string } | null;
  } = {},
) {
  const entryId = params.entryId ?? null;
  const defaultEntry = createEntry();
  const entry = params.entry === undefined ? defaultEntry : params.entry;

  const currentUser =
    params.currentUser === undefined ? { uid: 'user-id' } : params.currentUser;

  const journalService = {
    getEntryById: jest.fn(() =>
      params.loadError ? throwError(() => new Error()) : of(entry),
    ),
    createEntry: jest.fn(() => of('created-entry-id')),
    updateEntry: jest.fn(() => of(undefined)),
  };

  const loggerService = {
    logEvent: jest.fn(() => of(null)),
    logError: jest.fn(() => of(null)),
  };

  const authService = {
    currentUser,
  };

  const emotionAnalysisService = {
    analyze: jest.fn(() =>
      of({
        detectedState: 'joy',
        analysis: 'AI analysis',
        recommendation: 'AI recommendation',
      }),
    ),
  };

  const router = {
    navigate: jest.fn(() => Promise.resolve(true)),
  };

  TestBed.resetTestingModule();

  TestBed.configureTestingModule({
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: jest.fn(() => entryId),
            },
          },
        },
      },
      {
        provide: JournalService,
        useValue: journalService,
      },
      {
        provide: LoggerService,
        useValue: loggerService,
      },
      {
        provide: AuthService,
        useValue: authService,
      },
      {
        provide: EmotionAnalysisService,
        useValue: emotionAnalysisService,
      },
      {
        provide: Router,
        useValue: router,
      },
    ],
  });

  const component = TestBed.runInInjectionContext(
    () => new JournalFormPageComponent(),
  );

  (component as unknown as { ngOnInit: () => void }).ngOnInit();

  return {
    component: component as unknown as {
      ngOnInit: () => void;
      entryId: string | null;
      isEditMode: boolean;
      textMinLength: number;
      textMaxLength: number;
      states: readonly string[];
      entry: () => JournalEntry | null;
      selectedStateControl: {
        value: string;
        setValue: (value: string) => void;
      };
      finalStateControl: {
        value: string;
        setValue: (value: string) => void;
      };
      textControl: {
        value: string;
        touched: boolean;
        setValue: (value: string) => void;
      };
      analysisResult: {
        (): {
          detectedState: JournalEntry['detectedState'];
          analysis: string;
          recommendation: string;
        } | null;
        set: (value: {
          detectedState: JournalEntry['detectedState'];
          analysis: string;
          recommendation: string;
        }) => void;
      };
      isLoading: () => boolean;
      isSaving: () => boolean;
      isAnalyzing: () => boolean;
      errorMessage: () => string;
      analysisErrorMessage: () => string;
      runAnalysis: () => void;
      save: () => void;
      getStateLabel: (state: JournalEntry['finalState']) => string;
      formatDate: (entry: JournalEntry) => string;
      formatTime: (entry: JournalEntry) => string;
    },
    journalService,
    authService,
    emotionAnalysisService,
    router,
    entry,
    defaultEntry,
  };
}

describe('JournalFormPageComponent', () => {
  describe('create mode', () => {
    it('should disable edit mode without entry id', () => {
      const { component } = setup();

      expect(component.isEditMode).toBe(false);
    });

    it('should not load entry without entry id', () => {
      const { journalService } = setup();

      expect(journalService.getEntryById).not.toHaveBeenCalled();
    });
  });

  describe('edit mode loading', () => {
    it('should enable edit mode with entry id', () => {
      const { component } = setup({ entryId: 'entry-id' });

      expect(component.isEditMode).toBe(true);
    });

    it('should load entry by id', () => {
      const { journalService } = setup({ entryId: 'entry-id' });

      expect(journalService.getEntryById).toHaveBeenCalledWith('entry-id');
    });

    it('should store loaded entry', () => {
      const { component, defaultEntry } = setup({ entryId: 'entry-id' });

      expect(component.entry()).toEqual(defaultEntry);
    });

    it('should fill selected state control from loaded entry', () => {
      const { component } = setup({ entryId: 'entry-id' });

      expect(component.selectedStateControl.value).toBe(
        getEmotionLabel('calm'),
      );
    });

    it('should fill text control from loaded entry', () => {
      const { component, defaultEntry } = setup({ entryId: 'entry-id' });

      expect(component.textControl.value).toBe(defaultEntry.text);
    });

    it('should fill final state control from loaded entry', () => {
      const { component } = setup({ entryId: 'entry-id' });

      expect(component.finalStateControl.value).toBe(getEmotionLabel('joy'));
    });

    it('should restore analysis result from loaded entry', () => {
      const { component, defaultEntry } = setup({ entryId: 'entry-id' });

      expect(component.analysisResult()).toEqual({
        detectedState: defaultEntry.detectedState,
        analysis: defaultEntry.analysis,
        recommendation: defaultEntry.recommendation,
      });
    });

    it('should stop loading after loaded entry is received', () => {
      const { component } = setup({ entryId: 'entry-id' });

      expect(component.isLoading()).toBe(false);
    });

    it('should set load error message when entry loading fails', () => {
      const { component } = setup({
        entryId: 'entry-id',
        loadError: true,
      });

      expect(component.errorMessage()).toBe(JOURNAL_FORM_MESSAGES.loadFailed);
    });

    it('should not store entry when entry is not found', () => {
      const { component } = setup({
        entryId: 'entry-id',
        entry: null,
      });

      expect(component.entry()).toBeNull();
    });

    it('should keep selected state empty when entry is not found', () => {
      const { component } = setup({
        entryId: 'entry-id',
        entry: null,
      });

      expect(component.selectedStateControl.value).toBe('');
    });

    it('should keep text empty when entry is not found', () => {
      const { component } = setup({
        entryId: 'entry-id',
        entry: null,
      });

      expect(component.textControl.value).toBe('');
    });
  });

  describe('analysis', () => {
    it('should not call analysis service for invalid text', () => {
      const { component, emotionAnalysisService } = setup();

      component.textControl.setValue('a');
      component.runAnalysis();

      expect(emotionAnalysisService.analyze).not.toHaveBeenCalled();
    });

    it('should mark text control as touched for invalid text', () => {
      const { component } = setup();

      component.textControl.setValue('a');
      component.runAnalysis();

      expect(component.textControl.touched).toBe(true);
    });

    it('should show text too short message for invalid text', () => {
      const { component } = setup();

      component.textControl.setValue('a');
      component.runAnalysis();

      expect(component.analysisErrorMessage()).toBe(
        JOURNAL_FORM_MESSAGES.textTooShort,
      );
    });

    it('should call analysis service with text', () => {
      const { component, emotionAnalysisService } = setup();

      component.textControl.setValue('Сегодня я чувствую себя хорошо');
      component.runAnalysis();

      expect(emotionAnalysisService.analyze).toHaveBeenCalledWith(
        'Сегодня я чувствую себя хорошо',
      );
    });

    it('should save analysis result', () => {
      const { component } = setup();

      component.textControl.setValue('Сегодня я чувствую себя хорошо');
      component.runAnalysis();

      expect(component.analysisResult()).toEqual({
        detectedState: 'joy',
        analysis: 'AI analysis',
        recommendation: 'AI recommendation',
      });
    });

    it('should fill final state from detected state', () => {
      const { component } = setup();

      component.textControl.setValue('Сегодня я чувствую себя хорошо');
      component.runAnalysis();

      expect(component.finalStateControl.value).toBe(getEmotionLabel('joy'));
    });

    it('should stop analyzing after successful analysis', () => {
      const { component } = setup();

      component.textControl.setValue('Сегодня я чувствую себя хорошо');
      component.runAnalysis();

      expect(component.isAnalyzing()).toBe(false);
    });

    it('should show analysis error when analysis request fails', () => {
      const { component, emotionAnalysisService } = setup();

      emotionAnalysisService.analyze.mockReturnValueOnce(
        throwError(() => new Error()),
      );

      component.textControl.setValue('Сегодня был тяжелый день');
      component.runAnalysis();

      expect(component.analysisErrorMessage()).toBe(
        JOURNAL_FORM_MESSAGES.analysisFailed,
      );
    });

    it('should stop analyzing when analysis request fails', () => {
      const { component, emotionAnalysisService } = setup();

      emotionAnalysisService.analyze.mockReturnValueOnce(
        throwError(() => new Error()),
      );

      component.textControl.setValue('Сегодня был тяжелый день');
      component.runAnalysis();

      expect(component.isAnalyzing()).toBe(false);
    });
  });

  describe('save validation', () => {
    it('should show required fields message for invalid form', () => {
      const { component } = setup();

      component.save();

      expect(component.errorMessage()).toBe(
        JOURNAL_FORM_MESSAGES.requiredFields,
      );
    });

    it('should not call create entry for invalid form', () => {
      const { component, journalService } = setup();

      component.save();

      expect(journalService.createEntry).not.toHaveBeenCalled();
    });

    it('should show not authorized message without user', () => {
      const { component } = setup({
        currentUser: null,
      });

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(component.errorMessage()).toBe(
        JOURNAL_FORM_MESSAGES.notAuthorized,
      );
    });

    it('should not call create entry without user', () => {
      const { component, journalService } = setup({
        currentUser: null,
      });

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(journalService.createEntry).not.toHaveBeenCalled();
    });
  });

  describe('create entry', () => {
    it('should call create entry', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(journalService.createEntry).toHaveBeenCalled();
    });

    it('should create entry with fallback detected state without analysis', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(journalService.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          detectedState: JOURNAL_FALLBACK_DETECTED_STATE,
        }),
      );
    });

    it('should create entry with selected state as final state without analysis', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(journalService.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          finalState: 'calm',
        }),
      );
    });

    it('should create entry with analysis detected state', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.finalStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.analysisResult.set({
        detectedState: 'anxiety',
        analysis: 'AI analysis',
        recommendation: 'AI recommendation',
      });
      component.save();

      expect(journalService.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          detectedState: 'anxiety',
        }),
      );
    });

    it('should create entry with selected final state', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.finalStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.analysisResult.set({
        detectedState: 'anxiety',
        analysis: 'AI analysis',
        recommendation: 'AI recommendation',
      });
      component.save();

      expect(journalService.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          finalState: 'joy',
        }),
      );
    });

    it('should create entry with detected state as final state when final state is not selected', () => {
      const { component, journalService } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.analysisResult.set({
        detectedState: 'sadness',
        analysis: 'AI analysis',
        recommendation: 'AI recommendation',
      });
      component.save();

      expect(journalService.createEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          finalState: 'sadness',
        }),
      );
    });

    it('should navigate after successful create', () => {
      const { component, router } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(router.navigate).toHaveBeenCalledWith(['/journal']);
    });

    it('should stop saving after successful create', () => {
      const { component } = setup();

      component.selectedStateControl.setValue(getEmotionLabel('calm'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(component.isSaving()).toBe(false);
    });

    it('should show save error when create request fails', () => {
      const { component, journalService } = setup();

      journalService.createEntry.mockReturnValueOnce(
        throwError(() => new Error()),
      );

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(component.errorMessage()).toBe(JOURNAL_FORM_MESSAGES.saveFailed);
    });

    it('should not navigate when create request fails', () => {
      const { component, journalService, router } = setup();

      journalService.createEntry.mockReturnValueOnce(
        throwError(() => new Error()),
      );

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Валидный текст записи');
      component.save();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('update entry', () => {
    it('should call update entry in edit mode', () => {
      const { component, journalService } = setup({
        entryId: 'entry-id',
      });

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Обновленный текст');
      component.finalStateControl.setValue(getEmotionLabel('joy'));
      component.save();

      expect(journalService.updateEntry).toHaveBeenCalled();
    });

    it('should update entry by id', () => {
      const { component, journalService } = setup({
        entryId: 'entry-id',
      });

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Обновленный текст');
      component.finalStateControl.setValue(getEmotionLabel('joy'));
      component.save();

      expect(journalService.updateEntry).toHaveBeenCalledWith(
        'entry-id',
        expect.any(Object),
      );
    });

    it('should navigate after successful update', () => {
      const { component, router } = setup({
        entryId: 'entry-id',
      });

      component.selectedStateControl.setValue(getEmotionLabel('joy'));
      component.textControl.setValue('Обновленный текст');
      component.finalStateControl.setValue(getEmotionLabel('joy'));
      component.save();

      expect(router.navigate).toHaveBeenCalledWith(['/journal']);
    });
  });

  describe('helpers', () => {
    it('should format date', () => {
      const { component, defaultEntry } = setup();

      expect(component.formatDate(defaultEntry)).toBe('12 мая 2026 г.');
    });

    it('should format time', () => {
      const { component, defaultEntry } = setup();

      expect(component.formatTime(defaultEntry)).toBe('14:30');
    });

    it('should return state label', () => {
      const { component } = setup();

      expect(component.getStateLabel('anger')).toBe(getEmotionLabel('anger'));
    });
  });
});
