'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/services/auth';
import { getPageContentByName, upsertPageContent } from '@/services/api';
import { 
  ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, 
  Mail, Globe, Phone, MessageSquare, Clock, Share2, HelpCircle
} from 'lucide-react';

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
    phone: '+94 77 123 4567',
    whatsappNumber: '+94 77 123 4567',
    whatsappUrl: 'https://wa.me/94771234567',
    hours: 'Mon – Fri | 9:00 AM – 6:00 PM',
  },
  socials: {
    linkedin: 'https://linkedin.com/company/sapirox',
    facebook: 'https://facebook.com/sapirox',
    github: 'https://github.com/sapirox',
  }
};

type ContactContent = typeof DEFAULT_CONTACT_CONTENT;

export default function AdminContactPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setCurrentUser(user);

      try {
        const data = await getPageContentByName('contact');
        if (data && data.content) {
          setContent({
            hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...(data.content.hero as any) },
            info: { ...DEFAULT_CONTACT_CONTENT.info, ...(data.content.info as any) },
            socials: { ...DEFAULT_CONTACT_CONTENT.socials, ...(data.content.socials as any) },
          });
        }
      } catch {
        // No saved record yet, fall back to defaults
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await upsertPageContent('contact', content as unknown as Record<string, unknown>);
      setMessage({ type: 'success', text: 'Contact page content saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Title */}
        <div className="premium-glass p-8 rounded-3xl border border-border">
          <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight font-heading">
            Contact Page Content Manager
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Customize headers, introduction text, WhatsApp channels, physical addresses, business hours, and social media platforms.
          </p>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ═══ HERO SECTION ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Hero & Introduction
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Section Tag Title</label>
              <input 
                type="text" 
                value={content.hero.sectionTitle} 
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, sectionTitle: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Title Part 1</label>
              <input 
                type="text" 
                value={content.hero.title} 
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Title Highlight</label>
              <input 
                type="text" 
                value={content.hero.titleHighlight} 
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Intro Subtitle Description</label>
            <textarea 
              rows={3} 
              value={content.hero.subtitle} 
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none text-muted-foreground" 
            />
          </div>
        </div>

        {/* ═══ CONTACT DETAILS ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Channels & Contact Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input 
                type="email" 
                value={content.info.email} 
                onChange={(e) => setContent({ ...content, info: { ...content.info, email: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" /> Office Location Address
              </label>
              <input 
                type="text" 
                value={content.info.location} 
                onChange={(e) => setContent({ ...content, info: { ...content.info, location: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Direct Phone Number
              </label>
              <input 
                type="text" 
                value={content.info.phone} 
                onChange={(e) => setContent({ ...content, info: { ...content.info, phone: e.target.value } })}
                placeholder="e.g. +94 77 123 4567"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Business Operations Hours
              </label>
              <input 
                type="text" 
                value={content.info.hours} 
                onChange={(e) => setContent({ ...content, info: { ...content.info, hours: e.target.value } })}
                placeholder="Mon – Fri | 9:00 AM – 6:00 PM"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
          </div>

          <div className="border-t border-border/40 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground">WhatsApp Setup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={content.info.whatsappNumber} 
                  onChange={(e) => setContent({ ...content, info: { ...content.info, whatsappNumber: e.target.value } })}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Direct WhatsApp Chat URL</label>
                <input 
                  type="text" 
                  value={content.info.whatsappUrl} 
                  onChange={(e) => setContent({ ...content, info: { ...content.info, whatsappUrl: e.target.value } })}
                  placeholder="e.g. https://wa.me/94771234567"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SOCIAL LINKS ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">LinkedIn</label>
              <input 
                type="text" 
                value={content.socials.linkedin} 
                onChange={(e) => setContent({ ...content, socials: { ...content.socials, linkedin: e.target.value } })}
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Facebook</label>
              <input 
                type="text" 
                value={content.socials.facebook} 
                onChange={(e) => setContent({ ...content, socials: { ...content.socials, facebook: e.target.value } })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub</label>
              <input 
                type="text" 
                value={content.socials.github} 
                onChange={(e) => setContent({ ...content, socials: { ...content.socials, github: e.target.value } })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Trigger */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
