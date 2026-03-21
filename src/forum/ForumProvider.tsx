import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ForumComment, ForumPost, ForumReply, ForumUser } from './types';
import { formatTimeAgo } from './forumStorage';
import { forumApi } from './api';

type ForumActions = {
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
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
  }) => Promise<{ ok: boolean; error?: string; post?: ForumPost }>;
  addComment: (postId: string, content: string) => Promise<{ ok: boolean; error?: string }>;
  addReply: (
    postId: string,
    commentId: string,
    content: string
  ) => Promise<{ ok: boolean; error?: string }>;
  toggleLike: (postId: string) => Promise<{ ok: boolean; error?: string }>;
  deletePost: (postId: string) => Promise<{ ok: boolean; error?: string }>;
  markNotificationsRead: (ids: string[]) => void;
  clearReadNotifications: () => void;
};

type ForumContextValue = {
  users: ForumUser[];
  currentUserId: string | null;
  posts: ForumPost[];
  comments: ForumComment[];
  likes: { postId: string; userId: string; createdAtISO: string }[];
  notifications: any[];
  actions: ForumActions;
  formatTimeAgo: (iso: string) => string;
  getUserById: (id: string) => ForumUser | undefined;
  getPostById: (id: string) => ForumPost | undefined;
  getCommentsByPostId: (postId: string) => ForumComment[];
};

const ForumContext = createContext<ForumContextValue | null>(null);

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<ForumUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [likes, setLikes] = useState<{ postId: string; userId: string; createdAtISO: string }[]>([]);
  const [notifications] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const postsRes = await forumApi.getPosts();
      if (postsRes.ok && postsRes.data) {
        setPosts(postsRes.data.posts);
      }
      const likesRes = await forumApi.getLikes();
      if (likesRes.ok && likesRes.data) {
        setLikes(likesRes.data.likes);
      }
    })();
  }, []);

  const refreshComments = async (postId: string) => {
    const res = await forumApi.getComments(postId);
    if (!res.ok || !res.data) return;

    setComments((prev) => {
      const others = prev.filter((c) => c.postId !== postId);
      return [...others, ...res.data!.comments];
    });
  };

  const actions: ForumActions = useMemo(
    () => ({
      login: async (username, password) => {
        const res = await forumApi.login(username, password);
        if (!res.ok || !res.data) return { ok: false, error: res.error ?? '登录失败' };
        const user = res.data.user;
        setCurrentUserId(user.id);
        setUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
        return { ok: true };
      },
      register: async (username, password) => {
        const res = await forumApi.register(username, password);
        if (!res.ok || !res.data) return { ok: false, error: res.error ?? '注册失败' };
        const user = res.data.user;
        setCurrentUserId(user.id);
        setUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
        return { ok: true };
      },
      logout: () => setCurrentUserId(null),
      createPost: async (input) => {
        if (!currentUserId) return { ok: false, error: '请先登录' };
        const res = await forumApi.createPost({ ...input, authorId: currentUserId });
        if (!res.ok || !res.data) return { ok: false, error: res.error ?? '发布失败' };
        setPosts((prev) => [res.data!.post, ...prev]);
        return { ok: true, post: res.data.post };
      },
      addComment: async (postId, content) => {
        if (!currentUserId) return { ok: false, error: '请先登录发表评论' };
        const res = await forumApi.createComment(postId, content, currentUserId);
        if (!res.ok) return { ok: false, error: res.error ?? '评论失败' };
        await refreshComments(postId);
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, stats: { ...p.stats, comments: p.stats.comments + 1 } } : p))
        );
        return { ok: true };
      },
      addReply: async (postId, commentId, content) => {
        if (!currentUserId) return { ok: false, error: '请先登录回复' };
        const res = await forumApi.createReply(postId, commentId, content, currentUserId);
        if (!res.ok) return { ok: false, error: res.error ?? '回复失败' };
        await refreshComments(postId);
        return { ok: true };
      },
      toggleLike: async (postId) => {
        if (!currentUserId) return { ok: false, error: '请先登录' };
        const res = await forumApi.toggleLike(postId, currentUserId);
        if (!res.ok) return { ok: false, error: res.error ?? '操作失败' };
        const liked = !!res.data?.liked;
        setLikes((prev) => {
          const exists = prev.some((l) => l.postId === postId && l.userId === currentUserId);
          if (liked && !exists) return [...prev, { postId, userId: currentUserId, createdAtISO: new Date().toISOString() }];
          if (!liked && exists) return prev.filter((l) => !(l.postId === postId && l.userId === currentUserId));
          return prev;
        });
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            const delta = liked ? 1 : -1;
            return { ...p, stats: { ...p.stats, likes: Math.max(0, p.stats.likes + delta) } };
          })
        );
        return { ok: true };
      },
      deletePost: async (postId) => {
        if (!currentUserId) return { ok: false, error: '请先登录' };
        const res = await forumApi.deletePost(postId, currentUserId);
        if (!res.ok) return { ok: false, error: res.error ?? '删除失败' };
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setComments((prev) => prev.filter((c) => c.postId !== postId));
        setLikes((prev) => prev.filter((l) => l.postId !== postId));
        return { ok: true };
      },
      markNotificationsRead: () => {},
      clearReadNotifications: () => {},
    }),
    [currentUserId]
  );

  const value: ForumContextValue = useMemo(
    () => ({
      users,
      currentUserId,
      posts,
      comments,
      likes,
      notifications,
      actions,
      formatTimeAgo,
      getUserById: (id) => users.find((u) => u.id === id),
      getPostById: (id) => posts.find((p) => p.id === id),
      getCommentsByPostId: (postId) => comments.filter((c) => c.postId === postId),
    }),
    [users, currentUserId, posts, comments, likes, notifications, actions]
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('useForum must be used within ForumProvider');
  return ctx;
}
