import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/work', label: 'THE VAULT' },
    { path: '/skills', label: 'TECH SPECS' },
    { path: '/contact', label: 'COMMS' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#FF4D00]/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-8 h-8 text-[#FF4D00]" strokeWidth={1.5} />
            </motion.div>
            <span className="text-white font-['Rajdhani'] font-bold text-xl tracking-wider">
              ORBYA
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <span className="font-['JetBrains_Mono'] text-sm tracking-wider text-white/70 group-hover:text-[#FF4D00] transition-colors duration-200">
                    {link.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.8)]"
                    />
                  )}
                  
                  {/* Hover pulse */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#FF4D00]"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
