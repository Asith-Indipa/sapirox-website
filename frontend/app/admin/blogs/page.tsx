'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/services/auth';
import { getAdminBlogs, createBlog, updateBlog, deleteBlog, uploadImage, Blog } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X } from 'lucide-react';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal forms parameters
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    coverImageAlt: '',
    excerpt: '',
    categoryName: 'Technology',
    categorySlug: 'technology',
    tagsInput: 'IT, Startup, Software',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    featured: false,
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
      setFormData(prev => ({ ...prev, coverImage: url }));
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFormError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  async function loadBlogsData() {
    setLoading(true);
    try {
      // Fetch all blogs (drafts and published) for admin management list
      const data = await getAdminBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
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
        await loadBlogsData();
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
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      coverImageAlt: '',
      excerpt: '',
      categoryName: 'Technology',
      categorySlug: 'technology',
      tagsInput: 'IT, Startup, Software',
      status: 'PUBLISHED',
      featured: false,
      seoTitle: '',
      seoDescription: '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (blog: Blog) => {
    setEditId(blog.id);
    const tagsString = blog.tags ? blog.tags.map(t => t.name).join(', ') : '';
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage,
      coverImageAlt: blog.coverImageAlt || '',
      excerpt: blog.excerpt || '',
      categoryName: blog.category?.name || 'Technology',
      categorySlug: blog.category?.slug || 'technology',
      tagsInput: tagsString,
      status: blog.status || 'PUBLISHED',
      featured: blog.featured || false,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
      setFormError('Please fill in all core fields, including the Excerpt.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Clean tags list
    const tagsArray = formData.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '')
      .map(t => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, '-') }));

    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      coverImage: formData.coverImage,
      coverImageAlt: formData.coverImageAlt || undefined,
      excerpt: formData.excerpt,
      category: {
        name: formData.categoryName,
        slug: formData.categorySlug,
      },
      tags: tagsArray,
      status: formData.status,
      featured: formData.featured,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
    };

    try {
      if (editId) {
        await updateBlog(editId, payload);
      } else {
        await createBlog(payload);
      }
      setModalOpen(false);
      await loadBlogsData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed. Check slugs for duplicate value.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      try {
        await deleteBlog(id);
        await loadBlogsData();
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
            Manage Insights & Blog Articles
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-indigo-500/10"
        >
          <Plus className="h-4.5 w-4.5" /> Add Article
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
                  <th className="p-5">Article Title</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-sm text-gray-300">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-900/20 transition-colors">
                      <td className="p-5 font-semibold text-white">{blog.title}</td>
                      <td className="p-5 text-gray-450">{blog.slug}</td>
                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {blog.category?.name || 'Technology'}
                        </span>
                        {blog.status === 'DRAFT' && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Draft
                          </span>
                        )}
                        {blog.featured && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-gray-400 text-xs">
                        {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Draft')}
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(blog)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
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
                      No blog articles database entry loaded. Click "Add Article" to launch your first post.
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
                {editId ? 'Edit Blog Article' : 'Create Blog Article'}
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
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. The Future of AI in Enterprise Solutions"
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
                    placeholder="E.g. future-of-ai-enterprise"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value, categorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="Technology, Insights, Business"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="AI, Cloud, Development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Publish Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="PUBLISHED">Published (Visible publicly)</option>
                    <option value="DRAFT">Draft (Hidden from public)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Featured Article *</label>
                  <select
                    value={formData.featured ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="false">No (Standard Article)</option>
                    <option value="true">Yes (Highlight on Blog Page)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Short Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                  placeholder="Brief summary of the article to show on cards..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                      placeholder="https://images.unsplash.com/... or upload local file"
                    />
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
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
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Image Alt Text</label>
                  <input
                    type="text"
                    value={formData.coverImageAlt}
                    onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="Descriptive text for accessibility & SEO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content Markdown / Text *</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none font-mono"
                  placeholder="Write the full content of the article..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800/40">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. Custom SEO optimized title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                    placeholder="Meta description for search engines"
                  />
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
                      <Save className="h-4 w-4" /> Save Article
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
