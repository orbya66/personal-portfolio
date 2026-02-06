import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HUDFrame } from '../components/HUDFrame';
import { GlitchText } from '../components/GlitchText';
import { ArrowRight, Video, Code, Mail } from 'lucide-react';

export default function Home() {
  const quickLinks = [
    { to: '/work', icon: Video, label: 'Projects', desc: 'THE VAULT' },
    { to: '/skills', icon: Code, label: 'Skills', desc: 'TECH SPECS' },
    { to: '/contact', icon: Mail, label: 'Contact', desc: 'COMMS' },
  ];

  return (
    <div className="min-h-screen pt-16 grid-pattern">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Container */}
        <HUDFrame className="absolute inset-0" scanline={true}>
          <div className="w-full h-full bg-gradient-to-b from-black/50 via-black/30 to-black flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
              poster="https://images.unsplash.com/photo-1706705556261-c02146118d58?crop=entropy&cs=srgb&fm=jpg&q=85"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          </div>
        </HUDFrame>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* System ID */}
            <div className="mb-8">
              <span className="inline-block px-6 py-2 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
                SYSTEM_ID: ORBYA-V2.0
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-['Rajdhani'] text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-6 text-white">
              <GlitchText text="ORBYA" delay={0} />
            </h1>

            {/* Subtitle */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl text-[#FF4D00] font-['Rajdhani'] font-semibold tracking-wide uppercase">
                <GlitchText text="SHRUNIT SHIRKE" delay={300} />
              </h2>
            </div>

            {/* Mission Statement */}
            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <HUDFrame className="p-8 bg-black/30 backdrop-blur-sm">
                <p className="text-lg md:text-xl text-white/80 font-['Barlow'] leading-relaxed">
                  CINEMATIC VIDEO EDITOR • MOTION DESIGNER • VISUAL STORYTELLER
                </p>
                <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent" />
                <p className="mt-4 text-sm text-white/60 font-mono">
                  Crafting high-impact visual experiences through precision editing and motion graphics
                </p>
              </HUDFrame>
            </motion.div>

            {/* Quick Links Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {quickLinks.map((link, index) => (
                <Link key={link.to} to={link.to} className="group">
                  <motion.div
                    className="relative p-6 bg-black/50 backdrop-blur-sm border border-[#FF4D00]/30 hover:border-[#FF4D00] transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF4D00] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <link.icon className="w-8 h-8 text-[#FF4D00] mb-4 mx-auto" strokeWidth={1.5} />
                    <h3 className="text-white font-['Rajdhani'] font-semibold text-xl tracking-wide uppercase mb-2">
                      {link.label}
                    </h3>
                    <p className="text-[#FF4D00] font-mono text-xs tracking-widest mb-3">
                      {link.desc}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-white/50 group-hover:text-[#FF4D00] transition-colors text-sm">
                      <span className="font-mono">ACCESS</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#FF4D00] to-transparent" />
        </motion.div>
      </section>
    </div>
  );
}
