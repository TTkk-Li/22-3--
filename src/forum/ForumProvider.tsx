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
    audioDataUrl?: string;
    audioFileName?: string;
  }) => { ok: boolean; error?: string; post?: ForumPost };
  addComment: (postId: string, content: string) => { ok: boolean; error?: string };
  addReply: (
    postId: string,
    commentId: string,
    content: string
  ) => { ok: boolean; error?: string };
  toggleLike: (postId: string) => { ok: boolean; error?: string };
  deletePost: (postId: string) => { ok: boolean; error?: string };
  markNotificationsRead: (ids: string[]) => void;
  clearReadNotifications: () => void;
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
        // 登录后给自己一个轻量系统通知（不覆盖你已有通知）
        const alreadyHadWelcome = state.notifications.some(
          (n) => n.type === 'system' && n.toUserId === user.id && n.content.includes('欢迎')
        );
        const nextNotifications = alreadyHadWelcome
          ? state.notifications
          : [
              ...state.notifications,
              {
                id: nextId('n'),
                toUserId: user.id,
                fromUserId: undefined,
                type: 'system' as const,
                postId: undefined,
                commentId: undefined,
                content: '欢迎回到 GameHub Forum！',
                createdAtISO: new Date().toISOString(),
                isRead: false,
              },
            ];

        persist({ ...state, currentUserId: user.id, notifications: nextNotifications });
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
        const systemWelcome = {
          id: nextId('n'),
          toUserId: id,
          type: 'system' as const,
          content: '注册成功，现在可以开始分享音乐和发帖了。',
          createdAtISO: new Date().toISOString(),
          isRead: false,
        };
        persist({
          ...state,
          users: [...state.users, user],
          currentUserId: id,
          notifications: [...state.notifications, systemWelcome],
        });
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
          audioDataUrl: input.audioDataUrl,
          audioFileName: input.audioFileName,
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

        const post = state.posts.find((p) => p.id === postId);
        if (!post) return { ok: false, error: '帖子不存在' };

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

        // 通知帖子作者
        const nextNotifications =
          post.authorId !== authorId
            ? [
                ...state.notifications,
                {
                  id: nextId('n'),
                  toUserId: post.authorId,
                  fromUserId: authorId,
                  type: 'comment' as const,
                  postId: post.id,
                  content: `你的帖子《${post.title}》收到了一条新评论`,
                  createdAtISO: new Date().toISOString(),
                  isRead: false,
                },
              ]
            : state.notifications;

        persist({ ...state, comments: nextComments, posts: nextPosts, notifications: nextNotifications });
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

        // 通知评论作者
        const post = state.posts.find((p) => p.id === postId);
        const nextNotifications =
          target.authorId !== authorId && post
            ? [
                ...state.notifications,
                {
                  id: nextId('n'),
                  toUserId: target.authorId,
                  fromUserId: authorId,
                  type: 'reply' as const,
                  postId,
                  commentId,
                  content: `你收到对《${post.title}》评论的回复`,
                  createdAtISO: new Date().toISOString(),
                  isRead: false,
                },
              ]
            : state.notifications;

        persist({ ...state, comments: nextComments, notifications: nextNotifications });
        return { ok: true };
      },
      toggleLike: (postId) => {
        const userId = state.currentUserId;
        if (!userId) return { ok: false, error: '请先登录' };
        const post = state.posts.find((p) => p.id === postId);
        if (!post) return { ok: false, error: '帖子不存在' };

        const exists = state.likes.some((l) => l.postId === postId && l.userId === userId);
        let nextLikes = state.likes;
        let nextPosts = state.posts;
        let nextNotifications = state.notifications;

        if (exists) {
          nextLikes = state.likes.filter((l) => !(l.postId === postId && l.userId === userId));
          nextPosts = state.posts.map((p) =>
            p.id === postId ? { ...p, stats: { ...p.stats, likes: Math.max(0, p.stats.likes - 1) } } : p
          );
        } else {
          const like = {
            postId,
            userId,
            createdAtISO: new Date().toISOString(),
          };
          nextLikes = [...state.likes, like];
          nextPosts = state.posts.map((p) =>
            p.id === postId ? { ...p, stats: { ...p.stats, likes: p.stats.likes + 1 } } : p
          );

          if (post.authorId !== userId) {
            nextNotifications = [
              ...state.notifications,
              {
                id: nextId('n'),
                toUserId: post.authorId,
                fromUserId: userId,
                type: 'like' as const,
                postId,
                content: `你的帖子《${post.title}》被点赞了`,
                createdAtISO: new Date().toISOString(),
                isRead: false,
              },
            ];
          }
        }

        persist({ ...state, likes: nextLikes, posts: nextPosts, notifications: nextNotifications });
        return { ok: true };
      },
      deletePost: (postId) => {
        const userId = state.currentUserId;
        if (!userId) return { ok: false, error: '请先登录' };
        const post = state.posts.find((p) => p.id === postId);
        if (!post) return { ok: false, error: '帖子不存在' };
        if (post.authorId !== userId) return { ok: false, error: '没有权限删除该帖子' };

        const nextPosts = state.posts.filter((p) => p.id !== postId);
        const nextComments = state.comments.filter((c) => c.postId !== postId);
        const nextLikes = state.likes.filter((l) => l.postId !== postId);
        const nextNotifications = state.notifications.filter((n) => n.postId !== postId);

        persist({
          ...state,
          posts: nextPosts,
          comments: nextComments,
          likes: nextLikes,
          notifications: nextNotifications,
        });

        return { ok: true };
      },
      markNotificationsRead: (ids) => {
        const next = state.notifications.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n));
        persist({ ...state, notifications: next });
      },
      clearReadNotifications: () => {
        const next = state.notifications.filter((n) => !n.isRead);
        persist({ ...state, notifications: next });
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

