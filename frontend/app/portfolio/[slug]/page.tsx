import { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch, Project } from '@/services/api';
import { ArrowLeft, FolderKanban, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`http://localhost:5000/api/portfolio/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const project = json.data;
        return {
          title: `${project.title} | Sapirox`,
          description: project.description.substring(0, 160),
          openGraph: {
            title: `${project.title} | Sapirox Case Studies`,
            description: project.description.substring(0, 160),
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load project detail SEO metadata on server side:", err);
  }

  return {
    title: "Project Details | Sapirox",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project: Project | null = null;
  let error: string | null = null;

  try {
    const response = await apiFetch<{ success: boolean; data: Project }>(`/portfolio/${slug}`);
    project = response.data;
  } catch (err: any) {
    console.error('Error fetching project details on server side:', err);
    error = err.message || 'Project not found';
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Project Not Found</h2>
        <p className="text-gray-450 mb-8">The project details are currently unavailable or the link has expired.</p>
        <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-5xl mx-auto">
      
      {/* Glow background */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Back Link */}
      <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> All Projects
      </Link>

      {/* Main Header */}
      <div className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          {project.category}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-heading">
          {project.title}
        </h1>
      </div>

      {/* Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Core Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-3">Project Summary</h2>
            <div className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {project.description}
            </div>
          </div>

          {/* Project mock images gallery if available */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-white">Project Screens & Deliverables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center relative">
                    <FolderKanban className="h-8 w-8 text-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          
          <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold text-white">System Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technology.map((tech, idx) => (
                <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-350">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Deployment Status</h3>
            <div className="flex items-center gap-3 text-sm text-gray-350">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Production Deployed</span>
            </div>
            <div className="pt-6 border-t border-gray-800/80">
              <Link 
                href="/contact"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 text-sm transition-all duration-300"
              >
                Launch Similar Project
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
