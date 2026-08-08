'use client';

import React, { useState } from 'react';
import { submitContact } from '@/services/api';
import { Mail, Globe, Send, MessageSquare } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      await submitContact(formData);
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] py-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Background decorations */}
      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Info panel */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            Connect With Us
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 font-heading tracking-tight leading-tight">
            Let's Engineer Your <br />
            <span className="premium-gradient-text">Next System Architecture</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Tell us about your target deliverables, database constraints or design preferences. Our lead software engineers will evaluate and reply with a system layout proposal.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 w-fit">
              <Mail className="h-5 w-5 text-indigo-400" />
              <span>support@sapirox.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 w-fit">
              <Globe className="h-5 w-5 text-indigo-400" />
              <span>Colombo, Sri Lanka (Remote Worldwide Operations)</span>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="premium-glass p-8 rounded-3xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" /> Outline Your Project Goals
          </h2>
          
          {formStatus.type && (
            <div className={`p-4 rounded-xl mb-6 text-sm border ${
              formStatus.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  placeholder="john@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                placeholder="Enterprise web application project"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message *</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                placeholder="Briefly describe key user workflows or database schemas..."
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? 'Submitting Message...' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
