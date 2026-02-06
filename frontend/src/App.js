import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReticleCursor } from './components/ReticleCursor';
import { Navigation } from './components/Navigation';
import Home from './pages/Home';
import Work from './pages/Work';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import '@/App.css';

function App() {
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
