'use client';

import { useRouter } from 'next/navigation';
import { getFullImageUrl } from '@/services/api';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  gallery?: string[];
  technology: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectCards({ projects }: { projects: Project[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div 
          key={project.id} 
          onClick={() => router.push(`/portfolio/${project.slug}`)}
          className="premium-glass rounded-2xl overflow-hidden border border-border group hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div>
            {(project.coverImage || (project.gallery && project.gallery[0])) && (
              <div className="relative w-full aspect-video bg-muted/20 border-b border-border/40 overflow-hidden">
                <img 
                  src={getFullImageUrl(project.coverImage || project.gallery![0])} 
                  alt={project.title} 
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-550 block"
                />
              </div>
            )}
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {project.category}
              </span>
              <h3 className="text-xl font-bold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{project.description}</p>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technology.map((tech, idx) => (
                <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-3">
              <span className="text-xs font-bold text-primary group-hover:opacity-85 transition-opacity inline-flex items-center gap-1">
                Read Case Study &rarr;
              </span>

              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Live Demo"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="GitHub Repository"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="h-4 w-4" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
