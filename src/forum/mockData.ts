import type { ForumCategory, ForumPost, ForumUser } from './types';

export const categories: ForumCategory[] = [
  { id: 'cat-1', name: '热门游戏', description: '当下最火爆的游戏讨论' },
  { id: 'cat-2', name: '游戏杂谈', description: '畅所欲言的游戏话题' },
  { id: 'cat-3', name: '竞技排行', description: '实力比拼排行榜' },
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

// 把“精选/每日”合并成同一套 posts（id 用前缀避免冲突）
export const initialPosts: ForumPost[] = [
  // featured
  {
    id: 'post-featured-1',
    categoryId: 'cat-5',
    title: '原神5.0版本前瞻：纳塔地区全新探索',
    excerpt:
      '随着5.0版本的临近，纳塔地区的神秘面纱即将揭开。本次更新将带来全新的火元素国度，以及令人期待的新角色...',
    content:
      '随着5.0版本的临近，纳塔地区的神秘面纱即将揭开。本次更新将带来全新的火元素国度，以及令人期待的新角色。本文整理了版本线索与可能的探索方向，欢迎大家一起讨论！',
    authorId: 'u-旅行者',
    game: '原神',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
    tag: '热门',
    createdAtISO: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 125000, likes: 8900, comments: 2340 },
  },
  {
    id: 'post-featured-2',
    categoryId: 'cat-3',
    title: '王者荣耀S35赛季上分攻略全解析',
    excerpt:
      '新赛季已经开启，想要快速上分的玩家不要错过这份详细攻略。从英雄选择到对线技巧，全方位助你登顶王者...',
    content:
      '新赛季已经开启，想要快速上分的玩家不要错过这份详细攻略。从英雄选择到对线技巧，全方位助你登顶王者。文末附常见对局思路与应对方案。',
    authorId: 'u-电竞达人',
    game: '王者荣耀',
    coverImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=500&fit=crop',
    tag: '攻略',
    createdAtISO: new Date(Date.now() - 1.2 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 98000, likes: 6500, comments: 1890 },
  },
  {
    id: 'post-featured-3',
    categoryId: 'cat-1',
    title: '黑神话：悟空试玩体验报告',
    excerpt:
      '终于拿到了期待已久的试玩资格，这款国产3A大作的表现究竟如何？让我来为大家详细解读游戏的方方面面...',
    content:
      '终于拿到了期待已久的试玩资格。本文围绕手感、画面表现、打击反馈、关卡节奏与系统深度进行体验记录与观点总结，欢迎理性讨论。',
    authorId: 'u-游戏评测',
    game: '黑神话：悟空',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=800&h=500&fit=crop',
    tag: '评测',
    createdAtISO: new Date(Date.now() - 0.8 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 156000, likes: 12000, comments: 3450 },
  },
  {
    id: 'post-featured-4',
    categoryId: 'cat-6',
    title: '艾尔登法环DLC黄金树幽影全收集',
    excerpt:
      'DLC发售已经一周，相信很多玩家还在探索中。这篇攻略将带你找到所有隐藏的道具、武器和法术...',
    content:
      'DLC发售已经一周，本帖以路线+收集清单的形式整理隐藏道具、武器与法术。适合二周目玩家快速补全，也欢迎各位补充自己发现的细节。',
    authorId: 'u-魂系玩家',
    game: '艾尔登法环',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop',
    tag: '收集',
    createdAtISO: new Date(Date.now() - 3.5 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 87000, likes: 5400, comments: 1230 },
  },
  {
    id: 'post-featured-5',
    categoryId: 'cat-2',
    title: '崩坏：星穹铁道2.0版本角色强度榜',
    excerpt:
      '新版本带来了多位强力角色，环境也发生了巨大变化。本文将从多个维度分析当前版本的角色强度...',
    content:
      '新版本带来了多位强力角色，环境也发生了巨大变化。本文从输出、配队适配、资源门槛与实战表现四个维度给出强度分析，欢迎交流不同练度的体验。',
    authorId: 'u-星穹旅人',
    game: '崩坏：星穹铁道',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop',
    tag: '排行',
    createdAtISO: new Date(Date.now() - 2.5 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 112000, likes: 7800, comments: 2100 },
  },
  {
    id: 'post-featured-6',
    categoryId: 'cat-4',
    title: '塞尔达传说：王国之泪创意建造分享',
    excerpt:
      '海拉鲁大陆的建造系统让无数玩家发挥创意，今天分享一些令人惊叹的建造作品，保证让你大开眼界...',
    content:
      '海拉鲁大陆的建造系统让无数玩家发挥创意。本帖收录了几件我最喜欢的作品：从“省材料结构”到“可运行机械”，并附上建造思路与细节截图（链接待补充）。',
    authorId: 'u-海拉鲁老流氓',
    game: '塞尔达传说',
    coverImage: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=500&fit=crop',
    tag: '创意',
    createdAtISO: new Date(Date.now() - 5.2 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 76000, likes: 9200, comments: 1560 },
  },

  // daily (categoryId 映射简单分配)
  {
    id: 'post-daily-1',
    categoryId: 'cat-1',
    title: '终于通关了！分享一些心得体会',
    excerpt:
      '历经50个小时的奋战，终于打通了这款游戏。不得不说，结局真的让人感动。想和大家分享一些通关技巧和隐藏要素...',
    content:
      '历经50个小时的奋战，终于打通了这款游戏。不得不说，结局真的让人感动。本帖分享通关心得与一些可能被忽略的隐藏要素。你们也可以留言你最喜欢的部分。',
    authorId: 'u-游戏狂热者',
    game: '博德之门3',
    coverImage: 'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=600&h=400&fit=crop',
    tag: '热门',
    createdAtISO: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    stats: { views: 45600, likes: 3200, comments: 567 },
  },
  {
    id: 'post-daily-2',
    categoryId: 'cat-2',
    title: '这个新角色太强了，测评一下',
    excerpt:
      '刚抽到新角色，测试了一下午，伤害输出真的很离谱。配队思路和使用技巧都在下面了...',
    content:
      '刚抽到新角色，测试了一下午，伤害输出真的很离谱。本帖从技能机制、适配配队、循环手法和实战表现做一个主观测评。欢迎大家补充不同练度下的结论。',
    authorId: 'u-抽卡达人',
    game: '原神',
    createdAtISO: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    stats: { views: 28900, likes: 2100, comments: 423 },
  },
  {
    id: 'post-daily-3',
    categoryId: 'cat-4',
    title: '有人一起开黑吗？段位钻石',
    excerpt:
      '主玩打野和射手，想找几个队友一起上分。有语音，心态好，不甩锅...',
    content:
      '主玩打野和射手，想找几个队友一起上分。有语音，心态好，不甩锅。欢迎有同段位/同位置的小伙伴私信交流。',
    authorId: 'u-开黑小能手',
    game: '王者荣耀',
    createdAtISO: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    stats: { views: 12300, likes: 890, comments: 234 },
  },
  {
    id: 'post-daily-4',
    categoryId: 'cat-7',
    title: '游戏截图分享，这个光影效果太美了',
    excerpt:
      '今天在游戏里发现了一个超好看的场景，赶紧截图保存。这画质真的绝了...',
    content:
      '今天在游戏里发现了一个超好看的场景，赶紧截图保存。这画质真的绝了。欢迎大家一起讨论：你们觉得最出片的光源是哪个阶段？',
    authorId: 'u-风景党',
    game: '荒野大镖客2',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    tag: '热门',
    createdAtISO: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    stats: { views: 67800, likes: 8900, comments: 1234 },
  },
  {
    id: 'post-daily-5',
    categoryId: 'cat-6',
    title: '求助：这个boss怎么打？',
    excerpt:
      '卡在这个boss三天了，各种方法都试过了。有没有大佬指点一下打法？',
    content:
      '卡在这个boss三天了，各种方法都试过了。有没有大佬指点一下打法？最好能分享你们的武器/流派和站位策略。',
    authorId: 'u-萌新求助',
    game: '艾尔登法环',
    createdAtISO: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    stats: { views: 8900, likes: 456, comments: 189 },
  },
  {
    id: 'post-daily-6',
    categoryId: 'cat-6',
    title: '自制游戏mod分享，增加新功能',
    excerpt:
      '花了一个月时间做了这个mod，增加了一些实用的功能。欢迎大家下载试用...',
    content:
      '花了一个月时间做了这个mod，增加了一些实用的功能。欢迎大家下载试用，并反馈BUG和体验建议。我会持续更新！',
    authorId: 'u-Mod大神',
    game: '上古卷轴5',
    createdAtISO: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    stats: { views: 34500, likes: 4500, comments: 678 },
  },
  {
    id: 'post-daily-7',
    categoryId: 'cat-4',
    title: '游戏音乐合集推荐，每一首都是经典',
    excerpt:
      '整理了一些个人最喜欢的游戏音乐，包括最终幻想、塞尔达、尼尔等系列...',
    content:
      '整理了一些个人最喜欢的游戏音乐，包括最终幻想、塞尔达、尼尔等系列。你也可以在评论区补充你心中的“必听曲目”。',
    authorId: 'u-音乐爱好者',
    game: '综合讨论',
    createdAtISO: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 22300, likes: 3400, comments: 456 },
  },
  {
    id: 'post-daily-8',
    categoryId: 'cat-5',
    title: '新游试玩报告：值得期待吗？',
    excerpt:
      '参加了这次测试，整体体验还不错。画面、玩法、剧情都有亮点，但也有一些需要改进的地方...',
    content:
      '参加了这次测试，整体体验还不错。画面、玩法、剧情都有亮点，但也有一些需要改进的地方。本帖会持续跟进后续版本，并欢迎大家一起讨论。',
    authorId: 'u-评测君',
    game: '绝区零',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    tag: '热门',
    createdAtISO: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    stats: { views: 56700, likes: 4100, comments: 789 },
  },
];

