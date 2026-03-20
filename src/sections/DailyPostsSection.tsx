import { useRef, useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Eye, Share2, Flame, Clock, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForum } from '../forum/ForumProvider';
import { formatTimeAgo } from '../forum/forumStorage';

gsap.registerPlugin(ScrollTrigger);

type Sort = 'hot' | 'new' | 'trending';

function fmt(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000)  return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

const SORTS: { type: Sort; label: string; icon: ElementType }[] = [
  { type: 'hot',      label: '最热',  icon: Flame },
  { type: 'new',      label: '最新',  icon: Clock },
  { type: 'trending', label: '趋势',  icon: TrendingUp },
];

export function DailyPostsSection({ onOpenPost }: { onOpenPost: (id: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [sort, setSort]           = useState<Sort>('hot');
  const [visible, setVisible]     = useState(5);
  const { posts, getUserById }    = useForum();

  const sorted = useMemo(() => {
    const base = [...posts];
    if (sort === 'new')      return base.sort((a, b) => b.createdAtISO > a.createdAtISO ? 1 : -1);
    if (sort === 'trending') return base.sort((a, b) =>
      b.stats.likes * 2 + b.stats.comments - (a.stats.likes * 2 + a.stats.comments));
    return base.sort((a, b) =>
      b.stats.likes + b.stats.comments * 2 - (a.stats.likes + a.stats.comments * 2));
  }, [posts, sort]);

  const slice = sorted.slice(0, visible);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.create({
      trigger: section, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo('.daily-heading',
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
        gsap.fromTo('.post-row',
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.2 });
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => setVisible(5), [sort]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[var(--c-bg)]">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">

        {/* Heading */}
        <div className="daily-heading mb-10">
          <span className="section-label mb-3 block">今日话题</span>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              color: 'var(--c-ink)',
            }}>每日帖子</h2>

            {/* Sort tabs */}
            <div className="flex items-center gap-1 rounded-full p-1"
              style={{ background: '#fff', border: '1px solid var(--c-border)' }}>
              {SORTS.map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  onClick={() => setSort(type)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
                  style={{
                    background:  sort === type ? 'var(--c-ink)' : 'transparent',
                    color:       sort === type ? 'var(--c-bg)'  : 'var(--c-ink-3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {slice.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm py-12 text-center rounded-2xl"
                style={{ color: 'var(--c-ink-3)', border: '1px dashed var(--c-border)', background: '#fff' }}
              >
                暂无帖子，先去各板块发表内容吧。
              </motion.div>
            ) : slice.map((post) => {
              const author = getUserById(post.authorId);
              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="post-row group flex gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid var(--c-border)' }}
                  whileHover={{ y: -3, boxShadow: '0 12px 36px -8px rgba(26,25,24,0.10)' }}
                  onClick={() => onOpenPost(post.id)}
                  role="button" tabIndex={0}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden img-zoom">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-center px-1"
                        style={{ background: 'var(--c-surface-2)', color: 'var(--c-ink-4)' }}>
                        {post.game}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      {post.tag && (
                        <span className="flex-shrink-0 tag-badge">{post.tag}</span>
                      )}
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2"
                        style={{ color: 'var(--c-ink)' }}>
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-xs line-clamp-2 leading-relaxed"
                      style={{ color: 'var(--c-ink-3)' }}>
                      {post.excerpt || post.content}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2"
                      style={{ borderTop: '1px solid var(--c-surface-2)' }}>
                      <div className="flex items-center gap-2">
                        <img src={author?.avatarUrl ?? ''} alt={author?.username ?? ''}
                          className="w-5 h-5 rounded-full av-gs"
                          style={{ background: 'var(--c-surface-2)' }} />
                        <span className="text-xs" style={{ color: 'var(--c-ink-2)' }}>{author?.username ?? '—'}</span>
                        <span className="text-xs" style={{ color: 'var(--c-ink-4)' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--c-ink-4)' }}>{formatTimeAgo(post.createdAtISO)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {[
                          { icon: Eye,           val: post.stats.views },
                          { icon: Heart,         val: post.stats.likes },
                          { icon: MessageCircle, val: post.stats.comments },
                        ].map(({ icon: Icon, val }, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[11px]"
                            style={{ color: 'var(--c-ink-4)' }}>
                            <Icon className="w-3 h-3" />{fmt(val)}
                          </span>
                        ))}
                        <motion.button
                          className="p-1 rounded-full transition-colors"
                          whileHover={{ scale: 1.15, backgroundColor: 'var(--c-surface-2)' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={e => e.stopPropagation()}
                        >
                          <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--c-ink-4)' }} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load more */}
        {visible < sorted.length && (
          <div className="mt-8 text-center">
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVisible(v => Math.min(sorted.length, v + 5))}
            >
              <span>加载更多</span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

export default DailyPostsSection;
