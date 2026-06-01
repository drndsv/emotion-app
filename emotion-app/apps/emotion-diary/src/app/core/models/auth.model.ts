import { AppUser } from './app-user.model';

export type CurrentUser = AppUser;

export interface AuthResponse {
  token: string;
  user: CurrentUser;
}

export interface UpdateEmailRequest {
  currentPassword: string;
  newEmail: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
