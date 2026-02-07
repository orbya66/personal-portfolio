import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Settings, Palette, BarChart3, MessageSquare, 
  Plus, Trash2, Edit2, Save, X, RefreshCw,
  LogOut, Quote, Briefcase, Zap, Upload, Image, Video, Copy, Check, ChevronDown, FolderOpen
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Tab Components
const tabs = [
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'quotes', label: 'Quotes', icon: Quote },
  { id: 'config', label: 'Config', icon: Settings },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

// Improved Category Select Component with animations
function CategorySelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowNewInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cat) => {
    onChange(cat);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (newCategory.trim()) {
      onChange(newCategory.trim());
      setNewCategory('');
      setShowNewInput(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm hover:border-orange-500 transition-all duration-200 focus:outline-none focus:border-orange-500"
      >
        <span className={value ? 'text-white' : 'text-white/40'}>{value || placeholder}</span>
        <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-black border border-orange-500/50 shadow-lg shadow-orange-500/10 animate-slideDown overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt, idx) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-3 font-mono text-sm transition-all duration-200 flex items-center gap-3 ${
                  value === opt 
                    ? 'bg-orange-500 text-black' 
                    : 'text-white hover:bg-orange-500/20 hover:text-orange-500'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <FolderOpen className="w-4 h-4" />
                {opt}
              </button>
            ))}
          </div>
          
          <div className="border-t border-orange-500/30">
            {showNewInput ? (
              <div className="p-3 space-y-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNew()}
                  placeholder="Enter category name..."
                  className="w-full bg-black border border-orange-500/50 px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex-1 px-3 py-2 bg-orange-500 text-black font-mono text-xs font-bold hover:bg-orange-400 transition-colors"
                  >
                    CREATE
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewInput(false); setNewCategory(''); }}
                    className="px-3 py-2 border border-orange-500/30 text-white font-mono text-xs hover:border-orange-500 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewInput(true)}
                className="w-full text-left px-4 py-3 font-mono text-sm text-orange-500 hover:bg-orange-500/10 transition-colors flex items-center gap-3"
              >
                <Plus className="w-4 h-4" />
                Add New Category
              </button>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

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
        <div className="bg-black border-2 border-orange-500/50 p-8">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
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
              className="w-full bg-black border border-orange-500/30 focus:border-orange-500 px-4 py-3 text-white font-mono outline-none transition-colors"
              data-testid="admin-password-input"
            />
            
            {error && (
              <p className="text-red-500 font-mono text-xs text-center">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-black font-['Rajdhani'] font-bold uppercase tracking-wider hover:bg-orange-400 transition-colors disabled:opacity-50"
              data-testid="admin-login-btn"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}

// File Upload Component with better feedback
function FileUploader({ onUpload, accept = "image/*,video/*", label = "Upload" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        onUpload(data);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: Network error');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-mono text-xs hover:bg-orange-500/20 hover:border-orange-500 transition-all disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        {uploading ? `${progress}%` : label}
      </button>
    </div>
  );
}

// Projects Manager - Clean design without hud-frame
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

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

  const existingCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  const handleSave = async (project) => {
    setSaveStatus('saving');
    try {
      const method = project.id ? 'PUT' : 'POST';
      const url = project.id ? `${BACKEND_URL}/api/projects/${project.id}` : `${BACKEND_URL}/api/projects`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
        fetchProjects();
        setEditingId(null);
        setShowAdd(false);
        setEditForm({});
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setSaveStatus('error');
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

  const handleFileUpload = (data, field) => {
    const fullUrl = `${BACKEND_URL}${data.url}`;
    setEditForm({...editForm, [field]: fullUrl});
  };

  const newProject = {
    title: '', category: '', description: '', thumbnail: '', 
    videoUrl: '', featured: false, tags: [], year: new Date().getFullYear(),
    aspectRatio: '16:9'
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowAdd(true); setEditForm(newProject); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold hover:bg-orange-400 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div className="bg-black border-2 border-orange-500/50 p-6">
          <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase mb-6 text-lg">
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Title *</label>
                <input
                  placeholder="Project title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Category *</label>
                <CategorySelect
                  value={editForm.category || ''}
                  onChange={(cat) => setEditForm({...editForm, category: cat})}
                  options={existingCategories}
                  placeholder="Select or add category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Thumbnail</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Image URL or upload"
                    value={editForm.thumbnail || ''}
                    onChange={(e) => setEditForm({...editForm, thumbnail: e.target.value})}
                    className="flex-1 bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                  />
                  <FileUploader accept="image/*" onUpload={(data) => handleFileUpload(data, 'thumbnail')} label="IMG" />
                </div>
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Video URL</label>
                <div className="flex gap-2">
                  <input
                    placeholder="YouTube / Vimeo / MP4 / Drive"
                    value={editForm.videoUrl || ''}
                    onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})}
                    className="flex-1 bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                  />
                  <FileUploader accept="video/*" onUpload={(data) => handleFileUpload(data, 'videoUrl')} label="VID" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Year</label>
                <input
                  type="number"
                  placeholder="2024"
                  value={editForm.year || ''}
                  onChange={(e) => setEditForm({...editForm, year: parseInt(e.target.value) || ''})}
                  className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Aspect Ratio</label>
                <select
                  value={editForm.aspectRatio || '16:9'}
                  onChange={(e) => setEditForm({...editForm, aspectRatio: e.target.value})}
                  className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Vertical/Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:3">4:3 (Classic)</option>
                  <option value="21:9">21:9 (Ultrawide)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Description</label>
              <textarea
                placeholder="Project description..."
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm h-24 focus:border-orange-500 outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Tags (comma-separated)</label>
              <input
                placeholder="motion graphics, cinematic, vfx"
                value={(editForm.tags || []).join(', ')}
                onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            <label className="flex items-center gap-3 text-white font-mono text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={editForm.featured || false}
                onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                className="w-5 h-5 accent-orange-500"
              />
              <span className="group-hover:text-orange-500 transition-colors">Featured Project (shows on homepage)</span>
            </label>

            <div className="flex items-center gap-4 pt-4 border-t border-orange-500/20">
              <button
                onClick={() => handleSave(editForm)}
                disabled={!editForm.title || !editForm.category}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-mono text-sm font-bold hover:bg-orange-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> 
                {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED!' : 'SAVE PROJECT'}
              </button>
              <button
                onClick={() => { setEditingId(null); setShowAdd(false); setEditForm({}); }}
                className="flex items-center gap-2 px-4 py-3 border border-orange-500/30 text-white font-mono text-sm hover:border-orange-500 transition-colors"
              >
                <X className="w-4 h-4" /> CANCEL
              </button>
              {saveStatus === 'error' && (
                <span className="text-red-500 font-mono text-sm">Save failed!</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center gap-4 p-4 bg-black border border-orange-500/20 hover:border-orange-500/50 transition-colors group">
            {project.thumbnail && (
              <img src={project.thumbnail} alt="" className="w-24 h-14 object-cover shrink-0 border border-orange-500/20" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-white font-['Rajdhani'] font-semibold text-lg">{project.title}</p>
                {project.featured && (
                  <span className="px-2 py-0.5 bg-orange-500 text-black font-mono text-xs font-bold">FEATURED</span>
                )}
              </div>
              <p className="text-orange-500 font-mono text-xs mt-1">{project.category} • {project.year}</p>
            </div>
            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditingId(project.id); setEditForm(project); setShowAdd(false); }}
                className="p-2 text-white hover:text-orange-500 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-white hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
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

  const newSkill = { name: '', level: 80, module: '', category: 'software' };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Skills ({skills.length})</h2>
        <button onClick={() => { setShowAdd(true); setEditForm(newSkill); }} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {(showAdd || editingId) && (
        <div className="bg-black border-2 border-orange-500/50 p-6">
          <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase mb-6">{editingId ? 'Edit Skill' : 'New Skill'}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Name</label>
                <input placeholder="After Effects" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Category</label>
                <select value={editForm.category || 'software'} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none">
                  <option value="software">Software</option>
                  <option value="creative">Creative</option>
                  <option value="tools">Tools</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Proficiency: {editForm.level || 80}%</label>
              <input type="range" min="0" max="100" value={editForm.level || 80} onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value)})} className="w-full accent-orange-500" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-2 uppercase">Module</label>
              <input placeholder="AE_MODULE_V2.0" value={editForm.module || ''} onChange={(e) => setEditForm({...editForm, module: e.target.value})} className="w-full bg-black border border-orange-500/30 px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => handleSave(editForm)} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-mono text-sm font-bold"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => { setEditingId(null); setShowAdd(false); setEditForm({}); }} className="flex items-center gap-2 px-4 py-3 border border-orange-500/30 text-white font-mono text-sm"><X className="w-4 h-4" /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-4 p-4 bg-black border border-orange-500/20 hover:border-orange-500/50 transition-colors group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-white font-['Rajdhani'] font-semibold">{skill.name}</p>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 font-mono text-xs">{skill.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs h-2 bg-white/10"><div className="h-full bg-orange-500" style={{ width: `${skill.level}%` }} /></div>
                <span className="text-white/60 font-mono text-xs">{skill.level}%</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(skill.id); setEditForm(skill); }} className="p-2 text-white hover:text-orange-500"><Edit2 className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 text-white hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Media Library
