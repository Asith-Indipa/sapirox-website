'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Blog } from '@/services/api';
import { ArrowRight, Calendar, Search, User } from 'lucide-react';

interface BlogClientProps {
  initialBlogs: Blog[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = initialBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.category.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-7xl mx-auto">
      {/* Glow effect */}
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          Developer Insights
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 font-heading tracking-tight leading-tight">
          The Sapirox Engineering <br />
          <span className="premium-gradient-text">and Technology Blog</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Deep-dives into scalable software architectures, database performance optimization, security, and developer guidelines.
        </p>
      </div>

      {/* Search Input bar */}
      <div className="relative max-w-md mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles, categories or tags..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <article 
              key={blog.id} 
              className="premium-glass rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    {blog.category.name}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors leading-snug">
                  {blog.title}
                </h2>
                <p className="text-gray-450 text-xs leading-relaxed line-clamp-3 mb-6">
                  {blog.content}
                </p>
              </div>

              <div className="p-6 bg-gray-900/40 border-t border-gray-850/40 flex flex-col gap-4">
                <div className="flex items-center justify-between text-[11px] text-gray-450">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(blog.publishedDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {blog.author?.email.split('@')[0]}
                  </span>
                </div>

                <Link 
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-indigo-400 transition-colors"
                >
                  Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))
        ) : (
          // Static fallback blog lists
          [
            { title: 'Scaling Next.js API Routes Under Concurrency', cat: 'Development', date: 'August 05, 2026' },
            { title: 'Configuring JWT Role Access Controls with Prisma Schema Maps', cat: 'Security', date: 'July 28, 2026' },
            { title: 'Optimizing Supabase PostgreSQL connection limits on Serverless', cat: 'Database', date: 'July 14, 2026' }
          ].map((item, idx) => (
            <article 
              key={idx} 
              className="premium-glass rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between group"
            >
              <div className="p-6">
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{item.cat}</span>
                <h3 className="text-lg font-bold text-white mt-3 mb-3 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-455 text-xs leading-relaxed">
                  Technical deep dive outlining optimized structural guidelines to scale applications and resolve common infrastructure bottlenecks.
                </p>
              </div>

              <div className="p-6 bg-gray-900/40 border-t border-gray-855/40 flex flex-col gap-4">
                <div className="flex items-center justify-between text-[11px] text-gray-450">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> dev.team
                  </span>
                </div>

                <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-indigo-400 transition-colors">
                  Request Info <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
