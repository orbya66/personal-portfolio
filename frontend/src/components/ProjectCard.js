import React, { useState } from 'react';
import { Play } from 'lucide-react';

// Extract YouTube video ID from various URL formats
function getYouTubeThumb(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function ProjectCard({ project, index, onPlayClick }) {
  const [imageError, setImageError] = useState(false);

  const getAspectClass = () => {
    switch (project.aspectRatio) {
      case '9:16': case 'vertical': return 'aspect-[9/16]';
      case '1:1': case 'square': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '21:9': case 'ultrawide': return 'aspect-[21/9]';
      default: return 'aspect-video';
    }
  };

  // Use thumbnail, fallback to YouTube auto-thumbnail, then placeholder
  const thumbnailSrc = project.thumbnail || getYouTubeThumb(project.videoUrl) || null;

  const handleClick = () => {
    if (onPlayClick && project.videoUrl) {
      onPlayClick(project);
    }
  };

  return (
    <div
      className="break-inside-avoid mb-4 relative group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.1, 1)}s`, animationFillMode: 'forwards' }}
      data-testid={`project-card-${project.id}`}
    >
      <div 
        className="overflow-hidden bg-black/50 backdrop-blur-sm border border-[var(--primary)]/20 hover:border-[var(--primary)]/60 transition-all duration-300 cursor-pointer"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className={`relative ${getAspectClass()} overflow-hidden bg-black/80`}>
          {thumbnailSrc && !imageError ? (
            <img
              src={thumbnailSrc}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90">
              <Play className="w-12 h-12 text-[var(--primary)]/30" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[var(--primary)]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[var(--primary)]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[var(--primary)]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[var(--primary)]" />

            {project.videoUrl && (
              <div className="text-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-[var(--primary)]/20 backdrop-blur-sm flex items-center justify-center border border-[var(--primary)]">
                  <Play className="w-7 h-7 text-[var(--primary)] ml-0.5" fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          {project.year && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-[var(--primary)]/30 text-[var(--primary)] font-mono text-xs">
              {project.year}
            </div>
          )}
          {project.featured && (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--primary)] text-black font-mono text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 bg-black/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-['Rajdhani'] font-semibold text-base md:text-lg tracking-wide uppercase truncate">
                {project.title}
              </h3>
              <p className="text-[var(--primary)] font-mono text-xs tracking-widest mt-1">
                {project.category}
              </p>
            </div>
            <div className="text-[var(--primary)]/50 font-mono text-xs shrink-0">
              #{String(project.id).padStart(3, '0')}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-white/60 font-mono text-xs">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-0.5 text-white/40 font-mono text-xs">+{project.tags.length - 3}</span>
              )}
            </div>
          )}

          {project.description && (
            <p className="text-white/40 font-mono text-xs mt-2 line-clamp-2">{project.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
