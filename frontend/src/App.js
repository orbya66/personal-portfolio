import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReticleCursor from './components/ReticleCursor';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Work from './pages/Work';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import '@/App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [configLoaded, setConfigLoaded] = useState(false);

  // Load site config and apply colors
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/config`);
        const config = await res.json();
        
        // Apply colors as CSS variables
        if (config.colors) {
          const root = document.documentElement;
          root.style.setProperty('--primary', config.colors.primary || '#FF4D00');
          root.style.setProperty('--background', config.colors.background || '#000000');
          root.style.setProperty('--text', config.colors.text || '#FFFFFF');
          root.style.setProperty('--text-muted', config.colors.textMuted || 'rgba(255, 255, 255, 0.6)');
          root.style.setProperty('--success', config.colors.success || '#00FF00');
          root.style.setProperty('--error', config.colors.error || '#FF0000');
          
          // Also update body background
          document.body.style.backgroundColor = config.colors.background || '#000000';
        }
        
        // Store config in window for other components
        window.siteConfig = config;
        setConfigLoaded(true);
      } catch (err) {
        console.error('Error loading config:', err);
        setConfigLoaded(true); // Continue with defaults
      }
    };

    loadConfig();
  }, []);

  return (
    <div className="App">
      <ReticleCursor />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
