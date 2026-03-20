import { useEffect, useMemo, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HeroSection } from './sections/HeroSection';
import { CategorySection } from './sections/CategorySection';
import { FeaturedPostsSection } from './sections/FeaturedPostsSection';
import { DailyPostsSection } from './sections/DailyPostsSection';
import { FooterSection } from './sections/FooterSection';
import { ForumProvider, useForum } from './forum/ForumProvider';
import { AuthDialog } from './forum/AuthDialog';
import { CreatePostDialog } from './forum/CreatePostDialog';
import { PostDetailDialog } from './forum/PostDetailDialog';
import { CategoryBoard } from './forum/CategoryBoard';
import { UserCenterDialog } from './forum/UserCenterDialog';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function AppInner() {
  const { currentUserId, actions } = useForum();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [postDialogId, setPostDialogId] = useState<string | null>(null);
  const [userCenterOpen, setUserCenterOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

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

  const handleRequestCreatePost = () => {
    if (!currentUserId) {
      setAuthOpen(true);
      return;
    }
    setCreateOpen(true);
  };

  const handleRequestLogout = () => {
    actions.logout();
    setCreateOpen(false);
    setPostDialogId(null);
    setActiveCategoryId(null);
  };

  const isCategoryMode = Boolean(activeCategoryId);

  const onOpenPost = (postId: string) => setPostDialogId(postId);

  return (
    <div className="relative min-h-screen bg-[#F9F8F7]">
      {/* 主内容 */}
      <main className="relative">
        {/* Hero 区域 */}
        <HeroSection
          onRequestLogin={() => setAuthOpen(true)}
          onRequestCreatePost={handleRequestCreatePost}
          onRequestLogout={handleRequestLogout}
          onOpenUserCenter={() => setUserCenterOpen(true)}
        />

        {!isCategoryMode ? (
          <>
            {/* 板块分类 */}
            <CategorySection onSelectCategory={(id) => setActiveCategoryId(id)} />

            {/* 精选帖子 */}
            <FeaturedPostsSection onOpenPost={onOpenPost} />

            {/* 每日帖子 */}
            <DailyPostsSection onOpenPost={onOpenPost} />
          </>
        ) : (
          <CategoryBoard
            categoryId={activeCategoryId!}
            onBack={() => setActiveCategoryId(null)}
            onOpenPost={onOpenPost}
            onRequestLogin={() => setAuthOpen(true)}
            onRequestCreatePost={handleRequestCreatePost}
          />
        )}
        
        {/* 页脚 */}
        <FooterSection />
      </main>

      {/* 登录/注册 */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      {/* 发表帖子 */}
      <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* 帖子详情（评论/回复） */}
      <PostDetailDialog
        open={Boolean(postDialogId)}
        onOpenChange={(v) => {
          if (!v) setPostDialogId(null);
        }}
        postId={postDialogId}
        onRequestLogin={() => setAuthOpen(true)}
      />

      {/* 用户主页/消息 */}
      <UserCenterDialog
        open={userCenterOpen}
        onOpenChange={setUserCenterOpen}
        onRequestLogin={() => setAuthOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ForumProvider>
      <AppInner />
    </ForumProvider>
  );
}
