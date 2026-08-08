'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';
import { setAuthToken, getAuthToken } from '@/services/auth';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If token already exists, redirect to dashboard
  useEffect(() => {
    if (getAuthToken()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<{ success: boolean; data: { token: string } }>('/auth/login', {
        method: 'POST',
        body: { email, password } as any,
      });

      if (response.success && response.data?.token) {
        setAuthToken(response.data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid response payload from backend.');
      }
    } catch (err: any) {
      console.error('Login error details:', err);
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-6">
      
      {/* Background Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />

      <div className="w-full max-w-md premium-glass p-8 rounded-3xl border border-gray-800/80">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Lock className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white font-heading">CMS Portal Login</h1>
          <p className="text-xs text-gray-400 mt-2">Enter credentials to manage Sapirox content directories</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 mb-6">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.g. admin@sapirox.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-550 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-550 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
