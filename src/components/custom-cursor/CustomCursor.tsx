import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';

type Point = { x: number; y: number };

export function CustomCursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Framer Motion 弹簧跟随
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // 五个点用于 morph：默认态“看起来是四边形”（最后一个点与第一个点重合）
  const quad: Point[] = [
    { x: 50, y: 12 }, // top tip
    { x: 84, y: 34 }, // right upper
    { x: 84, y: 92 }, // right bottom
    { x: 16, y: 92 }, // left bottom
    { x: 50, y: 12 }, // same as top tip => 视觉上四条边
  ];

  // hover 态五边形：上尖下宽 + 增加一个边缘顶点
  const pent: Point[] = [
    { x: 50, y: 10 },
    { x: 86, y: 28 },
    { x: 78, y: 92 },
    { x: 22, y: 92 },
    { x: 14, y: 28 },
  ];

  const toPoints = (points: Point[]) =>
    points.map((p) => `${p.x},${p.y}`).join(' ');

  useEffect(() => {
    // 触摸设备不显示自定义光标
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) {
        setIsHovering(false);
        return;
      }

      // 按钮/链接/表单是“可点击”，带 img-hover-zoom 的图片是“可悬停图片”
      const isClickable =
        Boolean(
          el.closest('button, a, [role="button"], input, textarea, select, label, [data-cursor-hover="true"]')
        );
      const isHoverImage = Boolean(el.closest('.img-hover-zoom'));

      setIsHovering(isClickable || isHoverImage);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  // 几何变形：四边形(quad) <-> 五边形(pent)
  useEffect(() => {
    if (!cursorRef.current) return;

    const polygon = cursorRef.current.querySelector('polygon');
    if (!polygon) return;

    const lines = Array.from(cursorRef.current.querySelectorAll('g[data-lines="cursor"] line'));

    const nextPoints = isHovering ? toPoints(pent) : toPoints(quad);
    const nextVerts = isHovering ? pent : quad;

    gsap.to(polygon, {
      attr: { points: nextPoints },
      duration: 0.35,
      ease: 'power2.out',
    });

    // 同步变形连接线端点（保证“线+几何体”一致）
    lines.slice(0, 5).forEach((line, i) => {
      gsap.to(line, {
        attr: { x2: nextVerts[i]?.x ?? 50, y2: nextVerts[i]?.y ?? 50 },
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  }, [isHovering]);

  if (window.matchMedia('(pointer: coarse)').matches) return null;

  const initialQuadPoints = toPoints(quad);
  const initialVerts = quad;

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
        scale: isHovering ? 1.25 : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <svg
        ref={cursorRef}
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 中心圆点：白色空心圆点 */}
        <circle cx="50" cy="50" r="4" fill="transparent" stroke="white" strokeWidth="1.5" />

        {/* 几何指针轮廓（points 由 GSAP 在 hover 时 morph） */}
        <polygon
          points={initialQuadPoints}
          fill="transparent"
          stroke="white"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 连接线：从中心连接到每个顶点（同时 morph） */}
        <g data-lines="cursor" stroke="white" strokeWidth="0.5" opacity="0.5">
          {initialVerts.slice(0, 5).map((p, i) => (
            <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

export default CustomCursor;
