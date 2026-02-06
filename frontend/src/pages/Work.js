import React, { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import ProjectCard from '../components/ProjectCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#FF4D00] font-mono text-sm mt-4 animate-pulse">LOADING PROJECTS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-mono text-sm">ERROR: {error}</p>
            <p className="text-white/40 font-mono text-xs mt-2">Check console for details</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#FF4D00] font-mono text-sm">NO PROJECTS FOUND</p>
            <p className="text-white/40 font-mono text-xs mt-2">Add projects to /app/backend/data/projects.json</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="hud-frame inline-block p-6 bg-black/30 backdrop-blur-sm">
            <div className="hud-content">
              <p className="text-[#FF4D00] font-mono text-sm tracking-wider">
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
