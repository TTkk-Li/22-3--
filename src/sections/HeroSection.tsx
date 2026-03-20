import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Menu, Bell, User } from 'lucide-react';
import gsap from 'gsap';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 标题入场动画
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }
  }, []);

  const titleText = "GameHub";

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#F9F8F7]"
    >
      {/* 背景装饰 */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* 渐变圆环装饰 */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-gray-200/50 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-bl from-gray-200/50 to-transparent blur-3xl" />
        
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </motion.div>

      {/* 导航栏 */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-3 backdrop-blur-xl bg-white/70 border-b border-gray-200/40' 
            : 'py-5 backdrop-blur-xl bg-white/35 border-b border-gray-200/20'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">GameHub</span>
          </motion.div>

          {/* 搜索栏 */}
          <div className={`hidden md:flex items-center flex-1 max-w-md mx-8 transition-all duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-85'
          }`}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索游戏、帖子、玩家..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/55 border border-gray-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
              />
            </div>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center gap-3">
            <motion.button 
              className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium transition-colors hover:bg-foreground/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">登录</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero 内容 */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
        style={{ opacity }}
      >
        {/* 主标题 */}
        <div className="text-center mb-8">
          <h1 
            ref={titleRef}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter overflow-hidden"
          >
            {titleText.split('').map((char, index) => (
              <span key={index} className="char inline-block">
                {char}
              </span>
            ))}
          </h1>
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-500 font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            发现好游戏，分享真快乐
          </motion.p>
        </div>

        {/* 搜索框 */}
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <Search className="ml-5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索你感兴趣的游戏..."
                className="flex-1 px-4 py-4 text-base bg-transparent border-0 focus:outline-none placeholder:text-gray-400"
              />
              <motion.button 
                className="mr-2 px-6 py-2.5 rounded-full bg-foreground text-white text-sm font-medium transition-colors hover:bg-foreground/90"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                搜索
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 热门标签 */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {['原神', '王者荣耀', '和平精英', '明日方舟', '崩坏：星穹铁道'].map((tag, index) => (
            <motion.span
              key={tag}
              className="px-4 py-1.5 rounded-full bg-white/80 border border-gray-200 text-sm text-gray-600 hover:bg-white hover:border-gray-300 transition-all cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* 滚动提示 */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-2 rounded-full bg-gray-400"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
