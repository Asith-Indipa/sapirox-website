'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, removeAuthToken, User } from '@/services/auth';
import { getServices, createService, updateService, deleteService, Service } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X, Star, Eye } from 'lucide-react';

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
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.shortDescription || !formData.fullDescription) {
      setFormError('Please fill in all core fields.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Clean features list
    const cleanedFeatures = (formData.features || []).filter(f => f.trim() !== '');

    try {
      if (editId) {
        await updateService(editId, { ...formData, features: cleanedFeatures });
      } else {
        await createService({ ...formData, features: cleanedFeatures });
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
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Manage Capabilities & Services
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-indigo-500/10"
        >
          <Plus className="h-4.5 w-4.5" /> Add Service
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
              <tbody className="divide-y divide-gray-800/40 text-sm text-gray-300">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-900/20 transition-colors">
                      <td className="p-5 font-semibold text-white">{service.order}</td>
                      <td className="p-5 font-semibold text-white">
                        <span className="flex items-center gap-2">
                          {service.title}
                          {service.isFeatured && (
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </span>
                      </td>
                      <td className="p-5 text-gray-450">{service.slug}</td>
                      <td className="p-5 text-indigo-400 font-mono">{service.icon}</td>
                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-xs border border-gray-700/35">
                          {service.features.length} features
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5">
                          <Eye className={`h-3.5 w-3.5 ${service.showOnHomepage ? 'text-emerald-400' : 'text-gray-600'}`} />
                          <span className={`text-xs ${service.showOnHomepage ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {service.showOnHomepage ? 'Homepage' : 'Hidden'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          service.status === 'PUBLISHED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {service.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-rose-600 hover:text-white text-gray-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-gray-500">
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
          <div className="relative w-full max-w-2xl premium-glass rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/80 bg-gray-900/40">
              <h2 className="text-xl font-bold text-white">
                {editId ? 'Edit Service Capability' : 'Create New Service Capability'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. Web Application Development"
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
                    placeholder="E.g. web-app-development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="cpu, layers, globe, code, shield"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Position</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="HIDDEN">HIDDEN</option>
                  </select>
                </div>
              </div>

              {/* ── Homepage Visibility Toggles ─────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60">
                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-white">Show on Homepage</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Display this service in the homepage capabilities section</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.showOnHomepage}
                    onClick={() => setFormData({ ...formData, showOnHomepage: !formData.showOnHomepage })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none ${
                      formData.showOnHomepage
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.showOnHomepage ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-white">Featured</span>
                    <span className="block text-xs text-gray-500 mt-0.5">Highlight with a star badge in the UI</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isFeatured}
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none ${
                      formData.isFeatured
                        ? 'bg-amber-500 border-amber-500'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.isFeatured ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  placeholder="Summarized capability description for lists"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Detailed Overview *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                  placeholder="Detailed breakdown layout..."
                />
              </div>

              {/* Dynamic Features List input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Features list</label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
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
                        className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                        placeholder={`Feature capability ${idx + 1}`}
                      />
                      {formData.features && formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-rose-500/10 text-rose-450 hover:text-rose-400 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
