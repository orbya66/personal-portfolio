import React, { useState } from 'react';
import GlitchText from '../components/GlitchText';
import { Mail, Linkedin, Instagram, Youtube, Send } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'TRANSMITTING...' });

    try {
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      setStatus({ type: 'success', message: 'MESSAGE TRANSMITTED SUCCESSFULLY' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: 'TRANSMISSION FAILED - RETRY' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:contact@orbya.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <div className="min-h-screen pt-16 grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="mb-4">
            <span className="inline-block px-4 py-1 border border-[#FF4D00]/50 bg-black/50 backdrop-blur-sm text-[#FF4D00] font-mono text-xs tracking-widest">
              COMMS_CHANNEL: OPEN
            </span>
          </div>
          <h1 className="font-['Rajdhani'] text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white mb-4">
            <GlitchText text="COMMUNICATIONS" />
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl mx-auto">
            Establish secure connection for project inquiries and collaborations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="hud-frame p-8 bg-black/50 backdrop-blur-sm">
              <div className="hud-content">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#FF4D00] font-mono text-xs tracking-widest mb-2">
                        NAME
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-[#FF4D00]/30 focus:border-[#FF4D00] px-4 py-3 text-white font-mono text-sm outline-none transition-colors"
                        placeholder="Enter name..."
                        data-testid="contact-name-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[#FF4D00] font-mono text-xs tracking-widest mb-2">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/50 border border-[#FF4D00]/30 focus:border-[#FF4D00] px-4 py-3 text-white font-mono text-sm outline-none transition-colors"
                        placeholder="Enter email..."
                        data-testid="contact-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#FF4D00] font-mono text-xs tracking-widest mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-[#FF4D00]/30 focus:border-[#FF4D00] px-4 py-3 text-white font-mono text-sm outline-none transition-colors"
                      placeholder="Enter subject..."
                      data-testid="contact-subject-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FF4D00] font-mono text-xs tracking-widest mb-2">
                      MESSAGE
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-black/50 border border-[#FF4D00]/30 focus:border-[#FF4D00] px-4 py-3 text-white font-mono text-sm outline-none resize-none transition-colors"
                      placeholder="Enter message..."
                      data-testid="contact-message-input"
                    />
                  </div>

                  {status.message && (
                    <div
                      className={`p-4 border font-mono text-xs tracking-wider transition-opacity duration-300 ${
                        status.type === 'success'
                          ? 'border-[#00FF00] text-[#00FF00] bg-[#00FF00]/10'
                          : status.type === 'error'
                          ? 'border-red-500 text-red-500 bg-red-500/10'
                          : 'border-[#FF4D00] text-[#FF4D00] bg-[#FF4D00]/10'
                      }`}
                      data-testid="contact-status-message"
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    className="relative group w-full flex items-center justify-center gap-3 px-8 py-4 bg-black/50 border-2 border-[#FF4D00] text-[#FF4D00] font-['Rajdhani'] font-bold text-lg tracking-wider uppercase hover:bg-[#FF4D00] hover:text-black transition-all duration-300 disabled:opacity-50"
                    data-testid="contact-submit-btn"
                  >
                    <Send className="w-5 h-5" strokeWidth={2} />
                    <span>{status.type === 'loading' ? 'TRANSMITTING...' : 'SEND MESSAGE'}</span>
                    
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF4D00]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF4D00]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF4D00]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF4D00]" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="hud-frame p-6 bg-black/50 backdrop-blur-sm">
              <div className="hud-content">
                <h3 className="text-[#FF4D00] font-['Rajdhani'] text-xl font-bold tracking-wide uppercase mb-4">
                  Social Channels
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-[#FF4D00]/30 hover:border-[#FF4D00] hover:bg-[#FF4D00]/10 transition-all group"
                    >
                      <link.icon className="w-5 h-5 text-[#FF4D00]" strokeWidth={1.5} />
                      <span className="text-white font-mono text-sm group-hover:text-[#FF4D00] transition-colors">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hud-frame p-6 bg-black/50 backdrop-blur-sm">
              <div className="hud-content">
                <h3 className="text-[#FF4D00] font-['Rajdhani'] text-xl font-bold tracking-wide uppercase mb-4">
                  Response Protocol
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#FF4D00] mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-white font-mono">Standard Response</p>
                      <p className="text-white/50 font-mono text-xs">24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#FF4D00] mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-white font-mono">Priority Projects</p>
                      <p className="text-white/50 font-mono text-xs">12-24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#FF4D00] mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-white font-mono">Emergency Support</p>
                      <p className="text-white/50 font-mono text-xs">Contact directly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hud-frame p-6 bg-black/50 backdrop-blur-sm">
              <div className="hud-content">
                <h3 className="text-[#FF4D00] font-['Rajdhani'] text-xl font-bold tracking-wide uppercase mb-4">
                  Availability
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-[#00FF00] rounded-full animate-pulse" />
                  <span className="text-white font-mono text-sm">Currently Available</span>
                </div>
                <p className="text-white/50 font-mono text-xs">
                  Open to new projects and collaborations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
