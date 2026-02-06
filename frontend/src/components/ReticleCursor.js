import React, { useEffect, useState } from 'react';

function ReticleCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.closest('button') ||
        e.target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 pointer-events-none z-[10000] transition-all duration-200 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px) scale(${isHovering ? 1.5 : 1}) rotate(${isHovering ? 45 : 0}deg)`,
        }}
      >
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border border-[#FF4D00] rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF4D00]" />
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-[#FF4D00]" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF4D00]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF4D00]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF4D00]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF4D00]" />
        </div>
      </div>

      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 75}px, ${mousePosition.y - 75}px)`,
        }}
      >
        <div className="w-[150px] h-[150px] rounded-full bg-[#FF4D00] opacity-10 blur-3xl" />
      </div>
    </>
  );
}

export default ReticleCursor;
