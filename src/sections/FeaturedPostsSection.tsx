import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Heart, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForum } from '../forum/ForumProvider';

gsap.registerPlugin(ScrollTrigger);

function fmt(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000)  return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

export function FeaturedPostsSection({ onOpenPost }: { onOpenPost: (id: string) => void }) {
  const sectionRef    = useRef<HTMLElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const { posts, getUserById } = useForum();

  const featured = [...posts]
    .sort((a, b) => (b.stats.likes + b.stats.comments * 2) - (a.stats.likes + a.stats.comments * 2));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.create({
      trigger: section, start: 'top 80%', once: true,
      onEnter: () =>
        gsap.fromTo('.feat-heading',
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }),
    });
    return () => st.kill();
  }, []);

  const sync = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => el.removeEventListener('scroll', sync);
  }, [featured.length]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-[var(--c-bg)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Heading row */}
        <div className="feat-heading flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <span className="section-label">精选内容</span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              color: 'var(--c-ink)',
            }}>热门帖子</h2>
          </div>
          {/* Nav buttons */}
          <div className="hidden md:flex items-center gap-2">
            {(['left','right'] as const).map(dir => {
              const active = dir === 'left' ? canL : canR;
              return (
                <motion.button
                  key={dir}
                  onClick={() => scroll(dir)}
                  disabled={!active}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: active ? '#fff' : 'var(--c-surface-2)',
                    border: '1px solid var(--c-border)',
                    color: active ? 'var(--c-ink)' : 'var(--c-ink-4)',
                    cursor: active ? 'pointer' : 'default',
                  }}
                  whileHover={active ? { scale: 1.08 } : {}}
                  whileTap={active ? { scale: 0.93 } : {}}
                >
                  {dir === 'left'
                    ? <ChevronLeft className="w-5 h-5" />
                    : <ChevronRight className="w-5 h-5" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x-mandatory"
        style={{ paddingLeft: 'max(1.25rem, calc((100vw - 80rem) / 2 + 1.25rem))', paddingRight: '1.25rem' }}
      >
        {featured.length === 0 ? (
          <div className="flex items-center justify-center h-56 px-8 text-sm" style={{ color: 'var(--c-ink-3)' }}>
            暂无精选帖子，先去各板块发表内容吧。
          </div>
        ) : featured.map((post, idx) => {
          const author = getUserById(post.authorId);
          return (
            <motion.article
              key={post.id}
              className="group snap-start flex-shrink-0 w-[320px] md:w-[380px] rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: '#fff',
                border: '1px solid var(--c-border)',
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: Math.min(idx * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 48px -8px rgba(26,25,24,0.13)' }}
              onClick={() => onOpenPost(post.id)}
              tabIndex={0}
              role="button"
            >
              {/* Cover image */}
              <div className="relative h-48 overflow-hidden img-zoom">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'var(--c-surface-2)' }}>
                    <span className="text-sm" style={{ color: 'var(--c-ink-4)' }}>{post.game}</span>
                  </div>
                )}
                {/* Tag overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {post.tag && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(249,248,247,0.92)', backdropFilter: 'blur(8px)', color: 'var(--c-ink)' }}>
                      {post.tag}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(26,25,24,0.75)', backdropFilter: 'blur(8px)', color: '#F9F8F7' }}>
                    {post.game}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="text-sm font-semibold leading-snug mb-2 line-clamp-2 transition-colors duration-200"
                  style={{ color: 'var(--c-ink)' }}>
                  {post.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4 line-clamp-2"
                  style={{ color: 'var(--c-ink-3)' }}>
                  {post.excerpt}
                </p>

                {/* Author + stats */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--c-border)' }}>
                  <div className="flex items-center gap-2">
                    <img src={author?.avatarUrl ?? ''} alt={author?.username ?? ''}
                      className="w-6 h-6 rounded-full av-gs"
                      style={{ background: 'var(--c-surface-2)' }} />
                    <span className="text-xs" style={{ color: 'var(--c-ink-2)' }}>{author?.username ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[
                      { icon: Eye,           val: post.stats.views },
                      { icon: Heart,         val: post.stats.likes },
                      { icon: MessageCircle, val: post.stats.comments },
                    ].map(({ icon: Icon, val }) => (
                      <span key={Icon.displayName} className="flex items-center gap-1 text-[11px]"
                        style={{ color: 'var(--c-ink-4)' }}>
                        <Icon className="w-3 h-3" />{fmt(val)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
        <div className="flex-shrink-0 w-5" />
      </div>

      {/* Mobile hint */}
      <div className="md:hidden flex justify-center mt-4">
        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--c-ink-4)' }}>
          左右滑动查看更多 <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </section>
  );
}

export default FeaturedPostsSection;
