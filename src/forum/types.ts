export type ForumUser = {
  id: string;
  username: string;
  password: string; // DEMO ONLY: do not store plaintext passwords in production.
  avatarUrl: string;
  level?: number;
};

export type ForumCategory = {
  id: string;
  name: string;
  description: string;
};

export type ForumPost = {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  excerpt: string;
  game: string;
  coverImage?: string;
  tag?: string;
  authorId: string;
  createdAtISO: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
};

export type ForumComment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAtISO: string;
  replies: ForumReply[];
};

export type ForumReply = {
  id: string;
  commentId: string;
  authorId: string;
  content: string;
  createdAtISO: string;
};

