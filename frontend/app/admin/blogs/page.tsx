'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/services/auth';
import { getAdminBlogs, createBlog, updateBlog, deleteBlog, uploadImage, Blog } from '@/services/api';
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, Save, X } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Published (Visible publicly)' },
  { value: 'DRAFT', label: 'Draft (Hidden from public)' },
];

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
    showOnHomepage: true,
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
      showOnHomepage: true,
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
      showOnHomepage: blog.showOnHomepage !== false,
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
      showOnHomepage: formData.showOnHomepage,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border/40 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-heading">
            Manage Insights & Blog Articles
          </h1>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" /> Add Article
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
                  <th className="p-5">Article Title</th>
                  <th className="p-5">Slug</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm text-muted-foreground">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-5 font-semibold text-foreground">{blog.title}</td>
                      <td className="p-5 text-muted-foreground/80">{blog.slug}</td>
                      <td className="p-5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {blog.category?.name || 'Technology'}
                        </span>
                        {blog.status === 'DRAFT' && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Draft
                          </span>
                        )}
                        {blog.featured && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-muted-foreground text-xs">
                        {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Draft')}
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(blog)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-muted hover:bg-rose-600 hover:text-white text-muted-foreground transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-muted-foreground/60">
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
          <div className="relative w-full max-w-3xl max-h-[calc(100vh-2rem)] premium-glass rounded-3xl border border-border overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/40">
              <h2 className="text-xl font-bold text-foreground">
                {editId ? 'Edit Blog Article' : 'Create Blog Article'}
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
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-650 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. The Future of AI in Enterprise Solutions"
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
                    placeholder="E.g. future-of-ai-enterprise"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value, categorySlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Technology, Insights, Business"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="AI, Cloud, Development"
                  />
                </div>
              </div>

              <div>
                <CustomSelect
                  options={STATUS_OPTIONS}
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val as any })}
                />
              </div>

              {/* ── Visibility & Feature Toggles ─────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-muted/40 border border-border/60">
                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-foreground">Featured Article</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Highlight this article on the main Blog/Insights listing page</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.featured}
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus:outline-none cursor-pointer ${
                      formData.featured
                        ? 'bg-primary border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.featured ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between gap-4 cursor-pointer group">
                  <div>
                    <span className="block text-sm font-semibold text-foreground">Show on Homepage</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Display this article in the homepage insights/blog showcase section</span>
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
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Short Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none text-muted-foreground"
                  placeholder="Brief summary of the article to show on cards..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cover Image URL</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cover Image Alt Text</label>
                  <input
                    type="text"
                    value={formData.coverImageAlt}
                    onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="Descriptive text for accessibility & SEO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content Markdown / Text *</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none font-mono"
                  placeholder="Write the full content of the article..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors"
                    placeholder="E.g. Custom SEO optimized title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm transition-colors resize-none"
                    placeholder="Meta description for search engines"
                  />
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
