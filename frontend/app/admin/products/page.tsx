'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/services/auth';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage, Product } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const CATEGORY_OPTIONS = [
  { value: 'CRM', label: 'CRM' },
  { value: 'POS', label: 'POS' },
  { value: 'ERP', label: 'ERP' },
  { value: 'Analytics', label: 'Analytics' },
  { value: 'HR', label: 'HR' },
  { value: 'Inventory', label: 'Inventory' },
  { value: 'AI', label: 'AI' },
  { value: 'Other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'AVAILABLE' },
  { value: 'BETA', label: 'BETA' },
  { value: 'COMING_SOON', label: 'COMING_SOON' },
  { value: 'UNDER_DEVELOPMENT', label: 'UNDER DEVELOPMENT' },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / form configurations
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'Other',
    shortDescription: '',
    description: '',
    productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    gallery: [''],
    features: [''],
    benefits: [''],
    targetUsers: [''],
    technology: [''],
    integrations: [''],
    screenshots: [{ imageUrl: '', title: '', description: '' }],
    howItWorks: [{ title: '', description: '', order: 1 }],
    status: 'AVAILABLE',
    demoUrl: '',
    ctaText: 'Request Access',
    showOnHomepage: true,
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
      setFormData(prev => ({ ...prev, productImage: url }));
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFormError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  async function loadProductsData() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
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
        await loadProductsData();
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleOpenCreateModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Other',
      shortDescription: '',
      description: '',
      productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gallery: [''],
      features: [''],
      benefits: [''],
      targetUsers: ['Small Businesses', 'Startups'],
      technology: ['React', 'TypeScript', 'Node.js'],
      integrations: ['Supabase', 'Stripe'],
      screenshots: [{ imageUrl: '', title: '', description: '' }],
      howItWorks: [{ title: '', description: '', order: 1 }],
      status: 'AVAILABLE',
      demoUrl: '',
      ctaText: 'Request Access',
      seoTitle: '',
      seoDescription: '',
      showOnHomepage: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      category: product.category || 'Other',
      shortDescription: product.shortDescription,
      description: product.description,
      productImage: product.productImage,
      gallery: product.gallery && product.gallery.length > 0 ? [...product.gallery] : [''],
      features: product.features && product.features.length > 0 ? [...product.features] : [''],
      benefits: product.benefits && product.benefits.length > 0 ? [...product.benefits] : [''],
      targetUsers: product.targetUsers && product.targetUsers.length > 0 ? [...product.targetUsers] : [''],
      technology: product.technology && product.technology.length > 0 ? [...product.technology] : [''],
      integrations: product.integrations && product.integrations.length > 0 ? [...product.integrations] : [''],
      screenshots: product.screenshots && product.screenshots.length > 0 ? [...product.screenshots] : [{ imageUrl: '', title: '', description: '' }],
      howItWorks: product.howItWorks && product.howItWorks.length > 0 ? [...product.howItWorks] : [{ title: '', description: '', order: 1 }],
      status: product.status,
      demoUrl: product.demoUrl || '',
      ctaText: product.ctaText || 'Request Access',
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      showOnHomepage: product.showOnHomepage !== false,
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Dynamic Array Handlers helper
  const handleArrayChange = (field: 'features' | 'benefits' | 'technology' | 'gallery' | 'targetUsers' | 'integrations', index: number, value: string) => {
    const arr = [...(formData[field] || [])] as string[];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayInput = (field: 'features' | 'benefits' | 'technology' | 'gallery' | 'targetUsers' | 'integrations') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayInput = (field: 'features' | 'benefits' | 'technology' | 'gallery' | 'targetUsers' | 'integrations', index: number) => {
    const arr = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: arr });
  };

  // Screenshots handlers
  const handleScreenshotChange = (index: number, key: 'imageUrl' | 'title' | 'description', value: string) => {
    const arr = [...(formData.screenshots || [])];
    arr[index] = { ...arr[index], [key]: value };
    setFormData({ ...formData, screenshots: arr });
  };

  const addScreenshotInput = () => {
    setFormData({ ...formData, screenshots: [...(formData.screenshots || []), { imageUrl: '', title: '', description: '' }] });
  };

  const removeScreenshotInput = (index: number) => {
    const arr = (formData.screenshots || []).filter((_, i) => i !== index);
    setFormData({ ...formData, screenshots: arr });
  };

  const handleScreenshotUpload = async (index: number, file: File) => {
    try {
      const url = await uploadImage(file);
      handleScreenshotChange(index, 'imageUrl', url);
    } catch (err: any) {
      console.error('Screenshot upload failed:', err);
      alert('Screenshot upload failed: ' + (err.message || 'Error'));
    }
  };

  // How It Works Steps handlers
  const handleStepChange = (index: number, key: 'title' | 'description', value: string) => {
    const arr = [...(formData.howItWorks || [])];
    arr[index] = { ...arr[index], [key]: value };
    setFormData({ ...formData, howItWorks: arr });
  };

  const addStepInput = () => {
    const currentSteps = formData.howItWorks || [];
    setFormData({ 
      ...formData, 
      howItWorks: [...currentSteps, { title: '', description: '', order: currentSteps.length + 1 }] 
    });
  };

  const removeStepInput = (index: number) => {
    const arr = (formData.howItWorks || []).filter((_, i) => i !== index).map((step, idx) => ({ ...step, order: idx + 1 }));
    setFormData({ ...formData, howItWorks: arr });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.shortDescription || !formData.description) {
      setFormError('Please fill in all core configurations.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Clean arrays
    const cleanedFeatures = (formData.features || []).filter(f => f.trim() !== '');
    const cleanedBenefits = (formData.benefits || []).filter(b => b.trim() !== '');
    const cleanedTech = (formData.technology || []).filter(t => t.trim() !== '');
    const cleanedGallery = (formData.gallery || []).filter(g => g.trim() !== '');
    const cleanedTargetUsers = (formData.targetUsers || []).filter(u => u.trim() !== '');
    const cleanedIntegrations = (formData.integrations || []).filter(i => i.trim() !== '');
    const cleanedScreenshots = (formData.screenshots || []).filter(s => s.imageUrl.trim() !== '' || s.title.trim() !== '');
    const cleanedHowItWorks = (formData.howItWorks || []).filter(step => step.title.trim() !== '');

    const payload = {
      ...formData,
      features: cleanedFeatures,
      benefits: cleanedBenefits,
      technology: cleanedTech,
      gallery: cleanedGallery,
      targetUsers: cleanedTargetUsers,
      integrations: cleanedIntegrations,
      screenshots: cleanedScreenshots,
      howItWorks: cleanedHowItWorks,
    };

    try {
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      await loadProductsData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Check slugs for duplicate value.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product solutions entry?')) {
      try {
        await deleteProduct(id);
        await loadProductsData();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed.');
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
            Manage Products & Solutions
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> Add Product
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
                  <th className="p-5">Name</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Technologies</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm text-muted-foreground">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-5 font-semibold text-foreground">{product.name}</td>
                      <td className="p-5 text-muted-foreground/80">{product.slug}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          product.status === 'AVAILABLE' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : product.status === 'BETA'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {product.technology.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-muted text-[11px] text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                      No products directory loaded. Click "Add Product" to launch your first database entry.
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
          <div className="relative w-full max-w-3xl max-h-[calc(100vh-2rem)] premium-glass rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/40">
              <h2 className="text-xl font-bold text-foreground">
                {editId ? 'Edit Product Solution' : 'Create New Product Solution'}
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. Sapirox Pulse ERP"
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
                    placeholder="E.g. pulse-erp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
                  <CustomSelect
                    options={CATEGORY_OPTIONS}
                    value={formData.category || 'CRM'}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Publish Status</label>
                  <CustomSelect
                    options={STATUS_OPTIONS}
                    value={formData.status || 'AVAILABLE'}
                    onChange={(val) => setFormData({ ...formData, status: val as any })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CTA Action Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Live Demo URL</label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. https://pulse.sapirox.com"
                  />
                </div>
              </div>

              {/* ── Homepage Visibility Toggles ─────────────────────────────────── */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/60">
                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-foreground">Show on Homepage</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Display this product in the homepage product showcase section</span>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Product Display Image URL</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formData.productImage}
                    onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
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
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Detailed Product Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
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
                    placeholder="Defaults to: [Product Name] | Sapirox"
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

              {/* Dynamic inputs sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tech stack list */}
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
                          placeholder="React, AWS"
                        />
                        <button type="button" onClick={() => removeArrayInput('technology', idx)} className="p-2 text-rose-500 bg-muted rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Features</label>
                    <button type="button" onClick={() => addArrayInput('features')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.features?.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                        />
                        <button type="button" onClick={() => removeArrayInput('features', idx)} className="p-2 text-rose-500 bg-muted rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Key Business Benefits list */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Business Benefits</label>
                  <button type="button" onClick={() => addArrayInput('benefits')} className="text-xs text-primary font-bold cursor-pointer">+ Add</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.benefits?.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', idx, e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                        placeholder="E.g. Reduce server costs by up to 30%"
                      />
                      <button type="button" onClick={() => removeArrayInput('benefits', idx)} className="p-2 text-rose-500 bg-muted rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Users & Integrations dynamic lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                {/* Target Users */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Users / Who It's For</label>
                    <button type="button" onClick={() => addArrayInput('targetUsers')} className="text-xs text-primary font-bold cursor-pointer">+ Add User Type</button>
                  </div>
                  <div className="space-y-2">
                    {formData.targetUsers?.map((user, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={user}
                          onChange={(e) => handleArrayChange('targetUsers', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          placeholder="E.g. Startups, SMBs"
                        />
                        <button type="button" onClick={() => removeArrayInput('targetUsers', idx)} className="p-2 text-rose-500 bg-muted rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrations */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Integrations</label>
                    <button type="button" onClick={() => addArrayInput('integrations')} className="text-xs text-primary font-bold cursor-pointer">+ Add Integration</button>
                  </div>
                  <div className="space-y-2">
                    {formData.integrations?.map((integ, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={integ}
                          onChange={(e) => handleArrayChange('integrations', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-foreground text-xs"
                          placeholder="E.g. Supabase, Stripe, WhatsApp"
                        />
                        <button type="button" onClick={() => removeArrayInput('integrations', idx)} className="p-2 text-rose-500 bg-muted rounded-lg cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Screenshots list */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Screenshots</label>
                  <button type="button" onClick={addScreenshotInput} className="text-xs text-primary font-bold cursor-pointer">+ Add Screenshot</button>
                </div>
                <div className="space-y-4">
                  {formData.screenshots?.map((scr, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">Screenshot #{idx + 1}</span>
                        <button type="button" onClick={() => removeScreenshotInput(idx)} className="text-xs text-rose-500 hover:underline cursor-pointer">Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Screenshot Title</label>
                          <input
                            type="text"
                            value={scr.title}
                            onChange={(e) => handleScreenshotChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                            placeholder="E.g. Dashboard, Analytics"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Short Description</label>
                          <input
                            type="text"
                            value={scr.description}
                            onChange={(e) => handleScreenshotChange(idx, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                            placeholder="E.g. Monitor all operations in real-time"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Image URL / Local Upload</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={scr.imageUrl}
                            onChange={(e) => handleScreenshotChange(idx, 'imageUrl', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                            placeholder="https://images.unsplash.com/... or upload local file"
                          />
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold flex items-center justify-center shrink-0 border border-border transition-colors">
                            Upload File
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleScreenshotUpload(idx, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works Steps list */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">How It Works (Steps)</label>
                  <button type="button" onClick={addStepInput} className="text-xs text-primary font-bold cursor-pointer">+ Add Step</button>
                </div>
                <div className="space-y-4">
                  {formData.howItWorks?.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">Step #{step.order || idx + 1}</span>
                        <button type="button" onClick={() => removeStepInput(idx)} className="text-xs text-rose-500 hover:underline cursor-pointer">Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Step Title</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                            placeholder="E.g. Step 01: Connect"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Step Description</label>
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                            placeholder="E.g. Hook your database in seconds"
                          />
                        </div>
                      </div>
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
                      <Save className="h-4 w-4" /> Save Product
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
