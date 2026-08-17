'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, removeAuthToken, User } from '@/services/auth';
import { apiFetch } from '@/services/api';
import { 
  Users, 
  Layers, 
  FolderKanban, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  Cpu, 
  CheckCircle,
  Clock,
  Briefcase,
  Globe,
  FileText,
  Mail,
  Check,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface BackendStats {
  services: number;
  products: number;
  projects: number;
  blogs: number;
  unreadMessages: number;
  testimonials: number;
}

interface Stats {
  servicesCount: number;
  productsCount: number;
  projectsCount: number;
  blogsCount: number;
  contactsCount: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard states
  const [stats, setStats] = useState<Stats>({
    servicesCount: 0,
    productsCount: 0,
    projectsCount: 0,
    blogsCount: 0,
    contactsCount: 0
  });
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loadStatsError, setLoadStatsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadDashboardDetails() {
    try {
      // 1. Load stats (admin route)
      const statsRes = await apiFetch<{ success: boolean; data: BackendStats }>('/admin/dashboard');
      if (statsRes.success && statsRes.data) {
        setStats({
          servicesCount: statsRes.data.services || 0,
          productsCount: statsRes.data.products || 0,
          projectsCount: statsRes.data.projects || 0,
          blogsCount: statsRes.data.blogs || 0,
          contactsCount: statsRes.data.unreadMessages || 0
        });
      }

      // 2. Load contacts list (admin route)
      const contactsRes = await apiFetch<{ success: boolean; data: ContactMessage[] }>('/admin/messages');
      setContacts(contactsRes.data);
    } catch (err: any) {
      console.error('Failed to load dashboard statistics or contacts:', err);
      setLoadStatsError(err.message || 'Failed to retrieve administrative details.');
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'READ' | 'UNREAD') => {
    try {
      await apiFetch<{ success: boolean }>(`/admin/messages/${id}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      await loadDashboardDetails();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await apiFetch<{ success: boolean }>(`/admin/messages/${id}`, {
        method: 'DELETE',
      });
      await loadDashboardDetails();
    } catch (err: any) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  // Authenticate user on load
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setCurrentUser(user);
        await loadDashboardDetails();
      }
      setLoading(false);
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Adjust current page if it exceeds total pages after content reload
  useEffect(() => {
    const total = Math.ceil(contacts.length / 10) || 1;
    if (currentPage > total) {
      setCurrentPage(total);
    }
  }, [contacts, currentPage]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(contacts.length / itemsPerPage) || 1;
  const paginatedContacts = contacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Cpu className="h-10 w-10 text-indigo-400 animate-spin mx-auto mb-4" />
          <span className="text-sm text-gray-400">Loading Sapirox Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] py-12 px-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Admin CMS Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as: <span className="text-indigo-400 font-semibold">{currentUser?.email}</span> ({currentUser?.role})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/seo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all duration-300 text-xs font-semibold"
          >
            <Globe className="h-4 w-4" /> SEO Configurator
          </Link>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 text-xs font-semibold"
          >
            Logout <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loadStatsError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-8">
          Note: {loadStatsError}. (Running in mock/sandbox display rules if tables are empty).
        </div>
      )}

      {/* ── METRICS COUNTERS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
        {[
          { label: 'Services', count: stats.servicesCount, icon: <Layers className="h-5 w-5 text-indigo-400" />, path: '/admin/services' },
          { label: 'Products', count: stats.productsCount, icon: <Briefcase className="h-5 w-5 text-purple-400" />, path: '/admin/products' },
          { label: 'Portfolio', count: stats.projectsCount, icon: <FolderKanban className="h-5 w-5 text-pink-400" />, path: '/admin/portfolio' },
          { label: 'Articles', count: stats.blogsCount, icon: <BookOpen className="h-5 w-5 text-amber-400" />, path: '/admin/blogs' },
          { label: 'Leads', count: stats.contactsCount, icon: <MessageSquare className="h-5 w-5 text-emerald-400" />, path: '/admin/dashboard' },
          { label: 'About Page', count: 'CMS', icon: <FileText className="h-5 w-5 text-indigo-400" />, path: '/admin/about' },
          { label: 'Contact Page', count: 'CMS', icon: <Mail className="h-5 w-5 text-purple-400" />, path: '/admin/contact' }
        ].map((item, idx) => (
          <Link 
            href={item.path}
            key={idx} 
            className="premium-glass p-6 rounded-2xl border border-gray-800/80 flex items-center justify-between hover:border-indigo-500/30 transition-all duration-300"
          >
            <div>
              <span className="text-xs text-gray-400 block mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-white tracking-tight">{item.count}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gray-800/50 flex items-center justify-center border border-gray-700/30">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* ── LEADS & NOTIFICATIONS MONITOR ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8">
        
        <div className="premium-glass p-8 rounded-3xl border border-gray-800/80">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" /> Customer Leads (Messages)
          </h2>

          <div className="space-y-4">
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-5 rounded-2xl bg-gray-900/60 border flex flex-col justify-between gap-4 transition-all duration-300 ${
                    msg.status === 'UNREAD' 
                      ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.06)] bg-indigo-950/5' 
                      : 'border-gray-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                        {msg.status === 'UNREAD' && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wider animate-pulse">
                            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-indigo-400">{msg.email}</span>
                        {msg.company && (
                          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-medium">
                            🏢 {msg.company}
                          </span>
                        )}
                        {msg.projectType && (
                          <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 font-medium">
                            💼 {msg.projectType}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        {msg.status === 'UNREAD' ? (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'READ')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all duration-200"
                            title="Mark as Read"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Mark Read</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(msg.id, 'UNREAD')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all duration-200"
                            title="Mark as Unread"
                          >
                            <MailOpen className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Mark Unread</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="inline-flex items-center p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-400 transition-all duration-200"
                          title="Delete Message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-800/50 pt-3 w-full max-w-full overflow-hidden">
                    {msg.subject && (
                      <span className="block text-xs font-bold text-gray-300 mb-1 break-all">Subject: {msg.subject}</span>
                    )}
                    <p className="text-xs md:text-sm text-gray-400 whitespace-pre-wrap leading-relaxed break-all">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                <span className="text-xs">No active leads or contact form submissions yet.</span>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-800/60 pt-6 mt-6 gap-4">
                <span className="text-xs text-gray-400">
                  Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-white font-medium">
                    {Math.min(currentPage * itemsPerPage, contacts.length)}
                  </span>{' '}
                  of <span className="text-white font-medium">{contacts.length}</span> leads
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-gray-900 border border-gray-850 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                          : 'bg-gray-900 border border-gray-850 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-gray-900 border border-gray-850 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
