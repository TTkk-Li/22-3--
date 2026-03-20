export interface Post {
  id: string
  title: string
  author: string
  avatar: string
  category: string
  tags: string[]
  excerpt: string
  image?: string
  likes: number
  comments: number
  views: number
  time: string
  pinned?: boolean
  hot?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
}

export const categories: Category[] = [
  {
    id: 'all',
    name: '全部版块',
    icon: '◈',
    description: '浏览所有话题',
    count: 2847,
    color: '#1A1A1A',
  },
  {
    id: 'game-news',
    name: '游戏资讯',
    icon: '⬡',
    description: '最新游戏动态与发布',
    count: 634,
    color: '#2D2D2D',
  },
  {
    id: 'guide',
    name: '攻略秘籍',
    icon: '◎',
    description: '玩家自制详细攻略',
    count: 892,
    color: '#3D3D3D',
  },
  {
    id: 'review',
    name: '游戏评测',
    icon: '◇',
    description: '深度游戏体验分享',
    count: 411,
    color: '#2D2D2D',
  },
  {
    id: 'team',
    name: '组队开黑',
    icon: '⬟',
    description: '寻找志同道合的玩家',
    count: 328,
    color: '#1A1A1A',
  },
  {
    id: 'creative',
    name: '同人创作',
    icon: '◆',
    description: '玩家原创作品展示',
    count: 267,
    color: '#3D3D3D',
  },
  {
    id: 'offtopic',
    name: '游戏杂谈',
    icon: '○',
    description: '闲聊游戏相关话题',
    count: 315,
    color: '#2D2D2D',
  },
]

export const featuredPosts: Post[] = [
  {
    id: 'f1',
    title: '《艾尔登法环》DLC 全隐藏 Boss 路线图 — 深度探索指南',
    author: '幽境旅者',
    avatar: 'YJ',
    category: '攻略秘籍',
    tags: ['艾尔登法环', 'DLC', 'Boss攻略'],
    excerpt: '本帖详细整理了DLC所有隐藏Boss的路线与打法，适合探索党和成就党参考。',
    likes: 120,
    comments: 15,
    views: 3500,
    time: '2026-03-20',
    image: '',
    pinned: true,
    hot: true,
  },
  // 可在此处继续添加更多帖子
      