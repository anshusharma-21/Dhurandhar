export type UserRole = "member" | "moderator" | "editor" | "admin";
export type AccountStatus = "active" | "suspended" | "deleted";

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  email_verified_at?: string | null;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}
