export const APP_LOGS_COLLECTION = 'appLogs';

export const LOGGER_MESSAGES = {
  eventSaved: 'App event saved',
  errorSaved: 'App error saved',
  saveFailed: 'Failed to save app log',
} as const;

export const LOGGER_EVENTS = {
  aiAnalysisStarted: 'ai_analysis_started',
  aiAnalysisSuccess: 'ai_analysis_success',
  aiAnalysisFailed: 'ai_analysis_failed',

  journalEntryCreated: 'journal_entry_created',
  journalEntryUpdated: 'journal_entry_updated',
  journalEntryDeleted: 'journal_entry_deleted',

  journalEntryLoadFailed: 'journal_entry_load_failed',
  journalEntryCreateFailed: 'journal_entry_create_failed',
  journalEntryUpdateFailed: 'journal_entry_update_failed',
  journalEntryDeleteFailed: 'journal_entry_delete_failed',
  journalEntriesLoadFailed: 'journal_entries_load_failed',
} as const;
