'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/services/auth';
import { getProducts, createProduct, updateProduct, deleteProduct, Product } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X } from 'lucide-react';

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
    shortDescription: '',
    description: '',
    productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    gallery: [''],
    features: [''],
    benefits: [''],
    technology: [''],
    status: 'ACTIVE',
    demoUrl: '',
    ctaText: 'Request Access',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      shortDescription: '',
      description: '',
      productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gallery: [''],
      features: [''],
      benefits: [''],
      technology: ['React', 'TypeScript', 'Node.js'],
      status: 'ACTIVE',
      demoUrl: '',
      ctaText: 'Request Access',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      productImage: product.productImage,
      gallery: product.gallery.length > 0 ? [...product.gallery] : [''],
      features: product.features.length > 0 ? [...product.features] : [''],
      benefits: product.benefits.length > 0 ? [...product.benefits] : [''],
      technology: product.technology.length > 0 ? [...product.technology] : [''],
      status: product.status,
      demoUrl: product.demoUrl || '',
      ctaText: product.ctaText || 'Request Access',
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Dynamic Array Handlers helper
  const handleArrayChange = (field: 'features' | 'benefits' | 'technology' | 'gallery', index: number, value: string) => {
    const arr = [...(formData[field] || [])];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayInput = (field: 'features' | 'benefits' | 'technology' | 'gallery') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayInput = (field: 'features' | 'benefits' | 'technology' | 'gallery', index: number) => {
    const arr = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: arr });
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

    const payload = {
      ...formData,
      features: cleanedFeatures,
      benefits: cleanedBenefits,
      technology: cleanedTech,
      gallery: cleanedGallery,
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
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Manage Products & Solutions
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-indigo-500/10"
        >
          <Plus className="h-4.5 w-4.5" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      ) : (
        <div className="premium-glass rounded-3xl overflow-hidden border border-gray-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800/80 bg-gray-900/40 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="p-5">Name</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Technologies</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-sm text-gray-300">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-900/20 transition-colors">
                      <td className="p-5 font-semibold text-white">{product.name}</td>
                      <td className="p-5 text-gray-450">{product.slug}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          product.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : product.status === 'BETA'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {product.technology.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-gray-800 text-[11px] text-gray-400">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-rose-600 hover:text-white text-gray-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
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
          <div className="relative w-full max-w-3xl premium-glass rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/80 bg-gray-900/40">
              <h2 className="text-xl font-bold text-white">
                {editId ? 'Edit Product Solution' : 'Create New Product Solution'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. Sapirox Pulse ERP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. pulse-erp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BETA">BETA</option>
                    <option value="COMING_SOON">COMING SOON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">CTA Action Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Demo URL</label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. https://pulse.sapirox.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Product Display Image URL</label>
                <input
                  type="text"
                  value={formData.productImage}
                  onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Product Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                />
              </div>

              {/* Dynamic inputs sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tech stack list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Technologies Used</label>
                    <button type="button" onClick={() => addArrayInput('technology')} className="text-xs text-indigo-400 font-bold">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.technology?.map((tech, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleArrayChange('technology', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs"
                          placeholder="React, AWS"
                        />
                        <button type="button" onClick={() => removeArrayInput('technology', idx)} className="p-2 text-rose-450 bg-gray-800 rounded-lg"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core features list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Features</label>
                    <button type="button" onClick={() => addArrayInput('features')} className="text-xs text-indigo-400 font-bold">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.features?.map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs"
                        />
                        <button type="button" onClick={() => removeArrayInput('features', idx)} className="p-2 text-rose-450 bg-gray-800 rounded-lg"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800/80">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
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
