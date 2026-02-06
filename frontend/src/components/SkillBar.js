import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SkillBar = ({ skill, level, index }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedLevel(level);
    }, index * 150);
    
    return () => clearTimeout(timeout);
  }, [level, index]);

  const segments = 10;
  const filledSegments = Math.floor((animatedLevel / 100) * segments);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[#FF4D00] font-mono text-sm tracking-widest uppercase">
          {skill}
        </span>
        <span className="text-white font-mono text-xs">
          {animatedLevel}%
        </span>
      </div>
      
      <div className="flex gap-1">
        {[...Array(segments)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 flex-1 ${
              i < filledSegments
                ? 'bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.5)]'
                : 'bg-[#1A1A1A] border border-[#FF4D00]/20'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: index * 0.1 + i * 0.05,
              duration: 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};
