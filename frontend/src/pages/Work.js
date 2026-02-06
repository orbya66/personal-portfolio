import React, { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import ProjectCard from '../components/ProjectCard';
import { Film, Archive, Layers, Grid3X3, X, ExternalLink, LayoutGrid, List } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Video Modal Component
function VideoModal({ project, onClose }) {
  if (!project) return null;

  // Detect video type (YouTube, Vimeo, or direct URL)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    // Direct video URL
    return url;
  };

  const embedUrl = getEmbedUrl(project.videoUrl);
  const isEmbed = embedUrl?.includes('youtube') || embedUrl?.includes('vimeo');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-[#FF4D00] transition-colors"
          data-testid="video-modal-close"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video Container */}
        <div className="hud-frame bg-black overflow-hidden">
          <div className="hud-content">
            <div className="aspect-video bg-black">
              {isEmbed ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              ) : (
                <video
                  src={embedUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                  poster={project.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6 bg-black/80 border-t border-[#FF4D00]/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-['Rajdhani'] text-2xl font-bold tracking-wide uppercase">
                    {project.title}
                  </h3>
                  <p className="text-[#FF4D00] font-mono text-sm tracking-widest mt-1">
                    {project.category} {project.year && `• ${project.year}`}
                  </p>
                  {project.description && (
                    <p className="text-white/60 font-mono text-sm mt-3 max-w-2xl">
                      {project.description}
                    </p>
                  )}
                </div>
                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 border border-[#FF4D00]/30 hover:border-[#FF4D00] text-[#FF4D00] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'grid'
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Get unique categories dynamically
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter projects
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  // Get years range
  const years = projects.map(p => p.year).filter(Boolean);
  const yearRange = years.length > 0 
    ? `${Math.min(...years)}-${Math.max(...years)}` 
    : 'N/A';

  const handlePlayClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen pt-16 grid-pattern relative">
      {/* Video Modal */}
      {selectedProject && (
        <VideoModal project={selectedProject} onClose={handleCloseModal} />
      )}

      {/* Decorative corner brackets */}
      <div className="fixed top-20 left-4 w-16 h-16 border-l-2 border-t-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed top-20 right-4 w-16 h-16 border-r-2 border-t-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#FF4D00]/20 pointer-events-none" />
      <div className="fixed bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#FF4D00]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
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
        <div className="mb-6 flex flex-wrap justify-center gap-3 md:gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Film className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">{projects.length} PROJECTS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Archive className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">{categories.length - 1} CATEGORIES</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-[#FF4D00]/20">
            <Layers className="w-4 h-4 text-[#FF4D00]" strokeWidth={1.5} />
            <span className="text-white/60 font-mono text-xs">{yearRange}</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                    : 'bg-black/30 text-white/60 border-[#FF4D00]/30 hover:border-[#FF4D00] hover:text-[#FF4D00]'
                }`}
                data-testid={`filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 border transition-all ${
                viewMode === 'masonry'
                  ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                  : 'bg-black/30 text-white/60 border-[#FF4D00]/30 hover:border-[#FF4D00]'
              }`}
              title="Masonry View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                  : 'bg-black/30 text-white/60 border-[#FF4D00]/30 hover:border-[#FF4D00]'
              }`}
              title="Grid View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Display */}
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
            <p className="text-white/40 font-mono text-xs mt-2">
              {filter !== 'all' ? 'Try a different category filter' : 'Add projects via API: POST /api/projects'}
            </p>
          </div>
        ) : viewMode === 'masonry' ? (
          // Masonry Layout - Auto-adjusts for different aspect ratios
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                onPlayClick={handlePlayClick}
              />
            ))}
          </div>
        ) : (
          // Uniform Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onPlayClick={handlePlayClick}
              />
            ))}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-10 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="hud-frame inline-block p-4 md:p-6 bg-black/30 backdrop-blur-sm">
            <div className="hud-content">
              <p className="text-[#FF4D00] font-mono text-xs md:text-sm tracking-wider">
                // ADD PROJECTS VIA API: POST /api/projects
              </p>
              <p className="text-white/40 font-mono text-xs mt-2">
                Supports: YouTube, Vimeo, or direct video URLs • Aspect ratios: 16:9, 9:16, 1:1, 4:3, 21:9
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
