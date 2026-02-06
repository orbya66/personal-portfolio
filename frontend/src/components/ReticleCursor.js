import React, { useEffect, useState } from 'react';

function ReticleCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Add to trail - now synced with cursor position
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { ...newPosition, id: Date.now() + Math.random() }];
        return newTrail.slice(-12); // Keep last 12 points
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
      {/* Motion Trail - Reduced glow */}
      {trail.map((point, index) => {
        const opacity = (index + 1) / trail.length;
        const scale = 0.4 + (index / trail.length) * 0.6;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.25,
            }}
          >
            {/* Triangular trail particles - less blur */}
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ filter: 'blur(1px)' }}>
              <polygon 
                points="20,8 32,28 8,28" 
                fill="#FF4D00" 
                opacity={opacity * 0.5}
              />
            </svg>
          </div>
        );
      })}

      {/* Mark 3 Arc Reactor Cursor - Reduced glow */}
      <div
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.4 : 1}) rotate(${isHovering ? 180 : 0}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 77, 0, 0.4))' }}>
          {/* Reduced glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="coreGradient">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFB366" />
              <stop offset="100%" stopColor="#FF4D00" />
            </radialGradient>
          </defs>
          
          {/* Outer triangular ring */}
          <polygon 
            points="50,15 80,70 20,70" 
            fill="none" 
            stroke="#FF4D00" 
            strokeWidth="2"
            opacity="0.6"
            className="animate-spin-slow"
            style={{ transformOrigin: '50px 50px' }}
          />
          
          {/* Middle triangular ring */}
          <polygon 
            points="50,25 70,62 30,62" 
            fill="none" 
            stroke="#FF4D00" 
            strokeWidth="2.5"
            opacity="0.8"
            filter="url(#glow)"
          />
          
          {/* Inner triangle details - the mechanical structure */}
          <g opacity="0.9">
            {/* Top vertex lines */}
            <line x1="50" y1="32" x2="50" y2="25" stroke="#FF4D00" strokeWidth="2" />
            
            {/* Side structural lines */}
            <line x1="38" y1="55" x2="32" y2="60" stroke="#FF4D00" strokeWidth="1.5" />
            <line x1="62" y1="55" x2="68" y2="60" stroke="#FF4D00" strokeWidth="1.5" />
            
            {/* Bottom structural line */}
            <line x1="35" y1="60" x2="65" y2="60" stroke="#FF4D00" strokeWidth="2" />
          </g>
          
          {/* Inner core triangle - glowing */}
          <polygon 
            points="50,35 62,55 38,55" 
            fill="url(#coreGradient)" 
            filter="url(#glow)"
            className="animate-arc-pulse"
          />
          
          {/* Center energy core */}
          <circle 
            cx="50" 
            cy="50" 
            r="6" 
            fill="#FFFFFF"
            className="animate-arc-pulse"
            filter="url(#glow)"
          />
          
          {/* Rotating energy particles */}
          <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
            <circle cx="50" cy="30" r="2" fill="#FF4D00" opacity="0.8" />
            <circle cx="65" cy="60" r="2" fill="#FF4D00" opacity="0.8" />
            <circle cx="35" cy="60" r="2" fill="#FF4D00" opacity="0.8" />
          </g>
          
          {/* Counter-rotating outer particles */}
          <g className="animate-spin-reverse" style={{ transformOrigin: '50px 50px' }}>
            <circle cx="50" cy="20" r="1.5" fill="#FFB366" opacity="0.6" />
            <circle cx="75" cy="65" r="1.5" fill="#FFB366" opacity="0.6" />
            <circle cx="25" cy="65" r="1.5" fill="#FFB366" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Ambient glow - Significantly reduced */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-[120px] h-[120px] rounded-full bg-[#FF4D00] opacity-5 blur-2xl" />
      </div>
    </>
  );
}

export default ReticleCursor;
