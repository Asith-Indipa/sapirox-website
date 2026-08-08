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
  Globe
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
  subject?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {[
          { label: 'Services', count: stats.servicesCount, icon: <Layers className="h-5 w-5 text-indigo-400" />, path: '/admin/services' },
          { label: 'Products', count: stats.productsCount, icon: <Briefcase className="h-5 w-5 text-purple-400" />, path: '/admin/products' },
          { label: 'Portfolio', count: stats.projectsCount, icon: <FolderKanban className="h-5 w-5 text-pink-400" />, path: '/admin/portfolio' },
          { label: 'Articles', count: stats.blogsCount, icon: <BookOpen className="h-5 w-5 text-amber-400" />, path: '/admin/blogs' },
          { label: 'Leads', count: stats.contactsCount, icon: <MessageSquare className="h-5 w-5 text-emerald-400" />, path: '/admin/dashboard' }
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
            {contacts.length > 0 ? (
              contacts.map((msg) => (
                <div key={msg.id} className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                      <span className="text-xs text-indigo-400">{msg.email}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
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
          </div>
        </div>

      </div>

    </div>
  );
}
