import React, { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import SkillBar from '../components/SkillBar';
import { Download } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/skills`);
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Split skills into software and creative categories
  const softwareSkills = skills.filter(s => s.category === 'software');
  const creativeSkills = skills.filter(s => s.category === 'creative');

  const handleDownloadResume = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/resume/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ORBYA_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      window.open(`${process.env.REACT_APP_BACKEND_URL}/api/resume/download`, '_blank');
    }
  };

  return (
    <div className="min-h-screen pt-16 grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
              DIAGNOSTIC_MODE: ACTIVE
            </span>
          </div>
          <h1 className="font-['Rajdhani'] text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white mb-4">
            <GlitchText text="TECHNICAL SPECS" />
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl mx-auto">
            Core competencies and system capabilities analysis
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#FF4D00] font-mono text-sm mt-4 animate-pulse">LOADING SKILLS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-mono text-sm">ERROR: {error}</p>
            <p className="text-white/40 font-mono text-xs mt-2">Check console for details</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#FF4D00] font-mono text-sm">NO SKILLS FOUND</p>
            <p className="text-white/40 font-mono text-xs mt-2">Add skills to /app/backend/data/skills.json</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                <div className="hud-frame p-8 bg-black/50 backdrop-blur-sm h-full">
                  <div className="hud-content">
                    <div className="mb-6">
                      <h2 className="text-[#FF4D00] font-['Rajdhani'] text-2xl font-bold tracking-wide uppercase mb-2">
                        Software Mastery
                      </h2>
                      <div className="h-[1px] w-full bg-gradient-to-r from-[#FF4D00] to-transparent" />
                    </div>
                    
                    <div className="space-y-6">
                      {softwareSkills.map((skill, index) => (
                        <div key={skill.id}>
                          <SkillBar
                            skill={skill.name}
                            level={skill.level}
                            index={index}
                          />
                          <p className="text-white/40 font-mono text-xs ml-1">
                            {skill.module}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <div className="hud-frame p-8 bg-black/50 backdrop-blur-sm h-full">
                  <div className="hud-content">
                    <div className="mb-6">
                      <h2 className="text-[#FF4D00] font-['Rajdhani'] text-2xl font-bold tracking-wide uppercase mb-2">
                        Creative Systems
                      </h2>
                      <div className="h-[1px] w-full bg-gradient-to-r from-[#FF4D00] to-transparent" />
                    </div>
                    
                    <div className="space-y-6">
                      {creativeSkills.map((skill, index) => (
                        <div key={skill.id}>
                          <SkillBar
                            skill={skill.name}
                            level={skill.level}
                            index={index + softwareSkills.length}
                          />
                          <p className="text-white/40 font-mono text-xs ml-1">
                            {skill.module}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              {[
                { label: 'Projects', value: '150+', unit: 'COMPLETED' },
                { label: 'Experience', value: '5+', unit: 'YEARS' },
                { label: 'Clients', value: '80+', unit: 'SATISFIED' },
                { label: 'Hours', value: '10K+', unit: 'EDITED' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="hud-frame p-6 bg-black/50 backdrop-blur-sm text-center">
                    <div className="hud-content">
                      <p className="text-4xl font-['Rajdhani'] font-bold text-[#FF4D00] mb-2">
                        {stat.value}
                      </p>
                      <p className="text-white font-['Rajdhani'] text-sm tracking-wide uppercase mb-1">
                        {stat.label}
                      </p>
                      <p className="text-white/40 font-mono text-xs tracking-widest">
                        {stat.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <button
            onClick={handleDownloadResume}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black/50 backdrop-blur-sm border-2 border-[#FF4D00] text-[#FF4D00] font-['Rajdhani'] font-bold text-lg tracking-wider uppercase hover:bg-[#FF4D00] hover:text-black transition-all duration-300"
            data-testid="download-resume-btn"
          >
            <Download className="w-5 h-5" strokeWidth={2} />
            <span>Download Resume</span>
            
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF4D00]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF4D00]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF4D00]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF4D00]" />
          </button>
          
          <p className="mt-4 text-white/40 font-mono text-xs">
            PDF_FILE_SIZE: 2.4MB | LAST_UPDATE: 2025
          </p>
        </div>
      </div>
    </div>
  );
}
