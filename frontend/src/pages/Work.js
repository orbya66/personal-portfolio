import React, { useState, useEffect } from 'react';
import HUDFrame from '../components/HUDFrame';
import GlitchText from '../components/GlitchText';
import { Play } from 'lucide-react';

export default function Work() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const placeholderProjects = [
      {
        id: 1,
        title: 'Project Alpha',
        category: 'Motion Graphics',
        thumbnail: 'https://images.unsplash.com/photo-1706705556261-c02146118d58?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
      {
        id: 2,
        title: 'Project Beta',
        category: 'VFX Compositing',
        thumbnail: 'https://images.unsplash.com/photo-1663153204614-6dfc8feebbf9?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/movie.mp4',
      },
      {
        id: 3,
        title: 'Project Gamma',
        category: 'Color Grading',
        thumbnail: 'https://images.unsplash.com/photo-1629981892096-76ee7793ba0b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
      {
        id: 4,
        title: 'Project Delta',
        category: 'Short Film',
        thumbnail: 'https://images.unsplash.com/photo-1706705556261-c02146118d58?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/movie.mp4',
      },
      {
        id: 5,
        title: 'Project Epsilon',
        category: 'Commercial',
        thumbnail: 'https://images.unsplash.com/photo-1663153204614-6dfc8feebbf9?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
      {
        id: 6,
        title: 'Project Zeta',
        category: 'Music Video',
        thumbnail: 'https://images.unsplash.com/photo-1629981892096-76ee7793ba0b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
        video: 'https://www.w3schools.com/html/movie.mp4',
      },
    ];
    setProjects(placeholderProjects);
  }, []);

  return (
    <div className="min-h-screen pt-16 grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
              ARCHIVE_ACCESS: GRANTED
            </span>
          </div>
          <h1 className="font-['Rajdhani'] text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white mb-4">
            <GlitchText text="THE VAULT" />
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl mx-auto">
            A curated collection of cinematic projects, visual effects, and motion design work
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <HUDFrame className="inline-block p-6 bg-black/30 backdrop-blur-sm">
            <p className="text-[#FF4D00] font-mono text-sm tracking-wider">
              // PROJECTS ARRAY EDITABLE IN WORK.JS
            </p>
            <p className="text-white/40 font-mono text-xs mt-2">
              Replace placeholder data with your actual video projects
            </p>
          </HUDFrame>
        </div>
      </div>
    </div>
  );
}

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-6 relative group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HUDFrame className="overflow-hidden bg-black/50 backdrop-blur-sm">
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
      </HUDFrame>
    </div>
  );
};
