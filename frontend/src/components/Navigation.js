import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/work', label: 'THE VAULT' },
    { path: '/skills', label: 'TECH SPECS' },
    { path: '/contact', label: 'COMMS' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#FF4D00]/30 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://customer-assets.emergentagent.com/job_ironhud-portfolio/artifacts/0lt0be1r_ORBYA%20LOGO.png"
              alt="ORBYA Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-white font-['Rajdhani'] font-bold text-xl tracking-wider">
              ORBYA
            </span>
          </Link>

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
                  
                  {isActive && (
                    <>
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.8)]" />
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#FF4D00] animate-pulse" />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
