'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/services/auth';
import { getAdminProjects, createProject, updateProject, deleteProject, Project, getServices, Service, uploadImage } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X } from 'lucide-react';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal forms parameters
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    gallery: [''],
    technology: [''],
    category: 'Enterprise',
    serviceId: '',
    liveUrl: '',
    githubUrl: '',
    projectType: 'CLIENT_PROJECT',
    projectOverview: '',
    challenge: '',
    solution: '',
    keyFeatures: [''],
    servicesDelivered: [''],
    projectGallery: [],
    projectOutcome: [''],
    status: 'DRAFT',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingIndices, setUploadingIndices] = useState<Record<number, boolean>>({});
  const [uploadingCover, setUploadingCover] = useState(false);

  async function loadProjectsData() {
    setLoading(true);
    try {
      const [projectsData, servicesData] = await Promise.all([
        getAdminProjects(),
        getServices()
      ]);
      setProjects(projectsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setCurrentUser(user);
        await loadProjectsData();
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleOpenCreateModal = () => {
    setEditId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      gallery: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'],
      technology: ['Next.js', 'PostgreSQL'],
      category: 'Enterprise',
      serviceId: '',
      liveUrl: '',
      githubUrl: '',
      projectType: 'CLIENT_PROJECT',
      projectOverview: '',
      challenge: '',
      solution: '',
      keyFeatures: [''],
      servicesDelivered: [''],
      projectGallery: [],
      projectOutcome: [''],
      status: 'DRAFT',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      coverImage: project.coverImage || '',
      gallery: project.gallery.length > 0 ? [...project.gallery] : [''],
      technology: project.technology.length > 0 ? [...project.technology] : [''],
      category: project.category,
      serviceId: project.serviceId || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      projectType: project.projectType || 'CLIENT_PROJECT',
      projectOverview: project.projectOverview || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      keyFeatures: project.keyFeatures && project.keyFeatures.length > 0 ? [...project.keyFeatures] : [''],
      servicesDelivered: project.servicesDelivered && project.servicesDelivered.length > 0 ? [...project.servicesDelivered] : [''],
      projectGallery: project.projectGallery ? [...project.projectGallery] : [],
      projectOutcome: project.projectOutcome && project.projectOutcome.length > 0 ? [...project.projectOutcome] : [''],
      status: project.status || 'DRAFT',
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Array Handlers helpers
  const handleArrayChange = (
    field: 'technology' | 'gallery' | 'keyFeatures' | 'servicesDelivered' | 'projectOutcome',
    index: number,
    value: string
  ) => {
    const arr = [...(formData[field] || [])];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayInput = (field: 'technology' | 'gallery' | 'keyFeatures' | 'servicesDelivered' | 'projectOutcome') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayInput = (
    field: 'technology' | 'gallery' | 'keyFeatures' | 'servicesDelivered' | 'projectOutcome',
    index: number
  ) => {
    const arr = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: arr });
  };

  // Project Gallery Handlers
  const handleProjectGalleryChange = (index: number, key: 'url' | 'title' | 'description', value: string) => {
    const arr = [...(formData.projectGallery || [])];
    if (!arr[index]) {
      arr[index] = { url: '', title: '', description: '' };
    }
    arr[index] = { ...arr[index], [key]: value };
    setFormData({ ...formData, projectGallery: arr });
  };

  const addProjectGalleryInput = () => {
    setFormData({
      ...formData,
      projectGallery: [...(formData.projectGallery || []), { url: '', title: '', description: '' }]
    });
  };

  const removeProjectGalleryInput = (index: number) => {
    const arr = (formData.projectGallery || []).filter((_, i) => i !== index);
    setFormData({ ...formData, projectGallery: arr });
  };

  const handleProjectGalleryUpload = async (index: number, file: File) => {
    setUploadingIndices(prev => ({ ...prev, [index]: true }));
    try {
      const url = await uploadImage(file);
      handleProjectGalleryChange(index, 'url', url);
    } catch (err: any) {
      console.error('Project gallery image upload failed:', err);
      alert('Project gallery image upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingIndices(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGalleryUpload = async (index: number, file: File) => {
    setUploadingIndices(prev => ({ ...prev, [index]: true }));
    try {
      const url = await uploadImage(file);
      handleArrayChange('gallery', index, url);
    } catch (err: any) {
      console.error('Gallery image upload failed:', err);
      alert('Gallery image upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingIndices(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, coverImage: url }));
    } catch (err: any) {
      console.error('Cover image upload failed:', err);
      alert('Cover image upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.description) {
      setFormError('Please fill in all core configurations.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Clean arrays
    const cleanedTech = (formData.technology || []).filter(t => t.trim() !== '');
    const cleanedGallery = (formData.gallery || []).filter(g => g.trim() !== '');
    const cleanedFeatures = (formData.keyFeatures || []).filter(f => f.trim() !== '');
    const cleanedServices = (formData.servicesDelivered || []).filter(s => s.trim() !== '');
    const cleanedOutcome = (formData.projectOutcome || []).filter(o => o.trim() !== '');
    const cleanedProjectGallery = (formData.projectGallery || []).filter(img => img.url.trim() !== '');

    const payload = {
      ...formData,
      technology: cleanedTech,
      gallery: cleanedGallery,
      keyFeatures: cleanedFeatures,
      servicesDelivered: cleanedServices,
      projectOutcome: cleanedOutcome,
      projectGallery: cleanedProjectGallery,
    };

    try {
      if (editId) {
        await updateProject(editId, payload);
      } else {
        await createProject(payload);
      }
      setModalOpen(false);
      await loadProjectsData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Check slugs for duplicate value.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study entry?')) {
      try {
        await deleteProject(id);
        await loadProjectsData();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed.');
      }
    }
  };

  return (
    <div className="relative min-h-[85vh] py-12 px-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-border/40 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-heading">
            Manage Case Studies (Portfolio)
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="premium-glass rounded-3xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="p-5">Project Title</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Tech Stack</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm text-muted-foreground">
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-5 font-semibold text-foreground">
                        <div className="flex flex-col">
                          <span>{proj.title}</span>
                          {proj.status && (
                            <span className={`inline-block w-fit mt-1.5 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              proj.status === 'PUBLISHED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}>
                              {proj.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-muted-foreground/80">{proj.slug}</td>
                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {proj.category}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technology.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-muted text-[11px] text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(proj)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-rose-600 hover:text-white text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-muted-foreground">
                      No case studies database entry loaded. Click "Add Project" to launch your first portfolio element.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE / UPDATE MODAL FORM ────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl premium-glass rounded-3xl border border-border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/40">
              <h2 className="text-xl font-bold text-foreground">
                {editId ? 'Edit Case Study Project' : 'Create Case Study Project'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-650 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. Axiom Trading Engine"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. axiom-trading-engine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Type *</label>
                  <select
                    value={formData.projectType || 'CLIENT_PROJECT'}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                  >
                    <option value="CLIENT_PROJECT">Client Project</option>
                    <option value="IN_HOUSE_PRODUCT">In-House Product</option>
                    <option value="INTERNAL_PROJECT">Internal Project</option>
                    <option value="PROTOTYPE">Prototype</option>
                    <option value="OPEN_SOURCE">Open Source</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Publish Status *</label>
                  <select
                    value={formData.status || 'DRAFT'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Project Overview</label>
                  <input
                    type="text"
                    value={formData.projectOverview || ''}
                    onChange={(e) => setFormData({ ...formData, projectOverview: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Brief overview (what was built/does)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category Group *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Enterprise, Cloud, Cybersecurity, FinTech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Link to Tech Service (Optional)</label>
                  <select
                    value={formData.serviceId || ''}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value || undefined })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                  >
                    <option value="">-- No linked Service --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">GitHub Repository URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="https://images.unsplash.com/... or upload local file"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                    {uploadingCover ? 'Uploading...' : 'Upload Local'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverUpload(file);
                      }}
                      disabled={uploadingCover}
                    />
                  </label>
                  {formData.coverImage && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="px-3 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 border border-rose-800/50 transition-colors text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Case Study description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                  placeholder="Describe the problem, the process and the final solution..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">The Challenge / Problem</label>
                  <textarea
                    rows={3}
                    value={formData.challenge || ''}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                    placeholder="What problem or business challenge did this project solve?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Our Solution</label>
                  <textarea
                    rows={3}
                    value={formData.solution || ''}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                    placeholder="Describe how the project solved the identified problem..."
                  />
                </div>
              </div>

              {/* Dynamic array lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tech stack */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technologies Used</label>
                    <button type="button" onClick={() => addArrayInput('technology')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.technology?.map((tech, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleArrayChange('technology', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                        />
                        <button type="button" onClick={() => removeArrayInput('technology', idx)} className="p-2 text-rose-500 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legacy Gallery image URLs (kept for compatibility) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legacy Image Showcase URL</label>
                    <button type="button" onClick={() => addArrayInput('gallery')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.gallery?.map((gal, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={gal}
                          onChange={(e) => handleArrayChange('gallery', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          placeholder="Image URL or upload local file"
                        />
                        <label className="cursor-pointer px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center justify-center shrink-0 border border-border/60 transition-colors">
                          {uploadingIndices[idx] ? '...' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingIndices[idx]}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleGalleryUpload(idx, file);
                            }}
                          />
                        </label>
                        <button type="button" onClick={() => removeArrayInput('gallery', idx)} className="p-2 text-rose-500 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* More dynamic arrays: Features, Services Delivered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Features */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Features</label>
                    <button type="button" onClick={() => addArrayInput('keyFeatures')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.keyFeatures?.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleArrayChange('keyFeatures', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          placeholder="Feature description"
                        />
                        <button type="button" onClick={() => removeArrayInput('keyFeatures', idx)} className="p-2 text-rose-500 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Delivered */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services Delivered</label>
                    <button type="button" onClick={() => addArrayInput('servicesDelivered')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.servicesDelivered?.map((serv, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={serv}
                          onChange={(e) => handleArrayChange('servicesDelivered', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          placeholder="Service name (e.g. UI/UX Design)"
                        />
                        <button type="button" onClick={() => removeArrayInput('servicesDelivered', idx)} className="p-2 text-rose-500 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outcomes (Optional) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Outcomes (Optional)</label>
                  <button type="button" onClick={() => addArrayInput('projectOutcome')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.projectOutcome?.map((out, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={out}
                        onChange={(e) => handleArrayChange('projectOutcome', idx, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                        placeholder="Outcome (e.g. Improved reporting efficiency)"
                      />
                      <button type="button" onClick={() => removeArrayInput('projectOutcome', idx)} className="p-2 text-rose-500 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Gallery - Multiple Images with Titles and Descriptions */}
              <div className="border-t border-border/40 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Project Gallery (Multiple Images)</label>
                    <span className="text-[10px] text-muted-foreground/60">Add showcase screenshots with titles and short descriptions.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={addProjectGalleryInput} 
                    className="text-xs text-primary font-bold px-3 py-1 rounded bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    + Add Image Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.projectGallery?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-3 relative group">
                      <button 
                        type="button" 
                        onClick={() => removeProjectGalleryInput(idx)} 
                        className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground bg-muted hover:bg-rose-600 rounded-lg transition-all cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground/60 tracking-wider mb-1">Image Title</label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => handleProjectGalleryChange(idx, 'title', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                              placeholder="E.g. Sales Management Dashboard"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-muted-foreground/60 tracking-wider mb-1">Image Description</label>
                            <input
                              type="text"
                              value={item.description || ''}
                              onChange={(e) => handleProjectGalleryChange(idx, 'description', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                              placeholder="E.g. View real-time transactions and metrics."
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] font-semibold text-muted-foreground/60 tracking-wider mb-1">Image URL / Upload</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.url || ''}
                              onChange={(e) => handleProjectGalleryChange(idx, 'url', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                              placeholder="URL or Upload"
                            />
                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-[10px] font-bold flex items-center justify-center shrink-0 border border-border/60 transition-colors">
                              {uploadingIndices[idx] ? '...' : 'Upload'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingIndices[idx]}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleProjectGalleryUpload(idx, file);
                                }}
                              />
                            </label>
                          </div>
                          {item.url && (
                            <div className="mt-2 relative h-16 w-full rounded border border-border overflow-hidden bg-background">
                              <img src={item.url} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!formData.projectGallery || formData.projectGallery.length === 0) && (
                    <div className="text-center py-6 border border-dashed border-border rounded-2xl text-xs text-muted-foreground/60">
                      No gallery images added yet. Click "+ Add Image Item" above.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {formLoading ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4" /> Save Project
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