function MediaLibrary() {
  const [media, setMedia] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState('');

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/media`);
      const data = await res.json();
      setMedia(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = () => fetchMedia();

  const handleDelete = async (type, filename) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/media/${type}/${filename}`, { method: 'DELETE' });
      fetchMedia();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(`${BACKEND_URL}${url}`);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Media Library</h2>
        <FileUploader onUpload={handleUpload} label="Upload File" />
      </div>

      <div className="bg-black border-2 border-orange-500/50 p-6">
        <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase mb-4 flex items-center gap-2"><Image className="w-5 h-5" /> Images ({media.images.length})</h3>
        {media.images.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No images uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.images.map((img) => (
              <div key={img.filename} className="group relative border border-orange-500/20 hover:border-orange-500/50 transition-colors overflow-hidden">
                <img src={`${BACKEND_URL}${img.url}`} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button onClick={() => copyUrl(img.url)} className="p-2 bg-orange-500 text-black">
                    {copiedUrl === img.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete('images', img.filename)} className="p-2 bg-red-500 text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-white/60 font-mono text-xs">{formatSize(img.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-black border-2 border-orange-500/50 p-6">
        <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase mb-4 flex items-center gap-2"><Video className="w-5 h-5" /> Videos ({media.videos.length})</h3>
        {media.videos.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No videos uploaded yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.videos.map((vid) => (
              <div key={vid.filename} className="border border-orange-500/20 hover:border-orange-500/50 transition-colors p-4">
                <video src={`${BACKEND_URL}${vid.url}`} className="w-full aspect-video object-cover mb-3" controls />
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-white font-mono text-sm truncate">{vid.filename}</p>
                    <p className="text-white/40 font-mono text-xs">{formatSize(vid.size)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => copyUrl(vid.url)} className="p-2 text-orange-500 hover:bg-orange-500/20 transition-colors">
                      {copiedUrl === vid.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete('videos', vid.filename)} className="p-2 text-red-500 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Manager
function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/stats`).then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/stats`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stats) });
      alert('Stats saved!');
    } catch (err) { alert('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Stats</h2>
        <div className="flex gap-2">
          <button onClick={() => setStats([...stats, { label: 'New', value: '0', unit: 'UNIT' }])} className="flex items-center gap-2 px-4 py-2 border border-orange-500/30 text-white font-mono text-sm hover:border-orange-500"><Plus className="w-4 h-4" /> Add</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-black border-2 border-orange-500/50 p-4 space-y-3">
            <div className="flex justify-between"><span className="text-white/60 font-mono text-xs">#{i+1}</span><button onClick={() => setStats(stats.filter((_,idx) => idx !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
            <input placeholder="Label" value={stat.label} onChange={(e) => { const n = [...stats]; n[i].label = e.target.value; setStats(n); }} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" />
            <input placeholder="Value" value={stat.value} onChange={(e) => { const n = [...stats]; n[i].value = e.target.value; setStats(n); }} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" />
            <input placeholder="Unit" value={stat.unit} onChange={(e) => { const n = [...stats]; n[i].unit = e.target.value; setStats(n); }} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" />
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

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/quotes`).then(r => r.json()).then(setQuotes).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/quotes`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quotes) });
      alert('Saved!');
    } catch (err) { alert('Failed'); }
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Quotes ({quotes.length})</h2>
        <div className="flex gap-2">
          <button onClick={() => setQuotes([...quotes, { quote: '', author: '' }])} className="flex items-center gap-2 px-4 py-2 border border-orange-500/30 text-white font-mono text-sm"><Plus className="w-4 h-4" /> Add</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold"><Save className="w-4 h-4" /> Save</button>
        </div>
      </div>
      <div className="space-y-4">
        {quotes.map((q, i) => (
          <div key={i} className="bg-black border-2 border-orange-500/50 p-4">
            <div className="flex justify-between mb-2"><span className="text-white/60 font-mono text-xs">#{i+1}</span><button onClick={() => setQuotes(quotes.filter((_,idx) => idx !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
            <textarea placeholder="Quote..." value={q.quote} onChange={(e) => { const n = [...quotes]; n[i].quote = e.target.value; setQuotes(n); }} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm h-20 mb-2 resize-none" />
            <input placeholder="Author" value={q.author} onChange={(e) => { const n = [...quotes]; n[i].author = e.target.value; setQuotes(n); }} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Config Manager
function ConfigManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/config`).then(r => r.json()).then(setConfig).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
      if (res.ok) alert('Saved! Refresh to see changes.');
    } catch (err) { alert('Failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwStatus({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    if (pwForm.newPassword.length < 4) {
      setPwStatus({ type: 'error', msg: 'Password must be at least 4 characters' });
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      if (res.ok) {
        setPwStatus({ type: 'success', msg: 'Password changed successfully' });
        setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
        sessionStorage.removeItem('adminAuth');
      } else {
        const data = await res.json();
        setPwStatus({ type: 'error', msg: data.detail || 'Failed to change password' });
      }
    } catch (err) {
      setPwStatus({ type: 'error', msg: 'Connection error' });
    }
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Site Config</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border-2 border-orange-500/50 p-6 space-y-4">
          <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase">Basic Info</h3>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Site Name</label><input value={config.siteName || ''} onChange={(e) => setConfig({...config, siteName: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Owner Name</label><input value={config.ownerName || ''} onChange={(e) => setConfig({...config, ownerName: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Tagline</label><input value={config.tagline || ''} onChange={(e) => setConfig({...config, tagline: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
        </div>
        <div className="bg-black border-2 border-orange-500/50 p-6 space-y-4">
          <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase">HUD Display</h3>
          <div><label className="block text-white/60 font-mono text-xs mb-1">System ID</label><input value={config.systemId || ''} onChange={(e) => setConfig({...config, systemId: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Location</label><input value={config.location || ''} onChange={(e) => setConfig({...config, location: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Status</label><input value={config.status || ''} onChange={(e) => setConfig({...config, status: e.target.value})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
        </div>
      </div>
      <div className="bg-black border-2 border-orange-500/50 p-6 space-y-4">
        <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-white/60 font-mono text-xs mb-1">Email</label><input value={config.social?.email || ''} onChange={(e) => setConfig({...config, social: {...config.social, email: e.target.value}})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">LinkedIn</label><input value={config.social?.linkedin || ''} onChange={(e) => setConfig({...config, social: {...config.social, linkedin: e.target.value}})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">Instagram</label><input value={config.social?.instagram || ''} onChange={(e) => setConfig({...config, social: {...config.social, instagram: e.target.value}})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
          <div><label className="block text-white/60 font-mono text-xs mb-1">YouTube</label><input value={config.social?.youtube || ''} onChange={(e) => setConfig({...config, social: {...config.social, youtube: e.target.value}})} className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div>
        </div>
      </div>
      <div className="bg-black border-2 border-orange-500/50 p-6 space-y-4" data-testid="password-change-section">
        <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">Current Password</label>
            <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({...pwForm, currentPassword: e.target.value})} required className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" data-testid="current-password-input" />
          </div>
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({...pwForm, newPassword: e.target.value})} required className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" data-testid="new-password-input" />
          </div>
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({...pwForm, confirm: e.target.value})} required className="w-full bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" data-testid="confirm-password-input" />
          </div>
          <div className="md:col-span-3 flex items-center gap-4">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold hover:bg-orange-400 transition-colors" data-testid="change-password-btn"><Lock className="w-4 h-4" /> Change Password</button>
            {pwStatus.msg && <span className={`font-mono text-xs ${pwStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{pwStatus.msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

// Colors Manager
function ColorsManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/config`).then(r => r.json()).then(setConfig).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/config`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
      if (res.ok) {
        const c = config.colors || {};
        document.documentElement.style.setProperty('--primary', c.primary || '#FF4D00');
        document.documentElement.style.setProperty('--background', c.background || '#000000');
        alert('Saved and applied!');
      }
    } catch (err) { alert('Failed'); }
    finally { setSaving(false); }
  };

  const updateColor = (k, v) => setConfig({...config, colors: {...config.colors, [k]: v}});

  const presets = [
    { name: 'Iron Man', primary: '#FF4D00', background: '#000000' },
    { name: 'Cyberpunk', primary: '#00FFFF', background: '#0a0a0a' },
    { name: 'Matrix', primary: '#00FF00', background: '#000000' },
    { name: 'Purple', primary: '#9945FF', background: '#0a0a0a' },
    { name: 'Gold', primary: '#FFD700', background: '#1a1a1a' },
    { name: 'Ocean', primary: '#0099FF', background: '#0a1929' },
    { name: 'Pink', primary: '#FF1493', background: '#0a0a0a' },
    { name: 'Emerald', primary: '#50C878', background: '#0a1a0a' },
  ];

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;
  const colors = config.colors || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Colors</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-mono text-sm font-bold"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Apply'}</button>
      </div>
      <div className="bg-black border-2 border-orange-500/50 p-6">
        <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase mb-4">Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map(p => (
            <button key={p.name} onClick={() => setConfig({...config, colors: {...config.colors, primary: p.primary, background: p.background}})} className="p-3 border border-orange-500/20 hover:border-orange-500 transition-colors">
              <div className="flex gap-2 mb-2"><div className="w-4 h-4 rounded" style={{backgroundColor: p.primary}} /><div className="w-4 h-4 rounded border border-white/20" style={{backgroundColor: p.background}} /></div>
              <p className="text-white font-mono text-xs">{p.name}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border-2 border-orange-500/50 p-6 space-y-4">
          <h3 className="text-orange-500 font-['Rajdhani'] font-bold uppercase">Colors</h3>
          <div><label className="text-white/60 font-mono text-xs mb-2 block">Primary</label><div className="flex gap-3"><input type="color" value={colors.primary || '#FF4D00'} onChange={(e) => updateColor('primary', e.target.value)} className="w-12 h-10 bg-transparent border border-orange-500/30 cursor-pointer" /><input type="text" value={colors.primary || '#FF4D00'} onChange={(e) => updateColor('primary', e.target.value)} className="flex-1 bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div></div>
          <div><label className="text-white/60 font-mono text-xs mb-2 block">Background</label><div className="flex gap-3"><input type="color" value={colors.background || '#000000'} onChange={(e) => updateColor('background', e.target.value)} className="w-12 h-10 bg-transparent border border-orange-500/30 cursor-pointer" /><input type="text" value={colors.background || '#000000'} onChange={(e) => updateColor('background', e.target.value)} className="flex-1 bg-black border border-orange-500/30 px-3 py-2 text-white font-mono text-sm" /></div></div>
        </div>
        <div className="p-6" style={{backgroundColor: colors.background || '#000000', border: `2px solid ${colors.primary || '#FF4D00'}50`}}>
          <h3 style={{color: colors.primary || '#FF4D00'}} className="font-['Rajdhani'] font-bold uppercase mb-4">Preview</h3>
          <p className="text-white mb-4">Main text</p>
          <div className="flex gap-3"><button style={{backgroundColor: colors.primary, color: colors.background}} className="px-4 py-2 font-mono text-sm">Primary</button><button style={{border: `1px solid ${colors.primary}`, color: colors.primary}} className="px-4 py-2 font-mono text-sm">Secondary</button></div>
        </div>
      </div>
    </div>
  );
}

// Messages
function MessagesViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/contact`).then(r => r.json()).then(d => setMessages(d.reverse())).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Messages ({messages.length})</h2>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 border border-orange-500/30 text-white font-mono text-sm"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>
      {messages.length === 0 ? <p className="text-white/40 font-mono text-center py-8">No messages</p> : (
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={m.id || i} className="bg-black border-2 border-orange-500/50 p-4">
              <div className="flex justify-between mb-2"><div><p className="text-white font-['Rajdhani'] font-semibold">{m.name}</p><p className="text-orange-500 font-mono text-xs">{m.email}</p></div><span className="text-white/40 font-mono text-xs">{new Date(m.timestamp).toLocaleString()}</span></div>
              <p className="text-white/80 font-mono text-sm font-semibold mb-1">{m.subject}</p>
              <p className="text-white/60 font-mono text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [activeTab, setActiveTab] = useState('projects');

  if (!isAuthenticated) return <LoginForm onLogin={() => { setIsAuthenticated(true); sessionStorage.setItem('adminAuth', 'true'); }} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />;
      case 'skills': return <SkillsManager />;
      case 'media': return <MediaLibrary />;
      case 'stats': return <StatsManager />;
      case 'quotes': return <QuotesManager />;
      case 'config': return <ConfigManager />;
      case 'colors': return <ColorsManager />;
      case 'messages': return <MessagesViewer />;
      default: return <ProjectsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-black admin-page">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 text-orange-500" />
            <h1 className="font-['Rajdhani'] text-xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-white/60 font-mono text-sm hover:text-orange-500 transition-colors">View Site</a>
            <button onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('adminAuth'); }} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 font-mono text-sm hover:bg-orange-500/20 hover:border-orange-500 transition-all" data-testid="admin-logout-btn">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs - inside the same sticky container */}
        <div className="max-w-7xl mx-auto px-4 border-t border-orange-500/10">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`admin-tab-${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 text-black font-bold' 
                    : 'text-white/60 hover:text-orange-500 hover:bg-orange-500/5'
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
