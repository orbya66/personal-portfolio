import React, { useState, useEffect } from 'react';
import { 
  Lock, Settings, Palette, FileText, BarChart3, MessageSquare, 
  Plus, Trash2, Edit2, Save, X, Eye, EyeOff, RefreshCw,
  LogOut, User, Globe, Quote, Briefcase, Zap
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Tab Components
const tabs = [
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'quotes', label: 'Quotes', icon: Quote },
  { id: 'config', label: 'Site Config', icon: Settings },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

// Login Component
function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        onLogin(password);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="hud-frame p-8 bg-black/50 backdrop-blur-sm">
          <div className="hud-content">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
              <h1 className="text-2xl font-['Rajdhani'] font-bold text-white uppercase tracking-wider">
                Admin Access
              </h1>
              <p className="text-white/60 font-mono text-xs mt-2">
                Enter password to continue
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className="w-full bg-black/50 border border-[var(--primary)]/30 focus:border-[var(--primary)] px-4 py-3 text-white font-mono outline-none"
                data-testid="admin-password-input"
              />
              
              {error && (
                <p className="text-red-500 font-mono text-xs text-center">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[var(--primary)] text-black font-['Rajdhani'] font-bold uppercase tracking-wider hover:bg-[var(--primary)]/80 transition-colors disabled:opacity-50"
                data-testid="admin-login-btn"
              >
                {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
              </button>
            </form>
            
            <p className="text-white/30 font-mono text-xs text-center mt-6">
              Default password: orbya2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Manager
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (project) => {
    try {
      const method = project.id ? 'PUT' : 'POST';
      const url = project.id ? `${BACKEND_URL}/api/projects/${project.id}` : `${BACKEND_URL}/api/projects`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      
      fetchProjects();
      setEditingId(null);
      setShowAdd(false);
      setEditForm({});
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const newProject = {
    title: '', category: '', description: '', thumbnail: '', 
    videoUrl: '', featured: false, tags: [], year: new Date().getFullYear(),
    aspectRatio: '16:9'
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowAdd(true); setEditForm(newProject); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {(showAdd || editingId) && (
        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Title"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Category"
                value={editForm.category || ''}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Thumbnail URL"
                value={editForm.thumbnail || ''}
                onChange={(e) => setEditForm({...editForm, thumbnail: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Video URL"
                value={editForm.videoUrl || ''}
                onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Year"
                type="number"
                value={editForm.year || ''}
                onChange={(e) => setEditForm({...editForm, year: parseInt(e.target.value)})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <select
                value={editForm.aspectRatio || '16:9'}
                onChange={(e) => setEditForm({...editForm, aspectRatio: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3 (Classic)</option>
                <option value="21:9">21:9 (Ultrawide)</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={editForm.description || ''}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20"
            />
            <input
              placeholder="Tags (comma-separated)"
              value={(editForm.tags || []).join(', ')}
              onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
              className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
            />
            <label className="flex items-center gap-2 text-white font-mono text-sm">
              <input
                type="checkbox"
                checked={editForm.featured || false}
                onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                className="accent-[var(--primary)]"
              />
              Featured Project
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(editForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditingId(null); setShowAdd(false); setEditForm({}); }}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 bg-black/30 border border-[var(--primary)]/20">
            <div className="flex items-center gap-4">
              {project.thumbnail && (
                <img src={project.thumbnail} alt="" className="w-16 h-10 object-cover" />
              )}
              <div>
                <p className="text-white font-['Rajdhani'] font-semibold">{project.title}</p>
                <p className="text-[var(--primary)] font-mono text-xs">{project.category} • {project.year}</p>
              </div>
              {project.featured && (
                <span className="px-2 py-0.5 bg-[var(--primary)] text-black font-mono text-xs">FEATURED</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingId(project.id); setEditForm(project); }}
                className="p-2 text-white/60 hover:text-[var(--primary)]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-white/60 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Manager
function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/skills`);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSave = async (skill) => {
    try {
      const method = skill.id ? 'PUT' : 'POST';
      const url = skill.id ? `${BACKEND_URL}/api/skills/${skill.id}` : `${BACKEND_URL}/api/skills`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      });
      
      fetchSkills();
      setEditingId(null);
      setShowAdd(false);
      setEditForm({});
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/skills/${id}`, { method: 'DELETE' });
      fetchSkills();
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const newSkill = { name: '', level: 80, module: '', category: 'software', icon: '' };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Skills ({skills.length})</h2>
        <button
          onClick={() => { setShowAdd(true); setEditForm(newSkill); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {(showAdd || editingId) && (
        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Skill Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <select
                value={editForm.category || 'software'}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              >
                <option value="software">Software</option>
                <option value="creative">Creative</option>
                <option value="tools">Tools</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
              </select>
              <div>
                <label className="text-white/60 font-mono text-xs mb-1 block">Level: {editForm.level || 80}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.level || 80}
                  onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value)})}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
              <input
                placeholder="Module (e.g., AE_MODULE_V2.0)"
                value={editForm.module || ''}
                onChange={(e) => setEditForm({...editForm, module: e.target.value})}
                className="bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(editForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditingId(null); setShowAdd(false); setEditForm({}); }}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between p-4 bg-black/30 border border-[var(--primary)]/20">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-white font-['Rajdhani'] font-semibold">{skill.name}</p>
                <span className="px-2 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] font-mono text-xs">{skill.category}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 max-w-xs h-2 bg-white/10 rounded">
                  <div className="h-full bg-[var(--primary)]" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-white/60 font-mono text-xs">{skill.level}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingId(skill.id); setEditForm(skill); }}
                className="p-2 text-white/60 hover:text-[var(--primary)]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 text-white/60 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stats Manager
function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
      alert('Stats saved!');
    } catch (err) {
      console.error('Error saving stats:', err);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const addStat = () => {
    setStats([...stats, { label: 'New Stat', value: '0', unit: 'UNIT' }]);
  };

  const removeStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Portfolio Stats</h2>
        <div className="flex gap-2">
          <button onClick={addStat} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="hud-frame p-4 bg-black/50">
            <div className="hud-content space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60 font-mono text-xs">Stat #{index + 1}</span>
                <button onClick={() => removeStat(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                placeholder="Label"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Value (e.g., 150+)"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
              <input
                placeholder="Unit (e.g., COMPLETED)"
                value={stat.unit}
                onChange={(e) => updateStat(index, 'unit', e.target.value)}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quotes Manager
function QuotesManager() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/quotes`);
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      console.error('Error fetching quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/quotes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotes)
      });
      alert('Quotes saved!');
    } catch (err) {
      console.error('Error saving quotes:', err);
    }
  };

  const updateQuote = (index, field, value) => {
    const newQuotes = [...quotes];
    newQuotes[index] = { ...newQuotes[index], [field]: value };
    setQuotes(newQuotes);
  };

  const addQuote = () => {
    setQuotes([...quotes, { quote: '', author: '' }]);
  };

  const removeQuote = (index) => {
    setQuotes(quotes.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Quotes ({quotes.length})</h2>
        <div className="flex gap-2">
          <button onClick={addQuote} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
            <Plus className="w-4 h-4" /> Add Quote
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {quotes.map((quote, index) => (
          <div key={index} className="hud-frame p-4 bg-black/50">
            <div className="hud-content">
              <div className="flex justify-between mb-2">
                <span className="text-white/60 font-mono text-xs">Quote #{index + 1}</span>
                <button onClick={() => removeQuote(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                placeholder="Quote text..."
                value={quote.quote}
                onChange={(e) => updateQuote(index, 'quote', e.target.value)}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20 mb-2"
              />
              <input
                placeholder="Author"
                value={quote.author}
                onChange={(e) => updateQuote(index, 'author', e.target.value)}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Site Config Manager
function ConfigManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`);
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('Config saved! Refresh the page to see changes.');
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Site Configuration</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
          <Save className="w-4 h-4" /> Save Config
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase">Basic Info</h3>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Site Name</label>
              <input
                value={config.siteName || ''}
                onChange={(e) => setConfig({...config, siteName: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Owner Name</label>
              <input
                value={config.ownerName || ''}
                onChange={(e) => setConfig({...config, ownerName: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Tagline</label>
              <input
                value={config.tagline || ''}
                onChange={(e) => setConfig({...config, tagline: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Description</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({...config, description: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20"
              />
            </div>
          </div>
        </div>

        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase">HUD Info</h3>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">System ID</label>
              <input
                value={config.systemId || ''}
                onChange={(e) => setConfig({...config, systemId: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Location</label>
              <input
                value={config.location || ''}
                onChange={(e) => setConfig({...config, location: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Status</label>
              <input
                value={config.status || ''}
                onChange={(e) => setConfig({...config, status: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Availability</label>
              <input
                value={config.availability || ''}
                onChange={(e) => setConfig({...config, availability: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-1 block">Work Type</label>
              <input
                value={config.workType || ''}
                onChange={(e) => setConfig({...config, workType: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="hud-frame p-6 bg-black/50 col-span-2">
          <div className="hud-content space-y-4">
            <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 font-mono text-xs mb-1 block">Email</label>
                <input
                  value={config.social?.email || ''}
                  onChange={(e) => setConfig({...config, social: {...config.social, email: e.target.value}})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 font-mono text-xs mb-1 block">LinkedIn</label>
                <input
                  value={config.social?.linkedin || ''}
                  onChange={(e) => setConfig({...config, social: {...config.social, linkedin: e.target.value}})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 font-mono text-xs mb-1 block">Instagram</label>
                <input
                  value={config.social?.instagram || ''}
                  onChange={(e) => setConfig({...config, social: {...config.social, instagram: e.target.value}})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 font-mono text-xs mb-1 block">YouTube</label>
                <input
                  value={config.social?.youtube || ''}
                  onChange={(e) => setConfig({...config, social: {...config.social, youtube: e.target.value}})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Colors Manager
function ColorsManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`);
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      // Apply colors immediately
      const colors = config.colors || {};
      document.documentElement.style.setProperty('--primary', colors.primary || '#FF4D00');
      document.documentElement.style.setProperty('--background', colors.background || '#000000');
      document.documentElement.style.setProperty('--text', colors.text || '#FFFFFF');
      alert('Colors saved and applied!');
    } catch (err) {
      console.error('Error saving colors:', err);
    }
  };

  const updateColor = (key, value) => {
    setConfig({
      ...config,
      colors: { ...config.colors, [key]: value }
    });
  };

  const presetThemes = [
    { name: 'Iron Man (Default)', primary: '#FF4D00', background: '#000000', text: '#FFFFFF' },
    { name: 'Cyberpunk', primary: '#00FFFF', background: '#0a0a0a', text: '#FFFFFF' },
    { name: 'Matrix', primary: '#00FF00', background: '#000000', text: '#00FF00' },
    { name: 'Purple Haze', primary: '#9945FF', background: '#0a0a0a', text: '#FFFFFF' },
    { name: 'Gold Rush', primary: '#FFD700', background: '#1a1a1a', text: '#FFFFFF' },
    { name: 'Ocean Blue', primary: '#0099FF', background: '#0a1929', text: '#FFFFFF' },
    { name: 'Hot Pink', primary: '#FF1493', background: '#0a0a0a', text: '#FFFFFF' },
    { name: 'Emerald', primary: '#50C878', background: '#0a1a0a', text: '#FFFFFF' },
  ];

  const applyPreset = (preset) => {
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        primary: preset.primary,
        background: preset.background,
        text: preset.text
      }
    });
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  const colors = config.colors || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Color Theme</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
          <Save className="w-4 h-4" /> Save & Apply
        </button>
      </div>

      {/* Preset Themes */}
      <div className="hud-frame p-6 bg-black/50">
        <div className="hud-content">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">Quick Presets</h3>
          <div className="grid grid-cols-4 gap-3">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-3 border border-[var(--primary)]/20 hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                  <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: preset.background }} />
                </div>
                <p className="text-white font-mono text-xs">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-2 gap-6">
        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase">Main Colors</h3>
            
            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Primary Color (Accent)</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.primary || '#FF4D00'}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.primary || '#FF4D00'}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Background Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.background || '#000000'}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.background || '#000000'}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Text Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.text || '#FFFFFF'}
                  onChange={(e) => updateColor('text', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.text || '#FFFFFF'}
                  onChange={(e) => updateColor('text', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hud-frame p-6 bg-black/50">
          <div className="hud-content space-y-4">
            <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase">Status Colors</h3>
            
            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Success Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.success || '#00FF00'}
                  onChange={(e) => updateColor('success', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.success || '#00FF00'}
                  onChange={(e) => updateColor('success', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Error Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.error || '#FF0000'}
                  onChange={(e) => updateColor('error', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.error || '#FF0000'}
                  onChange={(e) => updateColor('error', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Muted Text Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={colors.textMuted || '#999999'}
                  onChange={(e) => updateColor('textMuted', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.textMuted || 'rgba(255,255,255,0.6)'}
                  onChange={(e) => updateColor('textMuted', e.target.value)}
                  className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="hud-frame p-6" style={{ backgroundColor: colors.background || '#000000' }}>
        <div className="hud-content">
          <h3 style={{ color: colors.primary || '#FF4D00' }} className="font-['Rajdhani'] font-bold uppercase mb-4">Live Preview</h3>
          <p style={{ color: colors.text || '#FFFFFF' }} className="mb-2">This is how your main text will look.</p>
          <p style={{ color: colors.textMuted || 'rgba(255,255,255,0.6)' }} className="text-sm mb-4">This is muted/secondary text.</p>
          <div className="flex gap-3">
            <button style={{ backgroundColor: colors.primary, color: colors.background }} className="px-4 py-2 font-mono text-sm">
              Primary Button
            </button>
            <button style={{ borderColor: colors.primary, color: colors.primary }} className="px-4 py-2 font-mono text-sm border">
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Messages Viewer
function MessagesViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`);
      const data = await res.json();
      setMessages(data.reverse()); // Newest first
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Contact Messages ({messages.length})</h2>
        <button onClick={fetchMessages} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-8 text-white/60 font-mono">No messages yet</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className="hud-frame p-4 bg-black/50">
              <div className="hud-content">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-['Rajdhani'] font-semibold">{msg.name}</p>
                    <p className="text-[var(--primary)] font-mono text-xs">{msg.email}</p>
                  </div>
                  <span className="text-white/40 font-mono text-xs">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-white/80 font-mono text-sm font-semibold mb-1">{msg.subject}</p>
                <p className="text-white/60 font-mono text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin Component
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const handleLogin = (password) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />;
      case 'skills': return <SkillsManager />;
      case 'stats': return <StatsManager />;
      case 'quotes': return <QuotesManager />;
      case 'config': return <ConfigManager />;
      case 'colors': return <ColorsManager />;
      case 'messages': return <MessagesViewer />;
      default: return <ProjectsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-black grid-pattern pt-16">
      {/* Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-[var(--primary)]/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 text-[var(--primary)]" />
            <h1 className="font-['Rajdhani'] text-xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm hover:border-[var(--primary)]"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="fixed top-[108px] left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-[var(--primary)]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-black'
                    : 'text-white/60 hover:text-[var(--primary)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        {renderContent()}
      </div>
    </div>
  );
}
