import React, { useEffect, useState, useRef, useCallback } from 'react';

function ReticleCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isOverIframe, setIsOverIframe] = useState(false);
  const animationFrameRef = useRef(null);

  // Detect if mouse is near/over an iframe or video embed
  const checkIframeProximity = useCallback((x, y) => {
    const iframes = document.querySelectorAll('iframe, video, embed, object');
    for (const el of iframes) {
      const rect = el.getBoundingClientRect();
      // Small padding so cursor hides slightly before reaching the iframe
      const pad = 5;
      if (
        x >= rect.left - pad && x <= rect.right + pad &&
        y >= rect.top - pad && y <= rect.bottom + pad
      ) {
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setIsOverIframe(checkIframeProximity(e.clientX, e.clientY));
      
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { 
          ...newPosition, 
          id: Date.now() + Math.random(),
          timestamp: Date.now()
        }];
        return newTrail.slice(-25);
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

    const fadeTrail = () => {
      setTrail(prevTrail => {
        const now = Date.now();
        return prevTrail.filter(point => now - point.timestamp < 800);
      });
      animationFrameRef.current = requestAnimationFrame(fadeTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    animationFrameRef.current = requestAnimationFrame(fadeTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [checkIframeProximity]);

  // Hide cursor when over iframes/videos
  if (isOverIframe) return null;

  // Calculate equilateral triangle vertices centered at (50, 50)
  // For an equilateral triangle with center at origin:
  // Vertices at angles 270° (top), 30° (bottom-right), 150° (bottom-left)
  const getTrianglePoints = (centerX, centerY, radius) => {
    const angles = [270, 30, 150]; // degrees
    return angles.map(angle => {
      const rad = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(rad);
      const y = centerY + radius * Math.sin(rad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <>
      {/* Motion Trail - Smooth fade based on age */}
      {trail.map((point, index) => {
        const age = Date.now() - point.timestamp;
        const maxAge = 800; // 800ms total lifetime
        const ageProgress = Math.min(age / maxAge, 1);
        
        // Base opacity from position in trail
        const positionOpacity = (index + 1) / trail.length;
        // Age-based opacity (fades over time)
        const ageOpacity = 1 - ageProgress;
        // Combined opacity
        const opacity = positionOpacity * ageOpacity * 0.6;
        
        const scale = 0.3 + (index / trail.length) * 0.7;
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              transition: 'opacity 0.1s ease-out',
            }}
          >
            {/* Circular trail particles */}
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: 'var(--primary, #FF4D00)',
                boxShadow: '0 0 10px var(--primary, #FF4D00)',
                filter: 'blur(0.5px)'
              }}
            />
          </div>
        );
      })}

      {/* Mark 3 Arc Reactor Cursor - Fixed alignment */}
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
          
          {/* Outer triangular ring - FIXED: Centered equilateral triangle */}
          <polygon 
            points={getTrianglePoints(50, 50, 38)}
            fill="none" 
            stroke="#FF4D00" 
            strokeWidth="2"
            opacity="0.6"
            style={{ 
              transformOrigin: '50px 50px',
              animation: 'cursor-spin 8s linear infinite'
            }}
          />
          
          {/* Middle triangular ring - FIXED: Centered */}
          <polygon 
            points={getTrianglePoints(50, 50, 28)}
            fill="none" 
            stroke="#FF4D00" 
            strokeWidth="2.5"
            opacity="0.8"
            filter="url(#glow)"
          />
          
          {/* Inner core triangle - FIXED: Centered */}
          <polygon 
            points={getTrianglePoints(50, 50, 18)}
            fill="url(#coreGradient)" 
            filter="url(#glow)"
            className="animate-arc-pulse"
          />
          
          {/* Center energy core - Perfectly centered */}
          <circle 
            cx="50" 
            cy="50" 
            r="6" 
            fill="#FFFFFF"
            className="animate-arc-pulse"
            filter="url(#glow)"
          />
          
          {/* Rotating energy particles - on outer ring */}
          <g style={{ 
            transformOrigin: '50px 50px',
            animation: 'cursor-spin 6s linear infinite'
          }}>
            <circle cx="50" cy="12" r="2" fill="#FF4D00" opacity="0.8" />
            <circle cx="83" cy="69" r="2" fill="#FF4D00" opacity="0.8" />
            <circle cx="17" cy="69" r="2" fill="#FF4D00" opacity="0.8" />
          </g>
          
          {/* Counter-rotating outer particles */}
          <g style={{ 
            transformOrigin: '50px 50px',
            animation: 'cursor-spin-reverse 10s linear infinite'
          }}>
            <circle cx="50" cy="8" r="1.5" fill="#FFB366" opacity="0.6" />
            <circle cx="86" cy="71" r="1.5" fill="#FFB366" opacity="0.6" />
            <circle cx="14" cy="71" r="1.5" fill="#FFB366" opacity="0.6" />
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
        <div 
          className="w-[100px] h-[100px] rounded-full opacity-10 blur-2xl" 
          style={{ backgroundColor: 'var(--primary, #FF4D00)' }}
        />
      </div>

      {/* CSS for cursor animations */}
      <style>{`
        @keyframes cursor-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cursor-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </>
  );
}

export default ReticleCursor;
