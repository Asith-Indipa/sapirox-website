'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Globe, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSeoSettingsByPath, upsertSeoSetting, SEOSetting } from '@/services/api';

const AVAILABLE_PATHS = [
  { path: '/', label: 'Home Page' },
  { path: '/services', label: 'Services Listing' },
  { path: '/products', label: 'Products Listing' },
  { path: '/portfolio', label: 'Portfolio Listing' },
  { path: '/blog', label: 'Engineering Blog' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' }
];

export default function SeoSettingsPage() {
  const [selectedPath, setSelectedPath] = useState('/');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [schemaMarkupText, setSchemaMarkupText] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing settings when path changes
  useEffect(() => {
    async function loadSeoSetting() {
      setLoading(true);
      setMessage(null);
      try {
        const data = await getSeoSettingsByPath(selectedPath);
        if (data) {
          setMetaTitle(data.metaTitle || '');
          setMetaDescription(data.metaDescription || '');
          setKeywordsText(data.keywords ? data.keywords.join(', ') : '');
          setOgTitle(data.ogTitle || '');
          setOgDescription(data.ogDescription || '');
          setOgImage(data.ogImage || '');
          setSchemaMarkupText(data.schemaMarkup ? JSON.stringify(data.schemaMarkup, null, 2) : '');
        }
      } catch {
        // If not found, reset form for new entry
        setMetaTitle('');
        setMetaDescription('');
        setKeywordsText('');
        setOgTitle('');
        setOgDescription('');
        setOgImage('');
        setSchemaMarkupText('');
      } finally {
        setLoading(false);
      }
    }
    loadSeoSetting();
  }, [selectedPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validate Schema Markup if present
    let schemaMarkupObj = null;
    if (schemaMarkupText.trim()) {
      try {
        schemaMarkupObj = JSON.parse(schemaMarkupText);
      } catch {
        setMessage({ type: 'error', text: 'Invalid JSON format in Custom Schema Markup field.' });
        setSaving(false);
        return;
      }
    }

    const payload: SEOSetting = {
      pagePath: selectedPath,
      metaTitle,
      metaDescription,
      keywords: keywordsText.split(',').map(k => k.trim()).filter(Boolean),
      ogTitle: ogTitle || undefined,
      ogDescription: ogDescription || undefined,
      ogImage: ogImage || undefined,
      schemaMarkup: schemaMarkupObj || undefined
    };

    try {
      await upsertSeoSetting(payload);
      setMessage({ type: 'success', text: 'SEO settings successfully updated!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to update SEO settings.' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen text-foreground py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-muted-foreground">Google SEO Search Meta Configurator</span>
          </div>
        </div>

        {/* Intro */}
        <div className="premium-glass p-8 rounded-3xl border border-border mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight font-heading">
            SEO Settings Control Panel
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Manage metadata, keywords, and JSON-LD schema tags for core public routes dynamically. 
            Search engine bots read these parameters to index metadata and show previews in Google Search, Slack, Facebook and WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Path Selector */}
          <div className="premium-glass p-8 rounded-3xl border border-border space-y-4">
            <label className="block text-sm font-bold text-foreground">Target Public Page Path</label>
            <select
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
            >
              {AVAILABLE_PATHS.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label} ({item.path})
                </option>
              ))}
            </select>
            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Select the public route you want to update. System autofills values if metadata is already customized.</span>
            </div>
          </div>

          {/* Feedback Messages */}
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

          {loading ? (
            <div className="premium-glass p-12 rounded-3xl border border-border flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2" />
              <span className="ml-3 text-sm text-muted-foreground">Loading page metadata config...</span>
            </div>
          ) : (
            <>
              {/* Meta Tags */}
              <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">Standard HTML Meta Tags</h2>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Title Tag</label>
                  <input
                    type="text"
                    required
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Sapirox | Premium Enterprise Software Solutions"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/45 focus:outline-none focus:border-primary text-sm transition-colors"
                  />
                  <span className="text-[11px] text-muted-foreground/60 block">Recommended length: 50-60 characters. Current: {metaTitle.length}</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description Tag</label>
                  <textarea
                    required
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="We engineer secure, high-concurrency custom systems, databases, cloud native structures and startup templates..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/45 focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                  />
                  <span className="text-[11px] text-muted-foreground/60 block">Recommended length: 150-160 characters. Current: {metaDescription.length}</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    placeholder="software, cloud engineering, tech startup, erp solutions"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/45 focus:outline-none focus:border-primary text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Social Open Graph */}
              <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">Open Graph Settings (Social Sharing)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">OG Title</label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Sapirox - IT Partner"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">OG Share Image (URL)</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://sapirox.com/og-banner.png"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">OG Description</label>
                  <textarea
                    rows={2}
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder="Preview summary text when link is shared in WhatsApp or Facebook..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                  />
                </div>
              </div>

              {/* JSON-LD Custom Schema */}
              <div className="premium-glass p-8 rounded-3xl border border-border space-y-4">
                <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">Custom JSON-LD Schema Markup</h2>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Structured Data (Raw JSON)</label>
                  <textarea
                    rows={8}
                    value={schemaMarkupText}
                    onChange={(e) => setSchemaMarkupText(e.target.value)}
                    placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "Sapirox"\n}`}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground font-mono placeholder-muted-foreground/40 focus:outline-none focus:border-primary text-xs transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-3 rounded-xl border border-border bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
