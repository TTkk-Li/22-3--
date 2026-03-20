import type { ForumComment, ForumPost, ForumReply, ForumUser } from './types';
import { initialPosts, initialUsers } from './mockData';

const STORAGE_KEY = 'gamehub_forum_v1';

export type ForumPersistedState = {
  users: ForumUser[];
  currentUserId: string | null;
  posts: ForumPost[];
  comments: ForumComment[];
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
    return { users: initialUsers, currentUserId: null, posts: initialPosts, comments: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeJsonParse<ForumPersistedState>(raw);
  if (parsed && parsed.users && parsed.posts) return parsed;

  // first run: seed
  return { users: initialUsers, currentUserId: null, posts: initialPosts, comments: [] };
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

