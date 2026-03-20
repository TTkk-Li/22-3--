import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  game: string;
  image: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  tag: string;
}

const featuredPosts: Post[] = [
  {
    id: '1',
    title: '原神5.0版本前瞻：纳塔地区全新探索',
    excerpt: '随着5.0版本的临近，纳塔地区的神秘面纱即将揭开。本次更新将带来全新的火元素国度，以及令人期待的新角色...',
    author: { name: '旅行者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    game: '原神',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
    stats: { views: 125000, likes: 8900, comments: 2340 },
    tag: '热门'
  },
  {
    id: '2',
    title: '王者荣耀S35赛季上分攻略全解析',
    excerpt: '新赛季已经开启，想要快速上分的玩家不要错过这份详细攻略。从英雄选择到对线技巧，全方位助你登顶王者...',
    author: { name: '电竞达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    game: '王者荣耀',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=500&fit=crop',
    stats: { views: 98000, likes: 6500, comments: 1890 },
    tag: '攻略'
  },
  {
    id: '3',
    title: '黑神话：悟空试玩体验报告',
    excerpt: '终于拿到了期待已久的试玩资格，这款国产3A大作的表现究竟如何？让我来为大家详细解读游戏的方方面面...',
    author: { name: '游戏评测', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    game: '黑神话：悟空',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=800&h=500&fit=crop',
    stats: { views: 156000, likes: 12000, comments: 3450 },
    tag: '评测'
  },
  {
    id: '4',
    title: '艾尔登法环DLC黄金树幽影全收集',
    excerpt: 'DLC发售已经一周，相信很多玩家还在探索中。这篇攻略将带你找到所有隐藏的道具、武器和法术...',
    author: { name: '魂系玩家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    game: '艾尔登法环',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop',
    stats: { views: 87000, likes: 5400, comments: 1230 },
    tag: '收集'
  },
  {
    id: '5',
    title: '崩坏：星穹铁道2.0版本角色强度榜',
    excerpt: '新版本带来了多位强力角色，环境也发生了巨大变化。本文将从多个维度分析当前版本的角色强度...',
    author: { name: '星穹旅人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    game: '崩坏：星穹铁道',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=500&fit=crop',
    stats: { views: 112000, likes: 7800, comments: 2100 },
    tag: '排行'
  },
  {
    id: '6',
    title: '塞尔达传说：王国之泪创意建造分享',
    excerpt: '海拉鲁大陆的建造系统让无数玩家发挥创意，今天分享一些令人惊叹的建造作品，保证让你大开眼界...',
    author: { name: '海拉鲁老流氓', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
    game: '塞尔达传说',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=500&fit=crop',
    stats: { views: 76000, likes: 9200, comments: 1560 },
    tag: '创意'
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

export function FeaturedPostsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        gsap.fromTo('.featured-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }
    });
    triggers.push(titleTrigger);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollButtons, { passive: true });
    checkScrollButtons();

    return () => container.removeEventListener('scroll', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#F9F8F7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="featured-title flex items-end justify-between mb-12">
          <div>
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full bg-foreground/5 text-sm text-foreground/60 mb-4"
            >
              精选内容
            </motion.span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              热门帖子
            </h2>
          </div>
          
          {/* 滚动按钮 */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              onClick={() => scroll('left')}
              className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'bg-white hover:bg-gray-50 text-foreground' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              whileHover={canScrollLeft ? { scale: 1.05 } : {}}
              whileTap={canScrollLeft ? { scale: 0.95 } : {}}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'bg-white hover:bg-gray-50 text-foreground' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              whileHover={canScrollRight ? { scale: 1.05 } : {}}
              whileTap={canScrollRight ? { scale: 0.95 } : {}}
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 水平滚动容器 */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 px-6 lg:px-8 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* 左侧留白 */}
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)] hidden xl:block" />
        
        {featuredPosts.map((post, index) => (
          <motion.article
            key={post.id}
            className="featured-post-card group flex-shrink-0 w-[340px] md:w-[400px] bg-white rounded-2xl overflow-hidden border border-gray-100 scroll-snap-align-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* 图片区域 */}
            <div className="relative h-52 overflow-hidden img-hover-zoom">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* 标签 */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground">
                  {post.tag}
                </span>
              </div>
              {/* 游戏名 */}
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full bg-foreground/80 backdrop-blur-sm text-xs font-medium text-white">
                  {post.game}
                </span>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* 作者信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full bg-gray-100 img-grayscale"
                  />
                  <span className="text-sm text-gray-600">{post.author.name}</span>
                </div>

                {/* 统计数据 */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(post.stats.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {formatNumber(post.stats.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {formatNumber(post.stats.comments)}
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
        
        {/* 右侧留白 */}
        <div className="flex-shrink-0 w-6 xl:w-[calc((100vw-1280px)/2)]" />
      </div>

      {/* 移动端滚动提示 */}
      <div className="md:hidden flex justify-center mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>左右滑动查看更多</span>
          <ChevronRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default FeaturedPostsSection;
