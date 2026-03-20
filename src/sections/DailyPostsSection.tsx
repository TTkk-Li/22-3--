import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Eye, 
  Share2, 
  MoreHorizontal,
  Flame,
  Clock,
  TrendingUp
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type SortType = 'hot' | 'new' | 'trending';

interface DailyPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  game: string;
  coverImage?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
  isHot?: boolean;
}

const dailyPosts: DailyPost[] = [
  {
    id: '1',
    title: '终于通关了！分享一些心得体会',
    content: '历经50个小时的奋战，终于打通了这款游戏。不得不说，结局真的让人感动。想和大家分享一些通关技巧和隐藏要素...',
    author: { name: '游戏狂热者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10', level: 42 },
    game: '博德之门3',
    coverImage: 'https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?w=600&h=400&fit=crop',
    stats: { views: 45600, likes: 3200, comments: 567 },
    createdAt: '2小时前',
    isHot: true
  },
  {
    id: '2',
    title: '这个新角色太强了，测评一下',
    content: '刚抽到新角色，测试了一下午，伤害输出真的很离谱。配队思路和使用技巧都在下面了...',
    author: { name: '抽卡达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11', level: 38 },
    game: '原神',
    stats: { views: 28900, likes: 2100, comments: 423 },
    createdAt: '4小时前'
  },
  {
    id: '3',
    title: '有人一起开黑吗？段位钻石',
    content: '主玩打野和射手，想找几个队友一起上分。有语音，心态好，不甩锅...',
    author: { name: '开黑小能手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12', level: 25 },
    game: '王者荣耀',
    stats: { views: 12300, likes: 890, comments: 234 },
    createdAt: '5小时前'
  },
  {
    id: '4',
    title: '游戏截图分享，这个光影效果太美了',
    content: '今天在游戏里发现了一个超好看的场景，赶紧截图保存。这画质真的绝了...',
    author: { name: '风景党', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13', level: 31 },
    game: '荒野大镖客2',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    stats: { views: 67800, likes: 8900, comments: 1234 },
    createdAt: '6小时前',
    isHot: true
  },
  {
    id: '5',
    title: '求助：这个boss怎么打？',
    content: '卡在这个boss三天了，各种方法都试过了。有没有大佬指点一下打法？',
    author: { name: '萌新求助', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14', level: 12 },
    game: '艾尔登法环',
    stats: { views: 8900, likes: 456, comments: 189 },
    createdAt: '8小时前'
  },
  {
    id: '6',
    title: '自制游戏mod分享，增加新功能',
    content: '花了一个月时间做了这个mod，增加了一些实用的功能。欢迎大家下载试用...',
    author: { name: 'Mod大神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15', level: 56 },
    game: '上古卷轴5',
    stats: { views: 34500, likes: 4500, comments: 678 },
    createdAt: '12小时前'
  },
  {
    id: '7',
    title: '游戏音乐合集推荐，每一首都是经典',
    content: '整理了一些个人最喜欢的游戏音乐，包括最终幻想、塞尔达、尼尔等系列...',
    author: { name: '音乐爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=16', level: 28 },
    game: '综合讨论',
    stats: { views: 22300, likes: 3400, comments: 456 },
    createdAt: '1天前'
  },
  {
    id: '8',
    title: '新游试玩报告：值得期待吗？',
    content: '参加了这次测试，整体体验还不错。画面、玩法、剧情都有亮点，但也有一些需要改进的地方...',
    author: { name: '评测君', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=17', level: 45 },
    game: '绝区零',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    stats: { views: 56700, likes: 4100, comments: 789 },
    createdAt: '1天前',
    isHot: true
  }
];

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function DailyPostsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortType>('hot');
  const [posts, setPosts] = useState(dailyPosts);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    // 标题动画
    const titleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.daily-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }
    });
    triggers.push(titleTrigger);

    // 帖子列表动画
    const postTrigger = ScrollTrigger.create({
      trigger: '.posts-list',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.post-item',
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.08,
            ease: 'power3.out' 
          }
        );
      }
    });
    triggers.push(postTrigger);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  const handleSort = (type: SortType) => {
    setSortBy(type);
    // 模拟排序
    const sorted = [...posts].sort(() => Math.random() - 0.5);
    setPosts(sorted);
  };

  const sortOptions: { type: SortType; label: string; icon: React.ElementType }[] = [
    { type: 'hot', label: '最热', icon: Flame },
    { type: 'new', label: '最新', icon: Clock },
    { type: 'trending', label: '趋势', icon: TrendingUp },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#F9F8F7]"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="daily-title mb-10">
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-foreground/5 text-sm text-foreground/60 mb-4"
          >
            今日话题
          </motion.span>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              每日帖子
            </h2>
            
            {/* 排序选项 */}
            <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-gray-200">
              {sortOptions.map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  onClick={() => handleSort(type)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === type
                      ? 'bg-foreground text-white'
                      : 'text-gray-500 hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 帖子列表 */}
        <div className="posts-list space-y-4">
          <AnimatePresence mode="wait">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                className="post-item group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex gap-4">
                  {/* 左侧：封面图或游戏标签 */}
                  <div className="flex-shrink-0">
                    {post.coverImage ? (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden img-hover-zoom">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <span className="text-xs text-gray-400 text-center px-2">
                          {post.game}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 右侧：内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 标题行 */}
                    <div className="flex items-start gap-2 mb-2">
                      {post.isHot && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded bg-red-50 text-red-500 text-xs font-medium">
                          热
                        </span>
                      )}
                      <h3 className="text-base md:text-lg font-semibold line-clamp-1 group-hover:text-foreground/80 transition-colors">
                        {post.title}
                      </h3>
                    </div>

                    {/* 内容摘要 */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {post.content}
                    </p>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between">
                      {/* 作者信息 */}
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full bg-gray-100"
                        />
                        <span className="text-sm text-gray-600">{post.author.name}</span>
                        <span className="text-xs text-gray-400">Lv.{post.author.level}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{post.createdAt}</span>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-1">
                        <motion.button 
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </motion.button>
                        <motion.button 
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      </div>
                    </div>

                    {/* 统计数据 */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="w-3.5 h-3.5" />
                        {formatNumber(post.stats.views)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Heart className="w-3.5 h-3.5" />
                        {formatNumber(post.stats.likes)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {formatNumber(post.stats.comments)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* 加载更多 */}
        <div className="mt-10 text-center">
          <motion.button
            className="pill-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>加载更多</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default DailyPostsSection;
