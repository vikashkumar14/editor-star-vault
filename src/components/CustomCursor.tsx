import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;
    setEnabled(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    let raf = 0;
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousemove', onMove);
    document.documentElement.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999]"
        style={{ boxShadow: '0 0 12px hsl(var(--primary))' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary/60 pointer-events-none z-[9998] transition-[width,height,background-color,border-color] duration-200 ease-out"
        style={{
          transform: 'translate3d(-100px,-100px,0)',
          width: hovering ? '48px' : '32px',
          height: hovering ? '48px' : '32px',
          marginLeft: hovering ? '-8px' : '0',
          marginTop: hovering ? '-8px' : '0',
          backgroundColor: hovering ? 'hsl(var(--primary) / 0.15)' : 'transparent',
          backdropFilter: 'blur(2px)',
        }}
      />
    </>
  );
};

export default CustomCursor;
