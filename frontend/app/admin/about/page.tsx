'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User } from '@/services/auth';
import { getPageContentByName, upsertPageContent, uploadImage } from '@/services/api';
import { 
  ArrowLeft, Save, Loader2, X, Plus, CheckCircle2, AlertCircle, 
  BookOpen, Target, Eye, Cpu, MessageSquare, Layers, HeartHandshake,
  Upload, Image as ImageIcon
} from 'lucide-react';

// ── Default Data (fallback when no DB record exists) ────────────────────────
const DEFAULT_ABOUT_CONTENT = {
  hero: {
    title: 'We Build Custom',
    titleHighlight: 'Software that Empowers',
    subtitle: 'A founder-led software development studio. We bypass corporate layers and bureaucracy to build premium, secure, and scalable digital solutions directly for our partners.',
  },
  story: {
    paragraph1: 'We noticed a persistent problem in the software industry: traditional agencies often introduce heavy overhead, project managers who act as filters, and rigid structures that dilute your actual product vision.',
    paragraph2: 'Sapirox was founded to bridge that gap. We connect our clients directly with the builders, focusing purely on clean code, solid performance, and transparent collaboration. We build practical software that solves real business problems and scales with you.',
  },
  mission: 'To deliver high-performance, secure, and custom-tailored software solutions that empower modern businesses to operate efficiently, build competitive advantages, and scale gracefully.',
  vision: 'To become the go-to software engineering partner for growing businesses and startups by continuously leveraging modern architectures and delivering exceptional product quality.',
  trustPoints: [
    { title: 'Custom Solutions', desc: 'No generic templates or cookie-cutter builders. Every application is built specifically to address your unique workflow and business goals.' },
    { title: 'Transparent Communication', desc: 'You collaborate directly with the engineers writing your code, eliminating middlemen, misunderstandings, and unnecessary project delays.' },
    { title: 'Scalable Architecture', desc: 'We design robust, high-performance systems prepared for future growth and high concurrency using clean coding principles.' },
    { title: 'Long-term Support', desc: 'Our relationship doesn\'t end at deployment. We provide dedicated support, maintenance, and iterative updates to keep your systems running smoothly.' },
  ],
  workflowSteps: [
    { number: '01', title: 'Discover', desc: 'We sit down to understand your business goals, target audience, and functional requirements.' },
    { number: '02', title: 'Design', desc: 'Architecting the system design, secure database schema, and interactive UI/UX prototypes.' },
    { number: '03', title: 'Develop', desc: 'Writing clean, modular, and optimized code using modern, maintainable software practices.' },
    { number: '04', title: 'Test', desc: 'Conducting rigorous testing for security, responsiveness, bugs, and performance under load.' },
    { number: '05', title: 'Deploy', desc: 'Configuring secure servers, cloud pipelines, and launching your platform smoothly to production.' },
    { number: '06', title: 'Support', desc: 'Providing ongoing maintenance, monitoring, and updates to keep your systems running flawlessly.' },
  ],
  team: [
    { name: 'Sahan Perera', role: 'Founder & Software Engineer', bio: 'Focuses on high-level system designs, cloud-native scalability, and database architecture.', image: '' },
    { name: 'Dilshan Silva', role: 'Co-Founder & Systems Engineer', bio: 'Specializes in secure API development, backend optimization, serverless architecture, and DevOps pipelines.', image: '' },
    { name: 'Nuwan Fernando', role: 'Frontend Developer & Designer', bio: 'Dedicated to designing modern interface aesthetics, interactive micro-animations, and fluid responsive layouts.', image: '' },
  ],
  technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'REST APIs', 'Git & GitHub'],
  cta: {
    title: 'Ready to bring your ideas to life?',
    subtitle: 'Reach out to our engineering team directly to discuss your upcoming project requirements.',
  }
};

type AboutContent = typeof DEFAULT_ABOUT_CONTENT;

