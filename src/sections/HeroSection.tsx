import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Bell, User, Pencil, LogOut } from 'lucide-react';
import gsap from 'gsap';
import { useForum } from '../forum/ForumProvider';

const TICKER = ['艾尔登法环','黑神话：悟空','原神','崩坏：星穹铁道','赛博朋克2077','塞尔达传说','王者荣耀','逃离塔科夫','Valorant','明日方舟','绝区零','Elden Ring DLC'];
const TAGS = ['原神','王者荣耀','黑神话：悟空','崩铁','塔科夫','明日方舟'];
const CHARS = 'game-Veyra'.split('');

export function HeroSection({ onRequestLogin, onRequestCreatePost, onRequestLogout, onOpenUserCenter }: {
  onRequestLogin: () => void; onRequestCreatePost: () => void;
  onRequestLogout: () => void; onOpenUserCenter: () => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');
  const { currentUserId, notifications } = useForum();
  const unread = useMemo(() => {
    if (!currentUserId) return 0;
    return notifications.filter(n => n.toUserId === currentUserId && !n.isRead).length;
  }, [currentUserId, notifications]);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 110]);
  const fade = useTransform(scrollY, [0, 380], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    const els = titleRef.current.querySelectorAll<HTMLElement>('.ch');
    gsap.fromTo(els,
      { y: 80, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.04, ease: 'power4.out', delay: 0.25 }
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[var(--c-bg)]">
      {/* BG */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }} aria-hidden>
        <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(197,168,130,0.10) 0%, transparent 70%)' }} />
        <div className="absolute -right-32 top-1/2 w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(160,157,153,0.07) 0%, transparent 70%)' }} />
        <div className="absolute left-1/3 -top-16 w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(197,168,130,0.07) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: 'linear-gradient(rgba(26,25,24,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(26,25,24,0.7) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </motion.div>

      {/* NAV */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav-scrolled py-3' : 'glass-nav py-4'}`}
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center gap-4">
          <motion.div className="flex items-center gap-2.5 mr-2 flex-shrink-0 cursor-pointer select-none"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--c-ink)' }}>
              <span className="text-[var(--c-bg)] text-xs font-bold tracking-wider">NX</span>
            </div>
            <span className="font-semibold text-base tracking-tight">GameCommunity</span>
          </motion.div>

          <div className={`hidden md:flex flex-1 max-w-xs relative transition-all duration-300 ${focus ? 'max-w-sm' : ''}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--c-ink-4)' }} />
            <input value={val} onChange={e => setVal(e.target.value)}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              placeholder="搜索游戏、帖子…"
              className="w-full pl-10 pr-4 py-2 rounded-full text-sm outline-none transition-all duration-300"
              style={{
                background: focus ? '#fff' : 'var(--c-surface-2)',
                border: `1px solid ${focus ? 'var(--c-ink)' : 'var(--c-border)'}`,
                color: 'var(--c-ink)', boxShadow: focus ? '0 0 0 3px rgba(26,25,24,0.06)' : 'none',
              }} />
          </div>

          <div className="flex-1" />
          <div className="flex items-center gap-1">
            {currentUserId && (
              <motion.button className="relative p-2 rounded-full" style={{ color: 'var(--c-ink-2)' }}
                whileHover={{ scale: 1.08, backgroundColor: 'var(--c-surface-2)' }}
                whileTap={{ scale: 0.93 }} onClick={onOpenUserCenter}>
                <Bell className="w-5 h-5" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--c-ink)' }} />}
              </motion.button>
            )}
            {currentUserId ? (
              <>
                <motion.button
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ml-1"
                  style={{ background: 'var(--c-ink)', color: 'var(--c-bg)' }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRequestCreatePost}>
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">发表帖子</span>
                </motion.button>
                <motion.button className="p-2 rounded-full" style={{ color: 'var(--c-ink-3)' }}
                  whileHover={{ scale: 1.08, backgroundColor: 'var(--c-surface-2)' }}
                  whileTap={{ scale: 0.93 }} onClick={onRequestLogout} title="退出登录">
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </>
            ) : (
              <motion.button
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium ml-1"
                style={{ background: 'var(--c-ink)', color: 'var(--c-bg)' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRequestLogin}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">登录 / 注册</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* HERO BODY */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ opacity: fade }}
      >
        <motion.div className="section-label mb-8"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}>
          <span className="inline-block w-5 h-px" style={{ background: 'var(--c-ink-3)' }} />
          {' '}游戏交流论坛{' '}
          <span className="inline-block w-5 h-px" style={{ background: 'var(--c-ink-3)' }} />
        </motion.div>

        <h1 ref={titleRef} className="flex gap-1 sm:gap-2 mb-6" style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(4.5rem,16vw,13rem)',
          lineHeight: 1, letterSpacing: '-0.04em', perspective: '600px',
        }}>
          {CHARS.map((ch, i) => (
            <span key={i} className="ch inline-block select-none" style={{ color: 'var(--c-ink)', opacity: 0 }}>{ch}</span>
          ))}
        </h1>

        <motion.p className="text-base sm:text-lg mb-12 max-w-md"
          style={{ color: 'var(--c-ink-3)', fontWeight: 300 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}>
          发现好游戏 · 分享真体验 · 遇见同好玩家
        </motion.p>

        <motion.div className="w-full max-w-xl mb-10"
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className={`relative flex items-center rounded-2xl overflow-hidden transition-all duration-300 ${
            focus ? 'shadow-[0_0_0_2px_var(--c-ink)] bg-white' : 'shadow-[0_4px_28px_-4px_rgba(26,25,24,0.13)] bg-white'
          }`}>
            <Search className="ml-5 w-5 h-5 flex-shrink-0" style={{ color: 'var(--c-ink-4)' }} />
            <input value={val} onChange={e => setVal(e.target.value)}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              placeholder="搜索你感兴趣的游戏…"
              className="flex-1 px-4 py-4 text-sm bg-transparent border-0 outline-none"
              style={{ color: 'var(--c-ink)' }} />
            <motion.button className="mr-2 rounded-xl px-5 py-2.5 text-sm font-medium flex-shrink-0"
              style={{ background: 'var(--c-ink)', color: 'var(--c-bg)' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>搜索</motion.button>
          </div>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}>
          <span className="text-xs mr-1" style={{ color: 'var(--c-ink-4)' }}>热搜：</span>
          {TAGS.map((tag, i) => (
            <motion.button key={tag} className="tag-badge cursor-pointer"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.07 }}
              whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.96 }}>
              {tag}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--c-ink-4)' }}>Scroll</span>
          <div className="w-5 h-8 rounded-full flex justify-center items-start pt-1.5"
            style={{ border: '1.5px solid var(--c-border)' }}>
            <motion.span className="w-1 h-1.5 rounded-full" style={{ background: 'var(--c-ink-3)' }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      </motion.div>

      {/* TICKER */}
      <div className="absolute bottom-0 left-0 right-0 py-2.5 overflow-hidden"
        style={{ borderTop: '1px solid var(--c-border)', background: 'rgba(249,248,247,0.82)', backdropFilter: 'blur(12px)' }}>
        <div className="flex anim-ticker whitespace-nowrap select-none" aria-hidden>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-5 text-xs" style={{ color: 'var(--c-ink-3)' }}>
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--c-accent)' }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
