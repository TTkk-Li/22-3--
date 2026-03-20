import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CustomCursor } from './components/custom-cursor/CustomCursor';
import { HeroSection } from './sections/HeroSection';
import { CategorySection } from './sections/CategorySection';
import { FeaturedPostsSection } from './sections/FeaturedPostsSection';
import { DailyPostsSection } from './sections/DailyPostsSection';
import { FooterSection } from './sections/FooterSection';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // 初始化 Lenis 平滑滚动
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // 将 Lenis 与 GSAP ScrollTrigger 集成
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 清理函数
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F9F8F7]">
      {/* 自定义鼠标指针 */}
      <CustomCursor />
      
      {/* 主内容 */}
      <main className="relative">
        {/* Hero 区域 */}
        <HeroSection />
        
        {/* 板块分类 */}
        <CategorySection />
        
        {/* 精选帖子 */}
        <FeaturedPostsSection />
        
        {/* 每日帖子 */}
        <DailyPostsSection />
        
        {/* 页脚 */}
        <FooterSection />
      </main>
    </div>
  );
}

export default App;
