'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, removeAuthToken, User } from '@/services/auth';
import { getServices, createService, updateService, deleteService, uploadImage, Service } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X, Star, Eye } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'HIDDEN', label: 'HIDDEN' },
];



export default function AdminServicesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    icon: 'cpu',
    features: [''],
    order: 0,
    isFeatured: false,
    showOnHomepage: true,
    status: 'PUBLISHED',
    technologies: [''],
    image: '',
    seoTitle: '',
    seoDescription: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFormError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setCurrentUser(user);
        await loadServicesData();
      }
    }
    checkAuth();
  }, [router]);

  async function loadServicesData() {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreateModal = () => {
    setEditId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      icon: 'cpu',
      features: [''],
      order: 0,
      isFeatured: false,
      showOnHomepage: true,
      status: 'PUBLISHED',
      technologies: [''],
      image: '',
      seoTitle: '',
      seoDescription: '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditId(service.id);
    setFormData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      icon: service.icon,
      features: [...service.features],
      order: service.order,
      isFeatured: service.isFeatured ?? false,
      showOnHomepage: service.showOnHomepage ?? true,
      status: service.status || 'PUBLISHED',
      technologies: service.technologies && service.technologies.length > 0 ? [...service.technologies] : [''],
      image: service.image || '',
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...(formData.features || [])];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeatureInput = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeFeatureInput = (index: number) => {
    const updatedFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleTechChange = (index: number, value: string) => {
    const updatedTech = [...(formData.technologies || [])];
    updatedTech[index] = value;
    setFormData({ ...formData, technologies: updatedTech });
  };

  const addTechInput = () => {
    setFormData({ ...formData, technologies: [...(formData.technologies || []), ''] });
  };

  const removeTechInput = (index: number) => {
    const updatedTech = (formData.technologies || []).filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: updatedTech });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.shortDescription || !formData.fullDescription) {
      setFormError('Please fill in all core fields.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Clean features and technologies list
    const cleanedFeatures = (formData.features || []).filter(f => f.trim() !== '');
    const cleanedTech = (formData.technologies || []).filter(t => t.trim() !== '');

    try {
      if (editId) {
        await updateService(editId, { ...formData, features: cleanedFeatures, technologies: cleanedTech });
      } else {
        await createService({ ...formData, features: cleanedFeatures, technologies: cleanedTech });
      }
      setModalOpen(false);
      await loadServicesData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Check slugs for duplicate value.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        await loadServicesData();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  return (
    <div className="relative min-h-[85vh] py-12 px-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border/40 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-heading">
            Manage Capabilities & Services
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> Add Service
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
                  <th className="p-5">Order</th>
                  <th className="p-5">Title</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Icon</th>
                  <th className="p-5">Features</th>
                  <th className="p-5">Visibility</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm text-muted-foreground">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-5 font-semibold text-foreground">{service.order}</td>
                      <td className="p-5 font-semibold text-foreground">
                        <span className="flex items-center gap-2">
                          {service.title}
                          {service.isFeatured && (
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </span>
                      </td>
                      <td className="p-5 text-muted-foreground/80">{service.slug}</td>
                      <td className="p-5 text-primary font-mono">{service.icon}</td>
                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-muted text-xs border border-border/40">
                          {service.features.length} features
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5">
                          <Eye className={`h-3.5 w-3.5 ${service.showOnHomepage ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                          <span className={`text-xs ${service.showOnHomepage ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                            {service.showOnHomepage ? 'Homepage' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          service.status === 'PUBLISHED' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          {service.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-rose-600 hover:text-white text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-muted-foreground">
                      No services directory loaded. Click "Add Service" to launch your first database entry.
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
          <div className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] premium-glass rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/40">
              <h2 className="text-xl font-bold text-foreground">
                {editId ? 'Edit Service Capability' : 'Create New Service Capability'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. Web Application Development"
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
                    placeholder="E.g. web-app-development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="cpu, layers, globe, code, shield"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Position</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Publish Status</label>
                  <CustomSelect
                    options={STATUS_OPTIONS}
                    value={formData.status || 'PUBLISHED'}
                    onChange={(val) => setFormData({ ...formData, status: val as any })}
                  />
                </div>
              </div>

              {/* ── Homepage Visibility Toggles ─────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-muted/40 border border-border/60">
                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-foreground">Show on Homepage</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Display this service in the homepage capabilities section</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.showOnHomepage}
                    onClick={() => setFormData({ ...formData, showOnHomepage: !formData.showOnHomepage })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      formData.showOnHomepage
                        ? 'bg-primary border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.showOnHomepage ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-foreground">Featured</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Highlight with a star badge in the UI</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isFeatured}
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      formData.isFeatured
                        ? 'bg-amber-500 border-amber-500'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.isFeatured ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>
              </div>

              {/* Dynamic Technologies List input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technologies Used</label>
                  <button
                    type="button"
                    onClick={addTechInput}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.technologies?.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechChange(idx, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                        placeholder={`E.g. React`}
                      />
                      <button
                        type="button"
                        onClick={() => removeTechInput(idx)}
                        className="p-2 rounded-lg bg-muted hover:bg-rose-500/10 text-rose-500 transition-colors shrink-0 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Service Cover Image URL</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors w-full"
                    placeholder="https://images.unsplash.com/... or upload local file"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors w-full sm:w-auto">
                    {uploadingImage ? 'Uploading...' : 'Upload Local'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                  placeholder="Summarized capability description for lists"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Detailed Overview *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                  placeholder="Detailed breakdown layout..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border/40 pt-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SEO Page Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Defaults to: [Service Title] | Sapirox"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SEO Page Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Defaults to short description"
                  />
                </div>
              </div>

              {/* Dynamic Features List input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Features list</label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    + Add Feature Line
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                        placeholder={`Feature capability ${idx + 1}`}
                      />
                      {formData.features && formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="p-2 rounded-lg bg-muted hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
                      <Save className="h-4 w-4" /> Save Service
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
