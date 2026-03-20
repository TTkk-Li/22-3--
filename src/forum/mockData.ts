import type { ForumCategory, ForumPost, ForumUser } from './types';

export const categories: ForumCategory[] = [
  { id: 'cat-1', name: '热门游戏', description: '当下最火爆的游戏讨论' },
  { id: 'cat-2', name: '游戏杂谈', description: '畅所欲言的游戏话题' },
  { id: 'cat-3', name: '音乐分享', description: '分享你喜欢的音乐（上传音频）' },
  { id: 'cat-4', name: '玩家社区', description: '寻找志同道合的伙伴' },
  { id: 'cat-5', name: '新游推荐', description: '发现下一个好游戏' },
  { id: 'cat-6', name: 'PC游戏', description: '端游玩家聚集地' },
  { id: 'cat-7', name: '手游专区', description: '移动端游戏讨论' },
  { id: 'cat-8', name: '硬件外设', description: '游戏装备交流' },
];

function makeUser(seed: string, avatarSeed: string, level: number): ForumUser {
  return {
    id: `u-${seed}`,
    username: seed,
    password: '123456', // demo password
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
    level,
  };
}

export const initialUsers: ForumUser[] = [
  makeUser('旅行者', '1', 1),
  makeUser('电竞达人', '2', 1),
  makeUser('游戏评测', '3', 1),
  makeUser('魂系玩家', '4', 1),
  makeUser('星穹旅人', '5', 1),
  makeUser('海拉鲁老流氓', '6', 1),
  makeUser('游戏狂热者', '10', 42),
  makeUser('抽卡达人', '11', 38),
  makeUser('开黑小能手', '12', 25),
  makeUser('风景党', '13', 31),
  makeUser('萌新求助', '14', 12),
  makeUser('Mod大神', '15', 56),
  makeUser('音乐爱好者', '16', 28),
  makeUser('评测君', '17', 45),
];

// 按你的要求：清空全站帖子（演示从“空数据”开始）
export const initialPosts: ForumPost[] = [];

