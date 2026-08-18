'use client';

import React, { useState, useEffect } from 'react';
import { submitContact, getPageContentByName } from '@/services/api';
import { 
  Mail, Globe, Send, MessageSquare, Phone, Clock, 
  MessageCircle 
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const PROJECT_TYPE_OPTIONS = [
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Mobile Application', label: 'Mobile Application' },
  { value: 'POS / Business System', label: 'POS / Business System' },
  { value: 'SaaS Product', label: 'SaaS Product' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Custom Software', label: 'Custom Software' },
  { value: 'Other', label: 'Other' },
];

const DEFAULT_CONTACT_CONTENT = {
  hero: {
    sectionTitle: 'Connect With Us',
    title: "Let's Engineer Your",
    titleHighlight: 'Next System Architecture',
    subtitle: 'Tell us about your target deliverables, database constraints or design preferences. Our lead software engineers will evaluate and reply with a system layout proposal.',
  },
  info: {
    email: 'support@sapirox.com',
    location: 'Colombo, Sri Lanka (Remote Worldwide Operations)',
    phone: '',
    whatsappNumber: '',
    whatsappUrl: '',
    hours: 'Mon – Fri | 9:00 AM – 6:00 PM',
  },
  socials: {
    linkedin: '',
    facebook: '',
    github: '',
  }
};

type ContactContent = typeof DEFAULT_CONTACT_CONTENT;

export default function ContactClient() {
  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    company: '', 
    projectType: 'Web Application', 
    subject: '', 
    message: '' 
  });
  const [agreed, setAgreed] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getPageContentByName('contact');
        if (data && data.content) {
          setContent({
            hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...(data.content.hero as any) },
            info: { ...DEFAULT_CONTACT_CONTENT.info, ...(data.content.info as any) },
            socials: { ...DEFAULT_CONTACT_CONTENT.socials, ...(data.content.socials as any) },
          });
        }
      } catch (err) {
        // Fall back silently
      }
    }
    loadContent();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (!agreed) {
      setFormStatus({ type: 'error', message: 'You must agree to the privacy policy to submit this form.' });
      return;
    }
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        projectType: formData.projectType,
        subject: formData.subject || `Inquiry: ${formData.projectType}`,
        message: formData.message,
      });
      setFormStatus({ type: 'success', message: 'Thank you! Your inquiry has been sent successfully. Our team will review it and get back to you shortly.' });
      setFormData({ 
        name: '', 
        email: '', 
        company: '', 
        projectType: 'Web Application', 
        subject: '', 
        message: '' 
      });
      setAgreed(false);
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Background decorations */}
      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info panel - 5 Columns */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              {content.hero.sectionTitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mt-6 mb-6 font-heading tracking-tight leading-tight">
              {content.hero.title} <br />
              <span className="premium-gradient-text">{content.hero.titleHighlight}</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              {content.hero.subtitle}
            </p>
          </div>

          {/* Consolidated Contact Details Card */}
          <div className="premium-glass p-8 rounded-3xl border border-border shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-foreground tracking-wide border-b border-border/40 pb-3">Get in Touch</h3>
            
            <div className="space-y-4">
              {/* Email */}
              {content.info.email && (
                <div className="flex items-center gap-4 py-1 border-b border-border/20 last:border-0 pb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Email</h4>
                    <a href={`mailto:${content.info.email}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {content.info.email}
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {(content.info.whatsappNumber || content.info.whatsappUrl) && (
                <div className="flex items-center justify-between py-1 border-b border-border/20 last:border-0 pb-3 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">WhatsApp</h4>
                      <span className="text-sm font-semibold text-foreground">Direct Chat Line</span>
                    </div>
                  </div>
                  <a 
                    href={content.info.whatsappUrl || (content.info.whatsappNumber ? `https://wa.me/${content.info.whatsappNumber.replace(/[^\d]/g, '')}` : '#')}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all duration-300 shadow-md shadow-emerald-600/10 hover:scale-105"
                  >
                    Chat
                  </a>
                </div>
              )}

              {/* Phone */}
              {content.info.phone && (
                <div className="flex items-center justify-between py-1 border-b border-border/20 last:border-0 pb-3 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Phone Number</h4>
                      <span className="text-sm font-semibold text-foreground">{content.info.phone}</span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${content.info.phone}`} 
                    className="px-4 py-2 rounded-xl bg-primary/15 text-primary hover:bg-primary/20 text-xs font-bold transition-all duration-300 shadow-md shadow-primary/5 hover:scale-105"
                  >
                    Call
                  </a>
                </div>
              )}

              {/* Business Hours */}
              {content.info.hours && (
                <div className="flex items-center gap-4 py-1 border-b border-border/20 last:border-0 pb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Business Hours</h4>
                    <span className="text-sm font-semibold text-foreground">{content.info.hours}</span>
                  </div>
                </div>
              )}

              {/* Location */}
              {content.info.location && (
                <div className="flex items-center gap-4 py-1 border-b border-border/20 last:border-0 pb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Location</h4>
                    <span className="text-sm text-muted-foreground">{content.info.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links inside the unified card */}
            {(content.socials.linkedin || content.socials.facebook || content.socials.github) && (
              <div className="pt-5 border-t border-border/60">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Connect Socially</h4>
                <div className="flex items-center gap-3">
                  {content.socials.linkedin && (
                    <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border hover:scale-105 transition-all">
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {content.socials.facebook && (
                    <a href={content.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border hover:scale-105 transition-all">
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  )}
                  {content.socials.github && (
                    <a href={content.socials.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border hover:scale-105 transition-all">
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Panel - 7 Columns */}
        <div className="lg:col-span-7 premium-glass p-8 md:p-10 rounded-3xl border border-border shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Project Inquiry Form
          </h2>
          
          {formStatus.type && (
            <div className={`p-4 rounded-xl mb-6 text-sm border ${
              formStatus.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-650 dark:text-rose-400'
            }`}>
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                  placeholder="e.g. john@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company (Optional)</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                  placeholder="e.g. Sapirox Technologies"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Type *</label>
                <CustomSelect
                  options={PROJECT_TYPE_OPTIONS}
                  value={formData.projectType}
                  onChange={(val) => setFormData({ ...formData, projectType: val })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                placeholder="e.g. Enterprise web portal deployment"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message *</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300 resize-none"
                placeholder="Briefly describe key user workflows, layouts, or data requirements..."
              />
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="flex items-start gap-3 select-none bg-muted/40 p-4 rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-300">
              <input 
                type="checkbox" 
                id="privacy-consent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-primary bg-background focus:ring-primary/30 cursor-pointer accent-primary"
              />
              <label htmlFor="privacy-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors">
                I agree to the Privacy Policy and consent to Sapirox processing my information to respond to this inquiry.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !agreed}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-30 transition-all duration-300 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              {isSubmitting ? 'Submitting Message...' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
