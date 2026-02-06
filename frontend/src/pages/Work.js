import React, { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import ProjectCard from '../components/ProjectCard';
import { Film, Archive, Layers, Grid3X3 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter projects
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-16 grid-pattern relative">
      {/* Decorative corner brackets */}
      <div className="fixed top-20 left-4 w-16 h-16 border-l-2 border-t-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed top-20 right-4 w-16 h-16 border-r-2 border-t-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#FF4D00]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="hidden sm:block w-12 h-[1px] bg-gradient-to-r from-transparent to-[#FF4D00]/50" />
            <span className="inline-block px-4 py-1 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
              ARCHIVE_ACCESS: GRANTED
            </span>
            <div className="hidden sm:block w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FF4D00]/50" />
          </div>
          <h1 className="font-['Rajdhani'] text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white mb-4">
            <GlitchText text="THE VAULT" />
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl mx-auto">
            A curated collection of cinematic projects, visual effects, and motion design work
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 flex flex-wrap justify-center gap-4 md:gap-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Film className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">{projects.length} PROJECTS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Archive className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">{categories.length - 1} CATEGORIES</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Layers className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">2020-2025</span>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                    : 'bg-black/30 text-white/60 border-[#FF4D00]/30 hover:border-[#FF4D00] hover:text-[#FF4D00]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#FF4D00] font-mono text-sm mt-4 animate-pulse">LOADING PROJECTS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-mono text-sm">ERROR: {error}</p>
            <p className="text-white/40 font-mono text-xs mt-2">Check console for details</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Grid3X3 className="w-16 h-16 text-[#FF4D00]/30 mx-auto mb-4" strokeWidth={1} />
            <p className="text-[#FF4D00] font-mono text-sm">NO PROJECTS FOUND</p>
            <p className="text-white/40 font-mono text-xs mt-2">Add projects to /app/backend/data/projects.json</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="hud-frame inline-block p-4 md:p-6 bg-black/30 backdrop-blur-sm">
            <div className="hud-content">
              <p className="text-[#FF4D00] font-mono text-xs md:text-sm tracking-wider">
                // ADD PROJECTS TO: /app/backend/data/projects.json
              </p>
              <p className="text-white/40 font-mono text-xs mt-2">
                Or use API: POST {BACKEND_URL}/api/projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