export default function AdminAboutPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setCurrentUser(user);

      try {
        const data = await getPageContentByName('about');
        if (data && data.content) {
          setContent({ ...DEFAULT_ABOUT_CONTENT, ...(data.content as Partial<AboutContent>) });
        }
      } catch {
        // No saved content yet, use defaults
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
      await upsertPageContent('about', content as unknown as Record<string, unknown>);
      setMessage({ type: 'success', text: 'About page content saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save content.' });
    } finally {
      setSaving(false);
    }
  };

  // ── Array field helpers ─────────────────────────────────────────────────────
  const updateTrustPoint = (index: number, field: 'title' | 'desc', value: string) => {
    const updated = [...content.trustPoints];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, trustPoints: updated });
  };
  const addTrustPoint = () => setContent({ ...content, trustPoints: [...content.trustPoints, { title: '', desc: '' }] });
  const removeTrustPoint = (index: number) => setContent({ ...content, trustPoints: content.trustPoints.filter((_, i) => i !== index) });

  const updateWorkflowStep = (index: number, field: 'number' | 'title' | 'desc', value: string) => {
    const updated = [...content.workflowSteps];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, workflowSteps: updated });
  };
  const addWorkflowStep = () => {
    const nextNum = String(content.workflowSteps.length + 1).padStart(2, '0');
    setContent({ ...content, workflowSteps: [...content.workflowSteps, { number: nextNum, title: '', desc: '' }] });
  };
  const removeWorkflowStep = (index: number) => setContent({ ...content, workflowSteps: content.workflowSteps.filter((_, i) => i !== index) });

  const updateTeamMember = (index: number, field: 'name' | 'role' | 'bio' | 'image', value: string) => {
    const updated = [...content.team];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, team: updated });
  };
  const addTeamMember = () => setContent({ ...content, team: [...content.team, { name: '', role: '', bio: '', image: '' }] });
  const removeTeamMember = (index: number) => setContent({ ...content, team: content.team.filter((_, i) => i !== index) });

  const handleMemberImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadImage(file);
      updateTeamMember(index, 'image', url);
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error uploading image'));
    } finally {
      setUploadingIndex(null);
    }
  };

  const updateTech = (index: number, value: string) => {
    const updated = [...content.technologies];
    updated[index] = value;
    setContent({ ...content, technologies: updated });
  };
  const addTech = () => setContent({ ...content, technologies: [...content.technologies, ''] });
  const removeTech = (index: number) => setContent({ ...content, technologies: content.technologies.filter((_, i) => i !== index) });

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
            About Page Content Manager
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Edit the sections, text, team members, technologies, and workflow steps displayed on the public About page.
          </p>
        </div>

        {/* Feedback */}
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
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">🏠 Hero Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Title Line 1</label>
              <input type="text" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Title Highlight (Gradient Text)</label>
              <input type="text" value={content.hero.titleHighlight} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Subtitle</label>
            <textarea rows={3} value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
          </div>
        </div>

        {/* ═══ OUR STORY ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">📖 Our Story</h2>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Paragraph 1</label>
            <textarea rows={4} value={content.story.paragraph1} onChange={(e) => setContent({ ...content, story: { ...content.story, paragraph1: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Paragraph 2</label>
            <textarea rows={4} value={content.story.paragraph2} onChange={(e) => setContent({ ...content, story: { ...content.story, paragraph2: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
          </div>
        </div>

        {/* ═══ MISSION & VISION ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">🎯 Mission & Vision</h2>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Mission</label>
            <textarea rows={3} value={content.mission} onChange={(e) => setContent({ ...content, mission: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Vision</label>
            <textarea rows={3} value={content.vision} onChange={(e) => setContent({ ...content, vision: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
          </div>
        </div>

        {/* ═══ WHY SAPIROX (TRUST POINTS) ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h2 className="text-xl font-bold text-foreground">✅ Why Sapirox (Trust Points)</h2>
            <button type="button" onClick={addTrustPoint} className="text-xs font-bold text-primary hover:opacity-85 transition-opacity inline-flex items-center gap-1 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add Point
            </button>
          </div>
          {content.trustPoints.map((point, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4 relative">
              <button type="button" onClick={() => removeTrustPoint(idx)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Title</label>
                  <input type="text" value={point.title} onChange={(e) => updateTrustPoint(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Description</label>
                  <input type="text" value={point.desc} onChange={(e) => updateTrustPoint(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ HOW WE WORK (WORKFLOW) ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h2 className="text-xl font-bold text-foreground">⚙️ How We Work (Workflow Steps)</h2>
            <button type="button" onClick={addWorkflowStep} className="text-xs font-bold text-primary hover:opacity-85 transition-opacity inline-flex items-center gap-1 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
          </div>
          {content.workflowSteps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4 relative">
              <button type="button" onClick={() => removeWorkflowStep(idx)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="col-span-1 sm:col-span-1 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">No.</label>
                  <input type="text" value={step.number} onChange={(e) => updateWorkflowStep(idx, 'number', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Title</label>
                  <input type="text" value={step.title} onChange={(e) => updateWorkflowStep(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
                <div className="col-span-1 sm:col-span-3 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Description</label>
                  <input type="text" value={step.desc} onChange={(e) => updateWorkflowStep(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ CORE TEAM ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h2 className="text-xl font-bold text-foreground">👥 Core Team</h2>
            <button type="button" onClick={addTeamMember} className="text-xs font-bold text-primary hover:opacity-85 transition-opacity inline-flex items-center gap-1 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add Member
            </button>
          </div>
          {content.team.map((member: { name: string; role: string; bio: string; image?: string }, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4 relative">
              <button type="button" onClick={() => removeTeamMember(idx)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Team member avatar preview & uploader */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="h-24 w-24 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden relative group">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    )}
                    {uploadingIndex === idx && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold flex items-center gap-1 border border-border/60 transition-colors">
                    <Upload className="h-3 w-3" />
                    {uploadingIndex === idx ? '...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMemberImageUpload(idx, file);
                      }}
                      disabled={uploadingIndex !== null}
                    />
                  </label>
                </div>

                {/* Team member info form fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Name</label>
                      <input type="text" value={member.name} onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Role / Title</label>
                      <input type="text" value={member.role} onChange={(e) => updateTeamMember(idx, 'role', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Photo URL (Optional)</label>
                      <input type="text" value={member.image || ''} onChange={(e) => updateTeamMember(idx, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/... or upload photo"
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Bio / Description</label>
                    <textarea rows={2} value={member.bio} onChange={(e) => updateTeamMember(idx, 'bio', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ TECHNOLOGIES ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h2 className="text-xl font-bold text-foreground">💻 Technologies</h2>
            <button type="button" onClick={addTech} className="text-xs font-bold text-primary hover:opacity-85 transition-opacity inline-flex items-center gap-1 cursor-pointer">
              <Plus className="h-3.5 w-3.5" /> Add Technology
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {content.technologies.map((tech, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" value={tech} onChange={(e) => updateTech(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
                <button type="button" onClick={() => removeTech(idx)} className="p-1.5 rounded-lg bg-muted hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors shrink-0 cursor-pointer">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CTA SECTION ═══ */}
        <div className="premium-glass p-8 rounded-3xl border border-border space-y-6">
          <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3">📣 Call to Action</h2>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Title</label>
            <input type="text" value={content.cta.title} onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Subtitle</label>
            <input type="text" value={content.cta.subtitle} onChange={(e) => setContent({ ...content, cta: { ...content.cta, subtitle: e.target.value } })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors" />
          </div>
        </div>

        {/* Bottom Save Button */}
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
