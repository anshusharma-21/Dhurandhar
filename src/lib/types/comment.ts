export type CommentStatus = "pending" | "approved" | "rejected" | "spam" | "removed";

export interface CommentAuthor {
  id: string;
  display_name: string;
  avatar_url?: string;
  role: "member" | "moderator" | "editor" | "admin";
}

export interface Comment {
  id: string;
  episode_id: string;
  author_profile_id: string;
  author?: CommentAuthor;
  parent_comment_id?: string;
  body: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
  moderated_by?: string;
  moderated_at?: string;
  replies?: Comment[];
}
