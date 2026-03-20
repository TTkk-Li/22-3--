import type { ElementType } from 'react';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2, MessageSquare, Users, Sparkles,
  Monitor, Smartphone, Cpu, Music2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useForum } from '../forum/ForumProvider';
import { categories as boardCategories } from '../forum/mockData';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<string, ElementType> = {
  'cat-1': Gamepad2,
  'cat-2': MessageSquare,
  'cat-3': Music2,
  'cat-4': Users,
  'cat-5': Sparkles,
  'cat-6': Monitor,
  'cat-7': Smartphone,
  'cat-8': Cpu,
};

export function CategorySection({ onSelectCategory }: { onSelectCategory: (id: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { posts } = useForum();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>('.cat-card');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    });
    tl.fromTo('.cat-heading',
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    ).fromTo(cards,
      { y: 56, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power3.out' },
      '-=0.5'
    );
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-[var(--c-bg)]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* Heading */}
        <div className="cat-heading mb-14 flex flex-col items-center text-center gap-3">
          <span className="section-label">探索社区</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
          }}>
            板块分类
          </h2>
          <p className="text-sm max-w-xs" style={{ color: 'var(--c-ink-3)', fontWeight: 300 }}>
            找到你感兴趣的话题，加入热烈的讨论
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {boardCategories.map((cat) => {
            const Icon = ICON_MAP[cat.id] ?? Gamepad2;
            const count = posts.filter(p => p.categoryId === cat.id).length;
            return (
              <motion.div
                key={cat.id}
                className="cat-card group relative p-5 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: '#fff',
                  border: '1px solid var(--c-border)',
                  opacity: 0,
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectCategory(cat.id)}
                role="button" tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelectCategory(cat.id)}
              >
                {/* Hover fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 20%, rgba(197,168,130,0.10) 0%, transparent 70%)',
                  }}
                />
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      background: 'var(--c-surface-2)',
                      boxShadow: '0 0 0 0 transparent',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--c-ink-2)' }} />
                  </div>
                  <h3
                    className="text-sm font-semibold mb-1 group-hover:translate-x-0.5 transition-transform duration-300"
                    style={{ color: 'var(--c-ink)' }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-3"
                    style={{ color: 'var(--c-ink-3)' }}>
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--c-accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--c-ink-4)' }}>
                      {count} 篇帖子
                    </span>
                  </div>
                </div>
                {/* Arrow */}
                <div
                  className="absolute bottom-4 right-4 w-7 h-7 rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
                  style={{ background: 'var(--c-surface-2)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: 'var(--c-ink-2)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
