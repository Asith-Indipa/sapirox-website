'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, getFullImageUrl } from '@/services/api';
import { Code, ArrowRight, FolderKanban } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface PortfolioClientProps {
  initialProjects: Project[];
  isError?: boolean;
}

export default function PortfolioClient({ initialProjects, isError = false }: PortfolioClientProps) {
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
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Header section */}
      <ScrollReveal className="max-w-3xl mb-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            Case Studies
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mt-6 mb-6 font-heading tracking-tight leading-tight">
            Proven Deployments & <br />
            <span className="premium-gradient-text">Software Architectures</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Browse through systems we have successfully built and deployed for our corporate partners and global startup networks.
          </p>
        </div>
      </ScrollReveal>

      {/* Category Filters */}
      {categories.length > 1 && (
        <ScrollReveal delayClass="animation-delay-100" className="w-full flex">
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all duration-350 ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 cursor-pointer'
                    : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border cursor-pointer'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isError ? (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
            <p className="text-rose-500 dark:text-rose-400 font-medium">
              Something went wrong while loading our case studies. Please try again later.
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delayClass={`animation-delay-${(index % 3) * 100}`} className="w-full flex">
              <Link 
                href={`/portfolio/${project.slug}`}
                className="premium-glass rounded-2xl overflow-hidden border border-border group hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full"
              >
                <div>
                  <div className="w-full aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden border-b border-border/40">
                    {project.coverImage ? (
                      <img 
                        src={getFullImageUrl(project.coverImage)} 
                        alt={project.title}
                        className="h-full w-full object-contain group-hover:scale-[1.02] transition-transform duration-550"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/15" />
                        <Code className="h-10 w-10 text-primary/45 group-hover:scale-105 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{project.category}</span>
                      {project.projectType && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-border" />
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {project.projectType === 'CLIENT_PROJECT' && 'Client Project'}
                            {project.projectType === 'IN_HOUSE_PRODUCT' && 'In-House Product'}
                            {project.projectType === 'INTERNAL_PROJECT' && 'Internal Project'}
                            {project.projectType === 'PROTOTYPE' && 'Prototype'}
                            {project.projectType === 'OPEN_SOURCE' && 'Open Source'}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors break-words">{project.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-6 break-words">
                      {project.projectOverview || project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technology.map((tech, idx) => (
                      <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/40 dark:border-muted-foreground/25 dark:bg-muted/30">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span 
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:opacity-85 transition-opacity"
                  >
                    Read Case Study <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))
        ) : (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
            <p className="text-muted-foreground font-medium">
              No case studies available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
