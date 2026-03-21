import type { ForumComment, ForumLike, ForumPost, ForumUser } from './types';

const API_BASE = 'http://localhost:3001/api';

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json?.error ?? '请求失败' };
    }

    return { ok: true, data: json };
  } catch {
    return { ok: false, error: '无法连接后端 API，请确认服务已启动' };
  }
}

export const forumApi = {
  login(username: string, password: string) {
    return request<{ user: ForumUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register(username: string, password: string) {
    return request<{ user: ForumUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getPosts() {
    return request<{ posts: ForumPost[] }>('/posts');
  },

  createPost(input: {
    categoryId: string;
    title: string;
    game: string;
    content: string;
    coverImage?: string;
    tag?: string;
    audioDataUrl?: string;
    audioFileName?: string;
    authorId: string;
  }) {
    return request<{ post: ForumPost }>('/posts', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  deletePost(postId: string, userId: string) {
    return request<{ success: true }>(`/posts/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  getComments(postId: string) {
    return request<{ comments: ForumComment[] }>(`/posts/${postId}/comments`);
  },

  createComment(postId: string, content: string, authorId: string) {
    return request<{ comment: ForumComment }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, authorId }),
    });
  },

  createReply(postId: string, commentId: string, content: string, authorId: string) {
    return request<{ comment: ForumComment }>(`/posts/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content, authorId }),
    });
  },

  toggleLike(postId: string, userId: string) {
    return request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getLikes() {
    return request<{ likes: ForumLike[] }>('/likes');
  },
};
