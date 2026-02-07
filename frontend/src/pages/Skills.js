import React, { useState, useEffect } from 'react';
import GlitchText from '../components/GlitchText';
import SkillBar from '../components/SkillBar';
import { Download, Cpu, Sparkles, Award, Clock, Wrench, Palette, Zap, Code } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Map category names to icons
const categoryIcons = {
  software: Cpu,
  creative: Sparkles,
  tools: Wrench,
  design: Palette,
  development: Code,
  default: Zap
};

// Map category names to display titles
const categoryTitles = {
  software: 'Software Mastery',
  creative: 'Creative Systems',
  tools: 'Tools & Equipment',
  design: 'Design Suite',
  development: 'Development Stack',
  default: 'Other Skills'
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);

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

    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        // Stats are optional, use defaults if not available
        console.log('Stats not available, using defaults');
      }
    };

    fetchSkills();
    fetchStats();
  }, []);

  // Dynamically group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Get categories and determine grid layout
  const categories = Object.keys(groupedSkills);
  const gridCols = categories.length === 1 
    ? 'lg:grid-cols-1 max-w-2xl' 
    : categories.length === 2 
    ? 'lg:grid-cols-2' 
    : categories.length === 3 
    ? 'lg:grid-cols-3' 
    : 'lg:grid-cols-2';

  const handleDownloadResume = async () => {
    try {
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
      window.open(`${BACKEND_URL}/api/resume/download`, '_blank');
    }
  };

  // Default stats if not loaded from API
  const defaultStats = [
    { label: 'Projects', value: '150+', unit: 'COMPLETED', icon: Award },
    { label: 'Experience', value: '5+', unit: 'YEARS', icon: Clock },
    { label: 'Clients', value: '80+', unit: 'SATISFIED', icon: Award },
    { label: 'Hours', value: '10K+', unit: 'EDITED', icon: Clock },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

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
              DIAGNOSTIC_MODE: ACTIVE
            </span>
            <div className="hidden sm:block w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FF4D00]/50" />
          </div>
          <h1 className="font-['Rajdhani'] text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white mb-4">
            <GlitchText text="TECHNICAL SPECS" />
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl mx-auto">
            Core competencies and system capabilities analysis • {skills.length} skills loaded
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#FF4D00] font-mono text-sm mt-4 animate-pulse">LOADING SKILLS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-mono text-sm">ERROR: {error}</p>
            <p className="text-white/40 font-mono text-xs mt-2">Check console for details</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16">
            <Cpu className="w-16 h-16 text-[#FF4D00]/30 mx-auto mb-4" strokeWidth={1} />
            <p className="text-[#FF4D00] font-mono text-sm">NO SKILLS FOUND</p>
            <p className="text-white/40 font-mono text-xs mt-2">No skills found</p>
          </div>
        ) : (
          <>
            {/* Dynamic Skills Grid - Auto-aligns based on number of categories */}
            <div className={`grid grid-cols-1 ${gridCols} gap-6 mb-10 mx-auto`}>
              {categories.map((category, catIndex) => {
                const IconComponent = categoryIcons[category] || categoryIcons.default;
                const title = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1);
                const categorySkills = groupedSkills[category];

                return (
                  <div 
                    key={category}
                    className="opacity-0 animate-fade-in-up" 
                    style={{ animationDelay: `${catIndex * 0.2}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="hud-frame p-6 md:p-8 bg-black/50 backdrop-blur-sm h-full">
                      <div className="hud-content">
                        <div className="mb-6 flex items-center gap-3">
                          <IconComponent className="w-6 h-6 text-[#FF4D00]" strokeWidth={1.5} />
                          <div className="flex-1">
                            <h2 className="text-[#FF4D00] font-['Rajdhani'] text-xl md:text-2xl font-bold tracking-wide uppercase">
                              {title}
                            </h2>
                            <div className="h-[1px] w-full bg-gradient-to-r from-[#FF4D00] to-transparent mt-1" />
                          </div>
                          <span className="text-white/30 font-mono text-xs">{categorySkills.length}</span>
                        </div>
                        
                        <div className="space-y-5">
                          {categorySkills.map((skill, index) => (
                            <div key={skill.id}>
                              <SkillBar
                                skill={skill.name}
                                level={skill.level}
                                index={index}
                              />
                              <p className="text-white/40 font-mono text-xs ml-1 mt-1">
                                {skill.module}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats Grid - Auto-adjusts based on number of stats */}
            <div 
              className={`grid grid-cols-2 ${displayStats.length <= 4 ? 'md:grid-cols-4' : 'md:grid-cols-' + Math.min(displayStats.length, 6)} gap-3 md:gap-4 mb-10 opacity-0 animate-fade-in-up`} 
              style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
            >
              {displayStats.map((stat, index) => {
                const StatIcon = stat.icon || Award;
                return (
                  <div
                    key={stat.label}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.8 + index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="hud-frame p-4 md:p-6 bg-black/50 backdrop-blur-sm text-center">
                      <div className="hud-content">
                        <StatIcon className="w-5 h-5 text-[#FF4D00]/50 mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-3xl md:text-4xl font-['Rajdhani'] font-bold text-[#FF4D00] mb-1">
                          {stat.value}
                        </p>
                        <p className="text-white font-['Rajdhani'] text-xs md:text-sm tracking-wide uppercase mb-1">
                          {stat.label}
                        </p>
                        <p className="text-white/40 font-mono text-xs tracking-widest">
                          {stat.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Download Resume */}
        <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <button
            onClick={handleDownloadResume}
            className="group relative inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-black/50 backdrop-blur-sm border-2 border-[#FF4D00] text-[#FF4D00] font-['Rajdhani'] font-bold text-base md:text-lg tracking-wider uppercase hover:bg-[#FF4D00] hover:text-black transition-all duration-300"
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
