import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import { ArrowRight, Video, Code, Mail, Play, Target, Zap, Activity } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// HUD Data Display Component
const HUDDataPoint = ({ label, value, position, delay = 0 }) => (
  <div 
    className={`absolute ${position} font-mono text-xs opacity-0 animate-fade-in-up hidden lg:block`}
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="flex items-center gap-2 text-[#FF4D00]/60">
      <div className="w-2 h-2 bg-[#FF4D00]/40 animate-pulse" />
      <span className="text-white/40">{label}</span>
    </div>
    <div className="text-[#FF4D00] mt-1 tracking-wider">{value}</div>
  </div>
);

// Animated Arc Reactor Ring
const ArcRing = ({ size, delay, reverse }) => (
  <div 
    className={`absolute border border-[#FF4D00]/20 rounded-full ${reverse ? 'animate-spin-reverse' : 'animate-spin-slow'}`}
    style={{ 
      width: size, 
      height: size, 
      animationDuration: `${20 + delay * 5}s`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  >
    <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#FF4D00]/40 -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#FF4D00]/40 -translate-x-1/2 translate-y-1/2" />
    <div className="absolute left-0 top-1/2 w-1 h-1 bg-[#FF4D00]/40 -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute right-0 top-1/2 w-1 h-1 bg-[#FF4D00]/40 translate-x-1/2 -translate-y-1/2" />
  </div>
);

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch featured projects
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/projects`);
        const data = await response.json();
        const featured = data.filter(p => p.featured);
        
        // If no featured, pick random ones
        const projectsToShow = featured.length > 0 
          ? featured.slice(0, 3) 
          : data.slice(0, 3);
        
        setFeaturedProjects(projectsToShow);
        
        // Determine aspect ratio (can be made dynamic per project)
        // For now, using a single setting
        setAspectRatio('16:9'); // Change to '9:16' to show 3 vertical videos
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    // Fetch quote of the day
    const fetchQuote = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/quote`);
        const data = await response.json();
        setQuote(data);
      } catch (err) {
        console.error('Error fetching quote:', err);
      }
    };

    fetchFeaturedProjects();
    fetchQuote();
  }, []);

  const quickLinks = [
    { to: '/work', icon: Video, label: 'Projects', desc: 'THE VAULT' },
    { to: '/skills', icon: Code, label: 'Skills', desc: 'TECH SPECS' },
    { to: '/contact', icon: Mail, label: 'Contact', desc: 'COMMS' },
  ];

  return (
    <div className="min-h-screen pt-16 grid-pattern">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with grid */}
        <div className="absolute inset-0 bg-black grid-pattern" />
        
        {/* Decorative corner elements */}
        <div className="absolute top-20 left-4 lg:left-12 w-32 h-32 border-l border-t border-[#FF4D00]/20" />
        <div className="absolute top-20 right-4 lg:right-12 w-32 h-32 border-r border-t border-[#FF4D00]/20" />
        <div className="absolute bottom-20 left-4 lg:left-12 w-32 h-32 border-l border-b border-[#FF4D00]/20" />
        <div className="absolute bottom-20 right-4 lg:right-12 w-32 h-32 border-r border-b border-[#FF4D00]/20" />

        {/* Floating HUD Data Points */}
        <HUDDataPoint label="SYS_TIME" value={systemTime} position="top-28 left-8 lg:left-16" delay={1.5} />
        <HUDDataPoint label="STATUS" value="ONLINE" position="top-28 right-8 lg:right-16" delay={1.7} />
        <HUDDataPoint label="LOCATION" value="INDIA" position="bottom-32 left-8 lg:left-16" delay={1.9} />
        <HUDDataPoint label="VERSION" value="V2.0.1" position="bottom-32 right-8 lg:right-16" delay={2.1} />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-screen py-20">
            <div className="animate-fade-in-up w-full flex flex-col items-center">
              
              {/* System ID Badge */}
              <div className="mb-6">
                <span className="inline-block px-6 py-2 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
                  SYSTEM_ID: ORBYA-V2.0
                </span>
              </div>

              {/* Main Title with Decorative Elements */}
              <div className="relative mb-4">
                {/* Arc Reactor Rings - Hidden on mobile */}
                <div className="hidden md:block">
                  <ArcRing size="400px" delay={0} reverse={false} />
                  <ArcRing size="320px" delay={1} reverse={true} />
                  <ArcRing size="240px" delay={2} reverse={false} />
                </div>

                {/* Targeting Lines */}
                <div className="absolute -left-8 lg:-left-24 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                  <div className="w-8 lg:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#FF4D00]/50" />
                  <Target className="w-4 h-4 text-[#FF4D00]/50" strokeWidth={1} />
                </div>
                <div className="absolute -right-8 lg:-right-24 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                  <Target className="w-4 h-4 text-[#FF4D00]/50" strokeWidth={1} />
                  <div className="w-8 lg:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#FF4D00]/50" />
                </div>

                <h1 className="font-['Rajdhani'] text-7xl md:text-9xl font-bold tracking-tighter uppercase text-white relative z-10">
                  <GlitchText text="ORBYA" delay={0} />
                </h1>
              </div>

              {/* Name with Status Indicator */}
              <div className="flex items-center gap-4 mb-6">
                <div className="hidden sm:flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF4D00] animate-pulse" strokeWidth={1.5} />
                  <div className="w-12 h-[1px] bg-gradient-to-r from-[#FF4D00] to-transparent" />
                </div>
                <h2 className="text-2xl md:text-4xl text-[#FF4D00] font-['Rajdhani'] font-semibold tracking-wide uppercase">
                  <GlitchText text="SHRUNIT SHIRKE" delay={300} />
                </h2>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-12 h-[1px] bg-gradient-to-l from-[#FF4D00] to-transparent" />
                  <Zap className="w-4 h-4 text-[#FF4D00] animate-pulse" strokeWidth={1.5} />
                </div>
              </div>

              {/* Description Box */}
              <div className="w-full max-w-2xl mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <div className="hud-frame p-6 md:p-8 bg-black/30 backdrop-blur-sm">
                  <div className="hud-content">
                    <p className="text-base md:text-xl text-white/80 font-['Barlow'] leading-relaxed">
                      CINEMATIC VIDEO EDITOR • MOTION DESIGNER • VISUAL STORYTELLER
                    </p>
                    <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent" />
                    <p className="mt-4 text-sm text-white/60 font-mono">
                      Crafting high-impact visual experiences through precision editing and motion graphics
                    </p>
                    
                    {/* Status Bar */}
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono text-white/40">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>AVAILABLE</span>
                      </div>
                      <div className="h-3 w-[1px] bg-white/20" />
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#FF4D00] animate-pulse" />
                        <span>FREELANCE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="w-full max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {quickLinks.map((link, index) => (
                    <Link key={link.to} to={link.to} className="group">
                      <div className="relative p-5 md:p-6 bg-black/50 backdrop-blur-sm border border-[#FF4D00]/30 hover:border-[#FF4D00] transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <link.icon className="w-8 h-8 text-[#FF4D00] mb-3 mx-auto" strokeWidth={1.5} />
                        <h3 className="text-white font-['Rajdhani'] font-semibold text-xl tracking-wide uppercase mb-1">
                          {link.label}
                        </h3>
                        <p className="text-[#FF4D00] font-mono text-xs tracking-widest mb-3">
                          {link.desc}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-white/50 group-hover:text-[#FF4D00] transition-colors text-sm">
                          <span className="font-mono">ACCESS</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#FF4D00] to-transparent" />
        </div>
      </section>

      {/* Featured Highlights Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest mb-4">
              PRIORITY_MISSIONS: ACTIVE
            </span>
            <h2 className="font-['Rajdhani'] text-4xl md:text-5xl font-bold tracking-tighter uppercase text-white mb-4">
              <GlitchText text="MISSION BRIEFING" delay={0} />
            </h2>
            <p className="text-white/60 font-mono text-xs max-w-2xl mx-auto">
              JARVIS_PROTOCOL: DISPLAYING_PRIORITY_TARGETS
            </p>
          </div>

          {/* Video Highlights Grid */}
          {aspectRatio === '16:9' ? (
            // Single landscape video
            <div className="max-w-5xl mx-auto mb-12">
              {featuredProjects.length > 0 && (
                <div className="hud-frame bg-black/50 backdrop-blur-sm overflow-hidden group">
                  <div className="hud-content aspect-video relative">
                    <img 
                      src={featuredProjects[0].thumbnail} 
                      alt={featuredProjects[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 rounded-full bg-[#FF4D00]/20 backdrop-blur-sm flex items-center justify-center border-2 border-[#FF4D00]">
                        <Play className="w-10 h-10 text-[#FF4D00] ml-1" fill="#FF4D00" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-['Rajdhani'] text-2xl font-bold mb-1">
                        {featuredProjects[0].title}
                      </h3>
                      <p className="text-[#FF4D00] font-mono text-sm">
                        {featuredProjects[0].category}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Three vertical videos
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredProjects.slice(0, 3).map((project, index) => (
                <div key={project.id} className="hud-frame bg-black/50 backdrop-blur-sm overflow-hidden group">
                  <div className="hud-content aspect-[9/16] relative">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#FF4D00]/20 backdrop-blur-sm flex items-center justify-center border-2 border-[#FF4D00]">
                        <Play className="w-8 h-8 text-[#FF4D00] ml-1" fill="#FF4D00" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-['Rajdhani'] text-lg font-bold mb-1">
                        {project.title}
                      </h3>
                      <p className="text-[#FF4D00] font-mono text-xs">
                        {project.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quote of the Day */}
          {quote.quote && (
            <div className="max-w-4xl mx-auto">
              <div className="hud-frame p-8 bg-black/30 backdrop-blur-sm">
                <div className="hud-content">
                  <div className="flex items-start gap-4">
                    <div className="text-[#FF4D00] text-6xl font-['Rajdhani'] leading-none">&ldquo;</div>
                    <div className="flex-1">
                      <p className="text-white/90 font-['Barlow'] text-lg md:text-xl italic leading-relaxed mb-4">
                        {quote.quote}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-[1px] w-12 bg-[#FF4D00]" />
                        <p className="text-[#FF4D00] font-mono text-sm tracking-wider">
                          {quote.author}
                        </p>
                      </div>
                      <p className="text-white/40 font-mono text-xs mt-2 tracking-widest">
                        QUOTE_OF_THE_DAY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
