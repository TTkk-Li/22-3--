import { useRef, useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
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
import { useForum } from '../forum/ForumProvider';
import { formatTimeAgo } from '../forum/forumStorage';

gsap.registerPlugin(ScrollTrigger);

type SortType = 'hot' | 'new' | 'trending';

type DailyPostsSectionProps = {
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

export function DailyPostsSection({ onOpenPost }: DailyPostsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sortBy, setSortBy] = useState<SortType>('hot');
  const { posts: forumPosts, getUserById } = useForum();
  const [visibleCount, setVisibleCount] = useState(5);

  const dailyPosts = useMemo(() => {
    const base = forumPosts;
    if (sortBy === 'new')
      return base.sort((a, b) => (b.createdAtISO > a.createdAtISO ? 1 : -1));
    if (sortBy === 'trending')
      return base.sort(
        (a, b) => b.stats.likes * 2 + b.stats.comments - (a.stats.likes * 2 + a.stats.comments)
      );
    // hot：用点赞 + 评论权重模拟热度
    return base.sort((a, b) => b.stats.likes + b.stats.comments * 2 - (a.stats.likes + a.stats.comments * 2));
  }, [forumPosts, sortBy]);

  const visiblePosts = useMemo(() => dailyPosts.slice(0, visibleCount), [dailyPosts, visibleCount]);

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

  useEffect(() => {
    setVisibleCount(5);
  }, [sortBy]);

  const handleSort = (type: SortType) => {
    setSortBy(type);
  };

  const sortOptions: { type: SortType; label: string; icon: ElementType }[] = [
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
            {visiblePosts.length === 0 ? (
              <div className="text-sm text-muted-foreground p-8 rounded-2xl border border-border/60 bg-white">
                暂无帖子。你可以先选择任意板块发表内容。
              </div>
            ) : (
              visiblePosts.map((post) => (
              <motion.article
                key={post.id}
                className="post-item group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 cursor-pointer"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => onOpenPost(post.id)}
                role="button"
                tabIndex={0}
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
                      {post.tag ? (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded bg-foreground/5 text-foreground/70 border border-foreground/10 text-xs font-medium">
                          热
                        </span>
                      ) : null}
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
                          src={getUserById(post.authorId)?.avatarUrl ?? ''}
                          alt={getUserById(post.authorId)?.username ?? ''}
                          className="w-6 h-6 rounded-full bg-gray-100 img-grayscale"
                        />
                        <span className="text-sm text-gray-600">{getUserById(post.authorId)?.username ?? ''}</span>
                        <span className="text-xs text-gray-400">Lv.{getUserById(post.authorId)?.level ?? 1}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(post.createdAtISO)}</span>
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
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 加载更多 */}
        <div className="mt-10 text-center">
          <motion.button
            className="pill-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setVisibleCount((c) => Math.min(dailyPosts.length, c + 5))}
            disabled={visibleCount >= dailyPosts.length}
          >
            <span>加载更多</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default DailyPostsSection;
