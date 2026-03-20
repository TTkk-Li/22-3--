import type { ForumComment, ForumLike, ForumNotification, ForumPost, ForumReply, ForumUser } from './types';
import { initialPosts, initialUsers } from './mockData';

const STORAGE_KEY = 'gamehub_forum_v1';
const DATA_VERSION = 4; // 当结构/规则变化时，自动清空并重置数据

export type ForumPersistedState = {
  dataVersion: number;
  users: ForumUser[];
  currentUserId: string | null;
  posts: ForumPost[];
  comments: ForumComment[];
  likes: ForumLike[];
  notifications: ForumNotification[];
};

function safeJsonParse<T>(text: string | null): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function loadForumState(): ForumPersistedState {
  if (typeof window === 'undefined') {
    // SSR guard: use mock seed
    return {
      dataVersion: DATA_VERSION,
      users: initialUsers,
      currentUserId: null,
      posts: initialPosts,
      comments: [],
      likes: [],
      notifications: [],
    };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeJsonParse<ForumPersistedState>(raw);
  if (parsed && parsed.users && parsed.posts) {
    if (parsed.dataVersion === DATA_VERSION) {
      return {
        ...parsed,
        likes: parsed.likes ?? [],
        notifications: parsed.notifications ?? [],
      };
    }
  }

  // first run: seed
  return {
    dataVersion: DATA_VERSION,
    users: initialUsers,
    currentUserId: null,
    posts: initialPosts,
    comments: [],
    likes: [],
    notifications: [],
  };
}

export function saveForumState(state: ForumPersistedState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function nextId(prefix: string) {
  // Use crypto.randomUUID where possible; fallback to time+random.
  const anyCrypto = (globalThis as any).crypto;
  if (anyCrypto?.randomUUID) return `${prefix}-${anyCrypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatTimeAgo(iso: string) {
  const dt = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - dt);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return '刚刚';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;
  const day = Math.floor(hour / 24);
  return `${day}天前`;
}

export function addReplyToComment(comment: ForumComment, reply: ForumReply): ForumComment {
  return { ...comment, replies: [...comment.replies, reply] };
}

