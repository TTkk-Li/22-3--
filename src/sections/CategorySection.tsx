import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  MessageSquare, 
  Trophy, 
  Users, 
  Sparkles, 
  Monitor,
  Smartphone,
  Cpu
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  postCount: number;
}

const categories: Category[] = [
  {
    id: '1',
    name: '热门游戏',
    description: '当下最火爆的游戏讨论',
    icon: Gamepad2,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 12580
  },
  {
    id: '2',
    name: '游戏杂谈',
    description: '畅所欲言的游戏话题',
    icon: MessageSquare,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 8932
  },
  {
    id: '3',
    name: '竞技排行',
    description: '实力比拼排行榜',
    icon: Trophy,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 5621
  },
  {
    id: '4',
    name: '玩家社区',
    description: '寻找志同道合的伙伴',
    icon: Users,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 10234
  },
  {
    id: '5',
    name: '新游推荐',
    description: '发现下一个好游戏',
    icon: Sparkles,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 3456
  },
  {
    id: '6',
    name: 'PC游戏',
    description: '端游玩家聚集地',
    icon: Monitor,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 7890
  },
  {
    id: '7',
    name: '手游专区',
    description: '移动端游戏讨论',
    icon: Smartphone,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 15678
  },
  {
    id: '8',
    name: '硬件外设',
    description: '游戏装备交流',
    icon: Cpu,
    color: 'from-gray-200/70 to-gray-100/20',
    postCount: 4321
  }
];

export function CategorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const cardElements = cards.querySelectorAll('.category-card');
    const triggers: ScrollTrigger[] = [];

    // 标题动画
    const titleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.category-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }
    });
    triggers.push(titleTrigger);

    // 卡片交错动画
    cardElements.forEach((card, index) => {
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(card,
            { y: 60, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.7, 
              delay: index * 0.08,
              ease: 'power3.out' 
            }
          );
        }
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#F9F8F7]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="category-title mb-16 text-center">
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-foreground/5 text-sm text-foreground/60 mb-4"
          >
            探索社区
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            板块分类
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            找到你感兴趣的话题，加入热烈的讨论
          </p>
        </div>

        {/* 分类卡片网格 */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                className="category-card group relative p-6 rounded-2xl bg-white border border-gray-100 overflow-hidden cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* 内容 */}
                <div className="relative z-10">
                  {/* 图标 */}
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-white/80 group-hover:shadow-lg transition-all duration-300">
                    <Icon className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </div>
                  
                  {/* 文字 */}
                  <h3 className="text-lg font-semibold mb-1 group-hover:translate-x-1 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {category.description}
                  </p>
                  
                  {/* 帖子数 */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <span>{category.postCount.toLocaleString()} 帖子</span>
                  </div>
                </div>

                {/* 悬停箭头 */}
                <motion.div 
                  className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
