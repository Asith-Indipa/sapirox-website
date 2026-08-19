'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, removeAuthToken, User } from '@/services/auth';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, uploadImage, getFullImageUrl, Testimonial } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X, Eye, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    feedback: '',
    avatar: '',
    order: 0,
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
      setFormData(prev => ({ ...prev, avatar: url }));
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
        await loadTestimonialsData();
      }
    }
    checkAuth();
  }, [router]);

  async function loadTestimonialsData() {
    setLoading(true);
    try {
      const data = await getTestimonials();
      // Sort by order ascending
      const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setTestimonials(sorted);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreateModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      role: '',
      feedback: '',
      avatar: '',
      order: testimonials.length,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (t: Testimonial) => {
    setEditId(t.id);
    setFormData({
      name: t.name,
      role: t.role,
      feedback: t.feedback,
      avatar: t.avatar || '',
      order: t.order || 0,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      await loadTestimonialsData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.feedback) {
      setFormError('Name, Role, and Feedback are required.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      if (editId) {
        await updateTestimonial(editId, formData);
      } else {
        await createTestimonial(formData);
      }
      setModalOpen(false);
      await loadTestimonialsData();
    } catch (err: any) {
      console.error('Submit failed:', err);
      setFormError(err.message || 'Failed to save testimonial. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <span className="text-sm text-muted-foreground">Loading Testimonials Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-12 px-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-border/40 pb-8">
        <div>
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" /> Testimonials Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage partner integrations and client reviews displayed on the homepage.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-sm font-semibold transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Testimonials list */}
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="premium-glass p-8 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group"
            >
              {/* Order tag */}
              <div className="absolute top-4 right-4 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-0.5 rounded-full border border-border">
                Order: {t.order ?? 0}
              </div>

              <div>
                <p className="text-muted-foreground italic leading-relaxed text-sm mb-8 pr-12 break-words">
                  "{t.feedback}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-6">
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img 
                      src={getFullImageUrl(t.avatar)} 
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover border border-border/60 bg-muted/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className = 'hidden';
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-sm border border-border/50">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-foreground break-words">{t.name}</h4>
                    <p className="text-xs text-muted-foreground break-words">{t.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/20 text-primary transition-all cursor-pointer"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 transition-all cursor-pointer"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 premium-glass rounded-3xl border border-border">
          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">No Testimonials Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            You haven't added any client testimonials yet. Add your first testimonial using the button above.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Testimonial
          </button>
        </div>
      )}

      {/* CRUD modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="premium-glass w-full max-w-lg max-h-[calc(100vh-2rem)] rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-bold text-foreground">
                {editId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Kanishka Silva"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Role & Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Founder, TradeFlow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Feedback Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Paste customer review feedback here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Avatar Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={formData.avatar || ''}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-primary transition-colors w-full"
                      placeholder="/uploads/avatar.jpg"
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center min-w-[80px] w-full sm:w-auto">
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        'Upload'
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Avatar Preview */}
              {formData.avatar && (
                <div className="p-3 bg-muted/20 border border-border/40 rounded-2xl flex items-center gap-3">
                  <img 
                    src={getFullImageUrl(formData.avatar)} 
                    alt="Preview" 
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-muted-foreground block">Avatar Preview</span>
                    <span className="text-xs text-foreground font-semibold truncate block max-w-[320px]">{formData.avatar}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
