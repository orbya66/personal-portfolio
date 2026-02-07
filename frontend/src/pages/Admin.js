import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Settings, Palette, BarChart3, MessageSquare, 
  Plus, Trash2, Edit2, Save, X, RefreshCw,
  LogOut, Quote, Briefcase, Zap, Upload, Image, Video, Copy, Check, ChevronDown
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

// Custom Select/Dropdown Component
function CategorySelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

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
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm hover:border-[var(--primary)] transition-colors"
      >
        <span className={value ? 'text-white' : 'text-white/40'}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--primary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-black border border-[var(--primary)]/30 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3 py-2 font-mono text-sm hover:bg-[var(--primary)]/20 transition-colors ${value === opt ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'text-white'}`}
            >
              {opt}
            </button>
          ))}
          
          {showNewInput ? (
            <div className="p-2 border-t border-[var(--primary)]/20">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name..."
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-2 py-1 text-white font-mono text-sm mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="flex-1 px-2 py-1 bg-[var(--primary)] text-black font-mono text-xs"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewInput(false)}
                  className="px-2 py-1 border border-[var(--primary)]/30 text-white font-mono text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewInput(true)}
              className="w-full text-left px-3 py-2 font-mono text-sm text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors border-t border-[var(--primary)]/20"
            >
              <Plus className="w-3 h-3 inline mr-2" />
              Add New Category
            </button>
          )}
        </div>
      )}
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
        <div className="border-2 border-[var(--primary)]/30 p-8 bg-black/50">
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
              className="w-full py-3 bg-[var(--primary)] text-black font-['Rajdhani'] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50"
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
  );
}

// File Upload Component
function FileUploader({ onUpload, accept = "image/*,video/*" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onUpload(data);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
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
        className="flex items-center gap-2 px-3 py-2 border border-[var(--primary)]/30 text-[var(--primary)] font-mono text-sm hover:bg-[var(--primary)]/10 transition-colors disabled:opacity-50"
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
}

// Projects Manager - Fixed
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

  // Get unique categories from existing projects
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
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
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

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowAdd(true); setEditForm(newProject); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm hover:opacity-80 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/80">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Title *</label>
                <input
                  placeholder="Project title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Category *</label>
                <CategorySelect
                  value={editForm.category || ''}
                  onChange={(cat) => setEditForm({...editForm, category: cat})}
                  options={existingCategories}
                  placeholder="Select or add category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Thumbnail URL</label>
                <div className="flex gap-2">
                  <input
                    placeholder="https://... or upload"
                    value={editForm.thumbnail || ''}
                    onChange={(e) => setEditForm({...editForm, thumbnail: e.target.value})}
                    className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                  />
                  <FileUploader accept="image/*" onUpload={(data) => handleFileUpload(data, 'thumbnail')} />
                </div>
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Video URL (YouTube/Vimeo/MP4/Drive)</label>
                <div className="flex gap-2">
                  <input
                    placeholder="https://... or upload"
                    value={editForm.videoUrl || ''}
                    onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})}
                    className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                  />
                  <FileUploader accept="video/*" onUpload={(data) => handleFileUpload(data, 'videoUrl')} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Year</label>
                <input
                  type="number"
                  placeholder="2024"
                  value={editForm.year || ''}
                  onChange={(e) => setEditForm({...editForm, year: parseInt(e.target.value) || ''})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Aspect Ratio</label>
                <select
                  value={editForm.aspectRatio || '16:9'}
                  onChange={(e) => setEditForm({...editForm, aspectRatio: e.target.value})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
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
              <label className="block text-white/60 font-mono text-xs mb-1">Description</label>
              <textarea
                placeholder="Project description..."
                value={editForm.description || ''}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20 focus:border-[var(--primary)] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Tags (comma-separated)</label>
              <input
                placeholder="motion graphics, cinematic, vfx"
                value={(editForm.tags || []).join(', ')}
                onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-white font-mono text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.featured || false}
                onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                className="w-4 h-4 accent-[var(--primary)]"
              />
              Featured Project (shows on homepage)
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSave(editForm)}
                disabled={!editForm.title || !editForm.category}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-black font-mono text-sm hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> 
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Project'}
              </button>
              <button
                onClick={() => { setEditingId(null); setShowAdd(false); setEditForm({}); }}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm hover:border-[var(--primary)] transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
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
          <div key={project.id} className="flex items-center gap-4 p-4 bg-black/50 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-colors">
            {project.thumbnail && (
              <img src={project.thumbnail} alt="" className="w-20 h-12 object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-['Rajdhani'] font-semibold truncate">{project.title}</p>
                {project.featured && (
                  <span className="px-2 py-0.5 bg-[var(--primary)] text-black font-mono text-xs shrink-0">FEATURED</span>
                )}
              </div>
              <p className="text-[var(--primary)] font-mono text-xs mt-1">{project.category} • {project.year}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setEditingId(project.id); setEditForm(project); setShowAdd(false); }}
                className="p-2 text-white/60 hover:text-[var(--primary)] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-white/60 hover:text-red-500 transition-colors"
                title="Delete"
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

// Skills Manager - Fixed
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

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
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
        <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/80">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">
            {editingId ? 'Edit Skill' : 'New Skill'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Skill Name</label>
                <input
                  placeholder="After Effects"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">Category</label>
                <select
                  value={editForm.category || 'software'}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
                >
                  <option value="software">Software</option>
                  <option value="creative">Creative</option>
                  <option value="tools">Tools</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Proficiency: {editForm.level || 80}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editForm.level || 80}
                onChange={(e) => setEditForm({...editForm, level: parseInt(e.target.value)})}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Module Name</label>
              <input
                placeholder="AE_MODULE_V2.0"
                value={editForm.module || ''}
                onChange={(e) => setEditForm({...editForm, module: e.target.value})}
                className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm focus:border-[var(--primary)] outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave(editForm)}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-black font-mono text-sm"
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

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-4 p-4 bg-black/50 border border-[var(--primary)]/20">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-white font-['Rajdhani'] font-semibold">{skill.name}</p>
                <span className="px-2 py-0.5 bg-[var(--primary)]/20 text-[var(--primary)] font-mono text-xs">{skill.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 max-w-xs h-2 bg-white/10">
                  <div className="h-full bg-[var(--primary)]" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-white/60 font-mono text-xs">{skill.level}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(skill.id); setEditForm(skill); }} className="p-2 text-white/60 hover:text-[var(--primary)]">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 text-white/60 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
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

  const handleUpload = (data) => {
    fetchMedia();
  };

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
    const fullUrl = `${BACKEND_URL}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Media Library</h2>
        <FileUploader onUpload={handleUpload} />
      </div>

      {/* Images */}
      <div>
        <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" /> Images ({media.images.length})
        </h3>
        {media.images.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No images uploaded</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.images.map((img) => (
              <div key={img.filename} className="group relative border border-[var(--primary)]/20 bg-black/50">
                <img src={`${BACKEND_URL}${img.url}`} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button onClick={() => copyUrl(img.url)} className="p-2 bg-[var(--primary)] text-black">
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

      {/* Videos */}
      <div>
        <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4 flex items-center gap-2">
          <Video className="w-5 h-5" /> Videos ({media.videos.length})
        </h3>
        {media.videos.length === 0 ? (
          <p className="text-white/40 font-mono text-sm">No videos uploaded</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.videos.map((vid) => (
              <div key={vid.filename} className="border border-[var(--primary)]/20 bg-black/50 p-4">
                <video src={`${BACKEND_URL}${vid.url}`} className="w-full aspect-video object-cover mb-3" controls />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-mono text-sm truncate">{vid.filename}</p>
                    <p className="text-white/40 font-mono text-xs">{formatSize(vid.size)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(vid.url)} className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/20">
                      {copiedUrl === vid.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete('videos', vid.filename)} className="p-2 text-red-500 hover:bg-red-500/20">
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

// Stats Manager - Fixed
function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      await fetch(`${BACKEND_URL}/api/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
      alert('Stats saved!');
    } catch (err) {
      console.error('Error saving stats:', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Portfolio Stats</h2>
        <div className="flex gap-2">
          <button onClick={() => setStats([...stats, { label: 'New', value: '0', unit: 'UNIT' }])} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="border-2 border-[var(--primary)]/30 p-4 bg-black/50">
            <div className="flex justify-between mb-3">
              <span className="text-white/60 font-mono text-xs">Stat #{index + 1}</span>
              <button onClick={() => setStats(stats.filter((_, i) => i !== index))} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input placeholder="Label" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm mb-2" />
            <input placeholder="Value" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm mb-2" />
            <input placeholder="Unit" value={stat.unit} onChange={(e) => updateStat(index, 'unit', e.target.value)} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Quotes Manager - Fixed
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

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Quotes ({quotes.length})</h2>
        <div className="flex gap-2">
          <button onClick={() => setQuotes([...quotes, { quote: '', author: '' }])} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {quotes.map((quote, index) => (
          <div key={index} className="border-2 border-[var(--primary)]/30 p-4 bg-black/50">
            <div className="flex justify-between mb-2">
              <span className="text-white/60 font-mono text-xs">Quote #{index + 1}</span>
              <button onClick={() => setQuotes(quotes.filter((_, i) => i !== index))} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              placeholder="Quote text..."
              value={quote.quote}
              onChange={(e) => {
                const newQuotes = [...quotes];
                newQuotes[index] = { ...newQuotes[index], quote: e.target.value };
                setQuotes(newQuotes);
              }}
              className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20 mb-2 resize-none"
            />
            <input
              placeholder="Author"
              value={quote.author}
              onChange={(e) => {
                const newQuotes = [...quotes];
                newQuotes[index] = { ...newQuotes[index], author: e.target.value };
                setQuotes(newQuotes);
              }}
              className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Site Config Manager - Fixed save functionality
function ConfigManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        alert('Config saved! Refresh to see changes.');
      } else {
        alert('Failed to save config');
      }
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Site Configuration</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/50">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">Basic Info</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Site Name</label>
              <input value={config.siteName || ''} onChange={(e) => setConfig({...config, siteName: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Owner Name</label>
              <input value={config.ownerName || ''} onChange={(e) => setConfig({...config, ownerName: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Tagline</label>
              <input value={config.tagline || ''} onChange={(e) => setConfig({...config, tagline: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Description</label>
              <textarea value={config.description || ''} onChange={(e) => setConfig({...config, description: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm h-20 resize-none" />
            </div>
          </div>
        </div>

        <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/50">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">HUD Display</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">System ID</label>
              <input value={config.systemId || ''} onChange={(e) => setConfig({...config, systemId: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Location</label>
              <input value={config.location || ''} onChange={(e) => setConfig({...config, location: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Status</label>
              <input value={config.status || ''} onChange={(e) => setConfig({...config, status: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
            <div>
              <label className="block text-white/60 font-mono text-xs mb-1">Availability</label>
              <input value={config.availability || ''} onChange={(e) => setConfig({...config, availability: e.target.value})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/50">
        <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">Email</label>
            <input value={config.social?.email || ''} onChange={(e) => setConfig({...config, social: {...config.social, email: e.target.value}})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">LinkedIn</label>
            <input value={config.social?.linkedin || ''} onChange={(e) => setConfig({...config, social: {...config.social, linkedin: e.target.value}})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">Instagram</label>
            <input value={config.social?.instagram || ''} onChange={(e) => setConfig({...config, social: {...config.social, instagram: e.target.value}})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
          <div>
            <label className="block text-white/60 font-mono text-xs mb-1">YouTube</label>
            <input value={config.social?.youtube || ''} onChange={(e) => setConfig({...config, social: {...config.social, youtube: e.target.value}})} className="w-full bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Colors Manager - Fixed save functionality
function ColorsManager() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        // Apply colors immediately
        const colors = config.colors || {};
        document.documentElement.style.setProperty('--primary', colors.primary || '#FF4D00');
        document.documentElement.style.setProperty('--background', colors.background || '#000000');
        document.documentElement.style.setProperty('--text', colors.text || '#FFFFFF');
        alert('Colors saved and applied!');
      }
    } catch (err) {
      console.error('Error saving colors:', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (key, value) => {
    setConfig({
      ...config,
      colors: { ...config.colors, [key]: value }
    });
  };

  const presetThemes = [
    { name: 'Iron Man', primary: '#FF4D00', background: '#000000', text: '#FFFFFF' },
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
      colors: { ...config.colors, primary: preset.primary, background: preset.background, text: preset.text }
    });
  };

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  const colors = config.colors || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Color Theme</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black font-mono text-sm">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Apply'}
        </button>
      </div>

      <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/50">
        <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-[var(--primary)]/30 p-6 bg-black/50">
          <h3 className="text-[var(--primary)] font-['Rajdhani'] font-bold uppercase mb-4">Main Colors</h3>
          <div className="space-y-4">
            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Primary (Accent)</label>
              <div className="flex gap-3">
                <input type="color" value={colors.primary || '#FF4D00'} onChange={(e) => updateColor('primary', e.target.value)} className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer" />
                <input type="text" value={colors.primary || '#FF4D00'} onChange={(e) => updateColor('primary', e.target.value)} className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Background</label>
              <div className="flex gap-3">
                <input type="color" value={colors.background || '#000000'} onChange={(e) => updateColor('background', e.target.value)} className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer" />
                <input type="text" value={colors.background || '#000000'} onChange={(e) => updateColor('background', e.target.value)} className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="text-white/60 font-mono text-xs mb-2 block">Text</label>
              <div className="flex gap-3">
                <input type="color" value={colors.text || '#FFFFFF'} onChange={(e) => updateColor('text', e.target.value)} className="w-12 h-10 bg-transparent border border-[var(--primary)]/30 cursor-pointer" />
                <input type="text" value={colors.text || '#FFFFFF'} onChange={(e) => updateColor('text', e.target.value)} className="flex-1 bg-black/50 border border-[var(--primary)]/30 px-3 py-2 text-white font-mono text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-[var(--primary)]/30 p-6" style={{ backgroundColor: colors.background || '#000000' }}>
          <h3 style={{ color: colors.primary || '#FF4D00' }} className="font-['Rajdhani'] font-bold uppercase mb-4">Live Preview</h3>
          <p style={{ color: colors.text || '#FFFFFF' }} className="mb-2">This is main text.</p>
          <p style={{ color: `${colors.text}99` || 'rgba(255,255,255,0.6)' }} className="text-sm mb-4">This is muted text.</p>
          <div className="flex gap-3">
            <button style={{ backgroundColor: colors.primary, color: colors.background }} className="px-4 py-2 font-mono text-sm">Primary</button>
            <button style={{ borderColor: colors.primary, color: colors.primary }} className="px-4 py-2 font-mono text-sm border">Secondary</button>
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
      setMessages(data.reverse());
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  if (loading) return <div className="text-center py-8"><RefreshCw className="w-8 h-8 text-[var(--primary)] animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-['Rajdhani'] font-bold text-white uppercase">Messages ({messages.length})</h2>
        <button onClick={fetchMessages} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="text-white/40 font-mono text-center py-8">No messages yet</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={msg.id || index} className="border-2 border-[var(--primary)]/30 p-4 bg-black/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-['Rajdhani'] font-semibold">{msg.name}</p>
                  <p className="text-[var(--primary)] font-mono text-xs">{msg.email}</p>
                </div>
                <span className="text-white/40 font-mono text-xs">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-white/80 font-mono text-sm font-semibold mb-1">{msg.subject}</p>
              <p className="text-white/60 font-mono text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin Component
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [activeTab, setActiveTab] = useState('projects');

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

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
    <div className="min-h-screen bg-black grid-pattern pt-16">
      {/* Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/95 border-b border-[var(--primary)]/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 text-[var(--primary)]" />
            <h1 className="font-['Rajdhani'] text-xl font-bold text-white uppercase tracking-wider">Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-[var(--primary)]/30 text-white font-mono text-sm hover:border-[var(--primary)]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="fixed top-[108px] left-0 right-0 z-30 bg-black/95 border-b border-[var(--primary)]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-[var(--primary)] text-black' : 'text-white/60 hover:text-[var(--primary)]'
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
      <div className="max-w-7xl mx-auto px-4 pt-36 pb-12">
        {renderContent()}
      </div>
    </div>
  );
}
