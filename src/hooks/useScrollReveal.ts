import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      y = 40,
      opacity = 0,
      duration = 0.8,
      delay = 0,
      stagger = 0.1,
      ease = 'power3.out',
      start = 'top 85%',
    } = options;

    // 设置初始状态
    const children = element.querySelectorAll('.reveal-item');
    const targets = children.length > 0 ? children : [element];

    gsap.set(targets, { y, opacity });

    // 创建滚动触发动画
    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease,
        });
      },
    });

    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, [options]);

  return ref;
}

export default useScrollReveal;
