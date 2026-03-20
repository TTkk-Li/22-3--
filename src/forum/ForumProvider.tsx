import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ForumComment, ForumPost, ForumReply, ForumUser } from './types';
import {
  addReplyToComment,
  formatTimeAgo,
  loadForumState,
  nextId,
  saveForumState,
  type ForumPersistedState,
} from './forumStorage';

type ForumActions = {
  login: (username: string, password: string) => { ok: boolean; error?: string };
  register: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  createPost: (input: {
    categoryId: string;
    title: string;
    game: string;
    content: string;
    coverImage?: string;
    tag?: string;
  }) => { ok: boolean; error?: string; post?: ForumPost };
  addComment: (postId: string, content: string) => { ok: boolean; error?: string };
  addReply: (
    postId: string,
    commentId: string,
    content: string
  ) => { ok: boolean; error?: string };
};

type ForumContextValue = ForumPersistedState & {
  actions: ForumActions;
  formatTimeAgo: (iso: string) => string;
  getUserById: (id: string) => ForumUser | undefined;
  getPostById: (id: string) => ForumPost | undefined;
  getCommentsByPostId: (postId: string) => ForumComment[];
};

const ForumContext = createContext<ForumContextValue | null>(null);

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ForumPersistedState>(() => loadForumState());

  const persist = (next: ForumPersistedState) => {
    setState(next);
    saveForumState(next);
  };

  const actions: ForumActions = useMemo(
    () => ({
      login: (username, password) => {
        const user = state.users.find((u) => u.username === username);
        if (!user) return { ok: false, error: '用户不存在' };
        if (user.password !== password) return { ok: false, error: '密码错误' };
        persist({ ...state, currentUserId: user.id });
        return { ok: true };
      },
      register: (username, password) => {
        const exist = state.users.some((u) => u.username === username);
        if (exist) return { ok: false, error: '用户名已存在' };
        const id = `u-${username}`;
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          username
        )}`;
        const user: ForumUser = { id, username, password, avatarUrl, level: 1 };
        persist({ ...state, users: [...state.users, user], currentUserId: id });
        return { ok: true };
      },
      logout: () => {
        persist({ ...state, currentUserId: null });
      },
      createPost: (input) => {
        const authorId = state.currentUserId;
        if (!authorId) return { ok: false, error: '请先登录' };

        const postId = nextId('post');
        const excerpt = input.content.length > 120 ? `${input.content.slice(0, 120)}...` : input.content;
        const post: ForumPost = {
          id: postId,
          categoryId: input.categoryId,
          title: input.title,
          content: input.content,
          excerpt,
          game: input.game,
          coverImage: input.coverImage,
          tag: input.tag,
          authorId,
          createdAtISO: new Date().toISOString(),
          stats: { views: 0, likes: 0, comments: 0 },
        };

        persist({ ...state, posts: [post, ...state.posts] });
        return { ok: true, post };
      },
      addComment: (postId, content) => {
        const authorId = state.currentUserId;
        if (!authorId) return { ok: false, error: '请先登录发表评论' };
        const trimmed = content.trim();
        if (!trimmed) return { ok: false, error: '评论内容不能为空' };

        const comment: ForumComment = {
          id: nextId('c'),
          postId,
          authorId,
          content: trimmed,
          createdAtISO: new Date().toISOString(),
          replies: [],
        };

        const nextComments = [...state.comments, comment];
        const nextPosts = state.posts.map((p) =>
          p.id === postId ? { ...p, stats: { ...p.stats, comments: p.stats.comments + 1 } } : p
        );
        persist({ ...state, comments: nextComments, posts: nextPosts });
        return { ok: true };
      },
      addReply: (postId, commentId, content) => {
        const authorId = state.currentUserId;
        if (!authorId) return { ok: false, error: '请先登录回复' };
        const trimmed = content.trim();
        if (!trimmed) return { ok: false, error: '回复内容不能为空' };

        const reply: ForumReply = {
          id: nextId('r'),
          commentId,
          authorId,
          content: trimmed,
          createdAtISO: new Date().toISOString(),
        };

        const target = state.comments.find((c) => c.id === commentId && c.postId === postId);
        if (!target) return { ok: false, error: '评论不存在' };

        const nextComments = state.comments.map((c) => (c.id === commentId ? addReplyToComment(c, reply) : c));
        persist({ ...state, comments: nextComments });
        return { ok: true };
      },
    }),
    [state]
  );

  const value: ForumContextValue = useMemo(
    () => ({
      ...state,
      actions,
      formatTimeAgo,
      getUserById: (id) => state.users.find((u) => u.id === id),
      getPostById: (id) => state.posts.find((p) => p.id === id),
      getCommentsByPostId: (postId) => state.comments.filter((c) => c.postId === postId),
    }),
    [state, actions]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used within ForumProvider');
  return ctx;
}

