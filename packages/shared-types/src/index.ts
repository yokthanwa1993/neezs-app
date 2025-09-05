export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface UserProfile {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  role?: UserRole;
}


