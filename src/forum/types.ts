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
  // 音乐分享（仅音乐板块使用）：把音频作为 dataURL（demo）存储在本地
  audioDataUrl?: string;
  audioFileName?: string;
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

export type ForumLike = {
  postId: string;
  userId: string;
  createdAtISO: string;
};

export type ForumNotificationType = 'comment' | 'reply' | 'like' | 'system';

export type ForumNotification = {
  id: string;
  toUserId: string;
  fromUserId?: string;
  type: ForumNotificationType;
  postId?: string;
  commentId?: string;
  content: string;
  createdAtISO: string;
  isRead: boolean;
};

