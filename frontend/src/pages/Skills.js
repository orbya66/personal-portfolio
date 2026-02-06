import React from 'react';
import GlitchText from '../components/GlitchText';
import SkillBar from '../components/SkillBar';
import { Download } from 'lucide-react';

export default function Skills() {
  const skills = [
    { name: 'After Effects', level: 95, module: 'AE_MODULE_V2.0' },
    { name: 'Premiere Pro', level: 90, module: 'PR_MODULE_V1.8' },
    { name: 'Photoshop', level: 85, module: 'PS_MODULE_V2.1' },
    { name: 'DaVinci Resolve', level: 88, module: 'DR_MODULE_V1.9' },
    { name: 'Motion Graphics', level: 92, module: 'MG_SYSTEM_V3.0' },
    { name: 'Color Grading', level: 87, module: 'CG_SYSTEM_V2.5' },
    { name: 'VFX Compositing', level: 90, module: 'VFX_SYSTEM_V2.8' },
    { name: 'Sound Design', level: 75, module: 'SD_MODULE_V1.5' },
  ];

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
                  {skills.slice(0, 4).map((skill, index) => (
                    <div key={skill.name}>
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
                  {skills.slice(4).map((skill, index) => (
                    <div key={skill.name}>
                      <SkillBar
                        skill={skill.name}
                        level={skill.level}
                        index={index + 4}
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
              <HUDFrame className="p-6 bg-black/50 backdrop-blur-sm text-center">
                <p className="text-4xl font-['Rajdhani'] font-bold text-[#FF4D00] mb-2">
                  {stat.value}
                </p>
                <p className="text-white font-['Rajdhani'] text-sm tracking-wide uppercase mb-1">
                  {stat.label}
                </p>
                <p className="text-white/40 font-mono text-xs tracking-widest">
                  {stat.unit}
                </p>
              </HUDFrame>
            </div>
          ))}
        </div>

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
