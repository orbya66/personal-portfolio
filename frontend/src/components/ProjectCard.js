import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';

function ProjectCard({ project, index, onPlayClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Determine aspect ratio
  const getAspectClass = () => {
    switch (project.aspectRatio) {
      case '9:16': case 'vertical': return 'aspect-[9/16]';
      case '1:1': case 'square': return 'aspect-square';
      case '4:3': return 'aspect-[4/3]';
      case '21:9': case 'ultrawide': return 'aspect-[21/9]';
      default: return 'aspect-video';
    }
  };

  // Check if it's a direct video file
  const isDirectVideo = (url) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || 
           url.includes('/static/uploads/videos/') ||
           url.includes('/uploads/videos/');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isDirectVideo(project.videoUrl)) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setVideoPlaying(true);
      }).catch((e) => {
        console.log('Video autoplay prevented:', e);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (onPlayClick && project.videoUrl) {
      onPlayClick(project);
    }
  };

  return (
    <div
      className="break-inside-avoid mb-4 relative group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.1, 1)}s`, animationFillMode: 'forwards' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`project-card-${project.id}`}
    >
      <div className="overflow-hidden bg-black/50 backdrop-blur-sm border border-[#FF4D00]/20 hover:border-[#FF4D00]/50 transition-colors">
        {/* Image/Video Container */}
        <div className={`relative ${getAspectClass()} overflow-hidden bg-black/80`}>
          {/* Loading spinner */}
          {!imageLoaded && !videoPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Thumbnail */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${videoPlaying ? 'opacity-0' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Video Preview (for direct videos) */}
          {isDirectVideo(project.videoUrl) && (
            <video
              ref={videoRef}
              src={project.videoUrl}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                videoPlaying ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}

          {/* Hover overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex items-center justify-center transition-opacity duration-300 cursor-pointer ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClick}
          >
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF4D00]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF4D00]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF4D00]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF4D00]" />

            {project.videoUrl && (
              <div className={`text-center transition-transform duration-300 ${isHovered ? 'scale-100' : 'scale-0'}`}>
                <div className="w-16 h-16 rounded-full bg-[#FF4D00]/20 backdrop-blur-sm flex items-center justify-center border-2 border-[#FF4D00] hover:bg-[#FF4D00]/40 transition-colors">
                  <Play className="w-8 h-8 text-[#FF4D00] ml-1" fill="#FF4D00" />
                </div>
                <p className="text-[#FF4D00] font-mono text-xs tracking-widest mt-3">
                  {videoPlaying ? 'CLICK_TO_EXPAND' : 'PLAY_VIDEO'}
                </p>
              </div>
            )}
          </div>

          {/* Year badge */}
          {project.year && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-[#FF4D00]/30 text-[#FF4D00] font-mono text-xs">
              {project.year}
            </div>
          )}

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-[#FF4D00] text-black font-mono text-xs font-bold">
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
              <p className="text-[#FF4D00] font-mono text-xs tracking-widest mt-1">
                {project.category}
              </p>
            </div>
            <div className="text-[#FF4D00]/50 font-mono text-xs shrink-0">
              #{String(project.id).padStart(3, '0')}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-white/60 font-mono text-xs">
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
