import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  // Hide navigation on admin page
  if (location.pathname === '/admin') return null;

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/work', label: 'THE VAULT' },
    { path: '/skills', label: 'TECH SPECS' },
    { path: '/contact', label: 'COMMS' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_ironhud-portfolio/artifacts/0lt0be1r_ORBYA%20LOGO.png"
              alt="ORBYA Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-white font-['Rajdhani'] font-bold text-xl tracking-wider group-hover:text-[var(--primary)] transition-colors">
              ORBYA
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  className={`px-4 py-2 font-['JetBrains_Mono'] text-sm tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-black bg-[var(--primary)] font-bold'
                      : 'text-white/70 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin Link */}
            <Link
              to="/admin"
              data-testid="nav-link-admin"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 text-white/40 hover:text-[var(--primary)] font-mono text-xs tracking-wider transition-all duration-200 hover:bg-[var(--primary)]/5"
            >
              <Shield className="w-3.5 h-3.5" />
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
