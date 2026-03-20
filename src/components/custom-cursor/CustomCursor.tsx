import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';

interface CursorState {
  isHovering: boolean;
  hoverType: 'default' | 'button' | 'image' | 'link';
}

export function CustomCursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    hoverType: 'default'
  });
  const [isVisible, setIsVisible] = useState(false);
  
  // 使用 Framer Motion 的弹簧动画实现平滑跟随
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // 检测是否为触摸设备
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // 检测可点击元素
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('clickable') ||
        target.classList.contains('img-hover-zoom');
      
      const isImage = 
        target.tagName === 'IMG' ||
        target.classList.contains('img-hover-zoom') ||
        target.closest('.img-hover-zoom');

      if (isClickable || isImage) {
        setCursorState({ isHovering: true, hoverType: isImage ? 'image' : 'button' });
      } else {
        setCursorState({ isHovering: false, hoverType: 'default' });
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  // 几何变形动画
  useEffect(() => {
    if (!cursorRef.current) return;
    
    const polygon = cursorRef.current.querySelector('polygon');
    if (!polygon) return;

    // 四边形顶点 (菱形)
    const quadrilateralPoints = "50,15 85,50 50,85 15,50";
    // 九边形顶点
    const nonagonPoints = "50,8 72,16 88,32 92,50 88,68 72,84 50,92 28,84 12,68 8,50 12,32 28,16";
    
    // 使用 GSAP 实现丝滑的变形动画
    if (cursorState.isHovering) {
      gsap.to(polygon, {
        attr: { points: nonagonPoints },
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      gsap.to(polygon, {
        attr: { points: quadrilateralPoints },
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [cursorState.isHovering]);

  // 触摸设备不显示自定义光标
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: cursorState.isHovering ? 1.3 : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
    >
      <svg
        ref={cursorRef}
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* 中心圆点 */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="transparent"
          stroke="white"
          strokeWidth="1.5"
        />
        
        {/* 变形几何图形 - 四边形/九边形 */}
        <polygon
          points="50,15 85,50 50,85 15,50"
          fill="transparent"
          stroke="white"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
          }}
        />
        
        {/* 连接线 - 从中心到顶点 */}
        <g stroke="white" strokeWidth="0.5" opacity="0.5">
          <line x1="50" y1="50" x2="50" y2="15" />
          <line x1="50" y1="50" x2="85" y2="50" />
          <line x1="50" y1="50" x2="50" y2="85" />
          <line x1="50" y1="50" x2="15" y2="50" />
        </g>
      </svg>
    </motion.div>
  );
}

export default CustomCursor;
