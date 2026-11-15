export type PostType = "LINK" | "ASK" | "SHOW" | "JOB";

export interface SafeUser {
  id: string;
  username: string;
  karma: number;
  about: string | null;
  createdAt: string | Date;
}

export interface PostWithAuthorAndCounts {
  id: string;
  title: string;
  url: string | null;
  text: string | null;
  type: string;
  points: number;
  authorId: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    karma: number;
  };
  _count: {
    comments: number;
  };
  hasVoted?: boolean;
  score?: number;
}

export interface CommentWithDetails {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  points: number;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    karma: number;
  };
  hasVoted?: boolean;
  replies?: CommentWithDetails[];
}

export interface SessionPayload {
  userId: string;
  username: string;
}
