import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HUDFrame } from '../components/HUDFrame';
import { GlitchText } from '../components/GlitchText';
import { Play } from 'lucide-react';

export default function Work() {
  const [projects, setProjects] = useState([]);

  // Placeholder projects - can be replaced with API data
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
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Add Project Note */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <HUDFrame className="inline-block p-6 bg-black/30 backdrop-blur-sm">
            <p className="text-[#FF4D00] font-mono text-sm tracking-wider">
              // PROJECTS ARRAY EDITABLE IN WORK.JS
            </p>
            <p className="text-white/40 font-mono text-xs mt-2">
              Replace placeholder data with your actual video projects
            </p>
          </HUDFrame>
        </motion.div>
      </div>
    </div>
  );
}

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="break-inside-avoid mb-6 relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HUDFrame className="overflow-hidden bg-black/50 backdrop-blur-sm">
        <div className="relative aspect-video overflow-hidden">
          {/* Thumbnail */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scanning effect */}
            <motion.div
              className="absolute inset-0 border-2 border-[#FF4D00]"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={
                isHovered
                  ? {
                      scale: 1,
                      opacity: [0, 1, 0],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="w-16 h-16 text-[#FF4D00] mb-4 mx-auto" strokeWidth={1.5} />
              </motion.div>
              <p className="text-[#FF4D00] font-mono text-sm tracking-widest animate-pulse">
                SCANNING...
              </p>
            </div>
          </motion.div>
        </div>

        {/* Info */}
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
    </motion.div>
  );
};
