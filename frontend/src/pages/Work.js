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

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="hud-frame inline-block p-6 bg-black/30 backdrop-blur-sm">
            <div className="hud-content">
              <p className="text-[#FF4D00] font-mono text-sm tracking-wider">
                // PROJECTS ARRAY EDITABLE IN WORK.JS
              </p>
              <p className="text-white/40 font-mono text-xs mt-2">
                Replace placeholder data with your actual video projects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
