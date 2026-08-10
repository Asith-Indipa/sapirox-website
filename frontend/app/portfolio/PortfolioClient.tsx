'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/services/api';
import { Code, ArrowRight, FolderKanban } from 'lucide-react';

interface PortfolioClientProps {
  initialProjects: Project[];
}

export default function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(initialProjects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-[70vh] py-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          Case Studies
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 font-heading tracking-tight leading-tight">
          Proven Deployments & <br />
          <span className="premium-gradient-text">Software Architectures</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Browse through systems we have successfully built and deployed for our corporate partners and global startup networks.
        </p>
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all duration-350 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="premium-glass rounded-2xl overflow-hidden border border-gray-800 group hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail area */}
                <div className="h-44 w-full bg-gray-900/80 flex items-center justify-center relative overflow-hidden">
                  {project.coverImage ? (
                    <img 
                      src={project.coverImage} 
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-550"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-purple-950/20" />
                      <Code className="h-10 w-10 text-indigo-400/55 group-hover:scale-105 transition-transform duration-300" />
                    </>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{project.category}</span>
                    {project.projectType && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                        <span className="text-[10px] font-semibold text-gray-400">
                          {project.projectType === 'CLIENT_PROJECT' && 'Client Project'}
                          {project.projectType === 'IN_HOUSE_PRODUCT' && 'In-House Product'}
                          {project.projectType === 'INTERNAL_PROJECT' && 'Internal Project'}
                          {project.projectType === 'PROTOTYPE' && 'Prototype'}
                          {project.projectType === 'OPEN_SOURCE' && 'Open Source'}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-450 text-xs leading-relaxed line-clamp-3 mb-6">
                    {project.projectOverview || project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 mt-auto">
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technology.map((tech, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded bg-gray-800/85 text-gray-300 border border-gray-750/30">
                      {tech}
                    </span>
                  ))}
                </div>

                <Link 
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-1 duration-200"
                >
                  Read Case Study <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          // Fallback grid
          [
            { title: 'Corporate Portal V2', cat: 'Web Portal', desc: 'Secure company management tool with active user directory mapping and roles restrictions.', tech: ['React', 'Next.js', 'Auth0'] },
            { title: 'Global Retail Pipeline', cat: 'E-commerce', desc: 'Distributed database synchronization layer for global retail outlets and inventory maps.', tech: ['Node.js', 'Postgres', 'Redis'] },
            { title: 'Finance Data Engine', cat: 'Fintech', desc: 'High-speed reporting dashboard with automated PDF and excel report generation setups.', tech: ['FastAPI', 'Pandas', 'AWS'] }
          ].map((proj, idx) => (
            <div 
              key={idx} 
              className="premium-glass rounded-2xl overflow-hidden border border-gray-800 group hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-gray-900/60 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-purple-950/20" />
                  <FolderKanban className="h-10 w-10 text-indigo-500/40" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{proj.cat}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">{proj.title}</h3>
                  <p className="text-gray-450 text-xs leading-relaxed mb-6">{proj.desc}</p>
                </div>
              </div>

              <div className="px-6 pb-6 mt-auto">
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-2.5 py-0.5 rounded bg-gray-800 text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>

                <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Discuss Project <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
