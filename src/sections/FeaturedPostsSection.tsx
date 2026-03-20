import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForum } from '../forum/ForumProvider';

gsap.registerPlugin(ScrollTrigger);

type FeaturedPostsSectionProps = {
  onOpenPost: (postId: string) => void;
};

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function FeaturedPostsSection({ onOpenPost }: FeaturedPostsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { posts, getUserById } = useForum();

  // 从本地论坛状态中取精选：以 id 前缀区分
  const featuredPosts = posts
    .filter((p) => p.id.startsWith('post-featured'))
    .sort((a, b) => (b.stats.views - a.stats.views) || (b.createdAtISO > a.createdAtISO ? 1 : -1));

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
            className="featured-post-card group flex-shrink-0 w-[340px] md:w-[400px] bg-white rounded-2xl overflow-hidden border border-gray-100 scroll-snap-align-start cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onOpenPost(post.id)}
            role="button"
            tabIndex={0}
          >
            {/* 图片区域 */}
            <div className="relative h-52 overflow-hidden img-hover-zoom">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* 标签 */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground">
                  {post.tag ?? '精选'}
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
                    src={getUserById(post.authorId)?.avatarUrl ?? ''}
                    alt={getUserById(post.authorId)?.username ?? ''}
                    className="w-7 h-7 rounded-full bg-gray-100 img-grayscale"
                  />
                  <span className="text-sm text-gray-600">{getUserById(post.authorId)?.username ?? ''}</span>
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
