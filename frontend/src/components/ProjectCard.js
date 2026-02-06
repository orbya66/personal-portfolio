import React, { useState } from 'react';
import { Play } from 'lucide-react';

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-6 relative group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hud-frame overflow-hidden bg-black/50 backdrop-blur-sm">
        <div className="hud-content">
          <div className="relative aspect-video overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute inset-0 border-2 border-[#FF4D00] ${isHovered ? 'animate-pulse' : ''}`} />

            <div className="relative z-10 text-center">
              <div className={`transition-transform duration-300 ${isHovered ? 'scale-100' : 'scale-0'}`}>
                <Play className="w-16 h-16 text-[#FF4D00] mb-4 mx-auto" strokeWidth={1.5} />
              </div>
              <p className="text-[#FF4D00] font-mono text-sm tracking-widest animate-pulse">
                SCANNING...
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-['Rajdhani'] font-semibold text-lg tracking-wide uppercase">
                {project.title}
              </h3>
              <p className="text-[#FF4D00] font-mono text-xs tracking-widest mt-1">
                {project.category}
              </p>
            </div>
            <div className="text-[#FF4D00] font-mono text-xs">
              #{String(project.id).padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
