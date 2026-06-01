import { UserRole } from './user-role.model';

export interface AppUser {
  id: number;
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}
