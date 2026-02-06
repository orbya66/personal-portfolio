import React, { useEffect, useState } from 'react';

function ReticleCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Add to trail
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { ...newPosition, id: Date.now() }];
        // Keep only last 15 trail points
        return newTrail.slice(-15);
      });
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
      {/* Motion Trail */}
      {trail.map((point, index) => {
        const opacity = (index + 1) / trail.length;
        const scale = 0.3 + (index / trail.length) * 0.7;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: point.x,
              top: point.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.3,
              transition: 'opacity 0.1s ease-out',
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[#FF4D00] blur-md" />
          </div>
        );
      })}

      {/* Arc Reactor Cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px) scale(${isHovering ? 1.3 : 1}) rotate(${isHovering ? 180 : 0}deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Arc Reactor Design */}
        <div className="relative w-10 h-10">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-[#FF4D00] opacity-20 blur-xl animate-pulse" />
          
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#FF4D00] opacity-60" />
          
          {/* Middle ring */}
          <div className="absolute inset-[6px] rounded-full border-2 border-[#FF4D00] opacity-80">
            {/* Diagonal lines */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#FF4D00] -rotate-45 origin-center" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#FF4D00] rotate-45 origin-center" />
            </div>
          </div>
          
          {/* Inner core - bright glowing center */}
          <div className="absolute inset-[10px] rounded-full bg-[#FF4D00] shadow-[0_0_15px_#FF4D00,0_0_30px_#FF4D00] animate-arc-pulse" />
          
          {/* Center dot */}
          <div className="absolute inset-[14px] rounded-full bg-white shadow-[0_0_10px_white]" />
          
          {/* Rotating energy rings */}
          <div className="absolute inset-[3px] rounded-full border border-[#FF4D00]/40 animate-spin-slow" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-[5px] rounded-full border border-[#FF4D00]/30 animate-spin-reverse" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Ambient glow that follows cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${mousePosition.x - 100}px, ${mousePosition.y - 100}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-[200px] h-[200px] rounded-full bg-[#FF4D00] opacity-5 blur-3xl" />
      </div>
    </>
  );
}

export default ReticleCursor;
