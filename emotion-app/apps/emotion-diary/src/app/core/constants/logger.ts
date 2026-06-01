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

  authLoginSuccess: 'auth_login_success',
  authLoginFailed: 'auth_login_failed',

  authRegistrationSuccess: 'auth_registration_success',
  authRegistrationFailed: 'auth_registration_failed',

  authLogoutSuccess: 'auth_logout_success',
  authLogoutFailed: 'auth_logout_failed',

  profileUpdated: 'profile_updated',
  profileUpdateFailed: 'profile_update_failed',

  emailChanged: 'email_changed',
  emailChangeFailed: 'email_change_failed',

  passwordChanged: 'password_changed',
  passwordChangeFailed: 'password_change_failed',
} as const;
