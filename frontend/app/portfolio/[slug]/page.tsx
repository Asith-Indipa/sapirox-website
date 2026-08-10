import { Metadata } from 'next';
import Link from 'next/link';
import { apiFetch, Project, getFullImageUrl } from '@/services/api';
import { ArrowLeft, FolderKanban, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

const projectTypeLabels: Record<string, string> = {
  CLIENT_PROJECT: 'Client Project',
  IN_HOUSE_PRODUCT: 'In-House Product',
  INTERNAL_PROJECT: 'Internal Project',
  PROTOTYPE: 'Prototype',
  OPEN_SOURCE: 'Open Source'
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/portfolio/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const project = json.data;
        const metaDesc = (project.projectOverview || project.description).substring(0, 160);
        const imageUrl = project.coverImage ? getFullImageUrl(project.coverImage) : undefined;
        return {
          title: `${project.title} | Sapirox`,
          description: metaDesc,
          openGraph: {
            title: `${project.title} | Sapirox Case Studies`,
            description: metaDesc,
            images: imageUrl ? [imageUrl] : [],
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
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          {project.projectType && (
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              {projectTypeLabels[project.projectType] || project.projectType}
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-heading">
          {project.title}
        </h1>
        {project.projectOverview && (
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl border-l-2 border-indigo-500 pl-4 py-1">
            {project.projectOverview}
          </p>
        )}
      </div>

      {/* Project Cover Image */}
      {project.coverImage && (
        <div className="relative w-full mb-12 max-w-4xl">
          <img 
            src={getFullImageUrl(project.coverImage)} 
            alt={project.title} 
            className="w-full h-auto rounded-3xl border border-gray-850/80 shadow-2xl shadow-indigo-950/20 block"
          />
        </div>
      )}

      {/* Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Core Description */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-3">Project Summary</h2>
            <div className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {project.description}
            </div>
          </div>

          {/* Challenge and Solution */}
          {(project.challenge || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {project.challenge && (
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/20 space-y-3">
                  <h3 className="text-base font-bold text-rose-400 uppercase tracking-wider">The Challenge</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
                </div>
              )}
              {project.solution && (
                <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/20 space-y-3">
                  <h3 className="text-base font-bold text-indigo-400 uppercase tracking-wider">Our Solution</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{project.solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-3">Key Features Implemented</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-gray-900/40 p-4 rounded-xl border border-gray-850">
                    <span className="mt-1 flex items-center justify-center h-4 w-4 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold shrink-0">✓</span>
                    <span className="text-gray-350 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Outcomes */}
          {project.projectOutcome && project.projectOutcome.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-950/30 pb-3">Key Outcomes & Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.projectOutcome.map((outcome, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-emerald-950/15 p-4 rounded-xl border border-emerald-900/20">
                    <span className="mt-1 flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">★</span>
                    <span className="text-gray-350 text-sm leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Project Gallery */}
          {project.projectGallery && project.projectGallery.length > 0 && (
            <div className="space-y-6 pt-8">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-3">Project Showcase Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.projectGallery.map((item, idx) => (
                  <div key={idx} className="group premium-glass rounded-2xl overflow-hidden border border-gray-850 bg-gray-950 flex flex-col justify-between">
                    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden border-b border-gray-850">
                      <img 
                        src={item.url} 
                        alt={item.title || `Gallery showcase ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {(item.title || item.description) && (
                      <div className="p-4 bg-gray-950/80">
                        {item.title && <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>}
                        {item.description && <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy Gallery fallback */}
          {(!project.projectGallery || project.projectGallery.length === 0) && project.gallery && project.gallery.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-white">Project Screens & Deliverables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {project.gallery.map((img, idx) => (
                  <div key={idx} className="relative w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-indigo-950/10">
                    <img 
                      src={img} 
                      alt={`Project Screenshot ${idx + 1}`} 
                      className="w-full h-auto block"
                    />
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

          {/* Services Delivered */}
          {project.servicesDelivered && project.servicesDelivered.length > 0 && (
            <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Services Delivered</h3>
              <ul className="space-y-2">
                {project.servicesDelivered.map((service, idx) => (
                  <li key={idx} className="text-xs text-gray-350 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Resources */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Project Resources</h3>
              <div className="flex flex-col gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-900 border border-gray-800 text-indigo-400 hover:text-indigo-300 font-semibold text-center text-xs transition-colors"
                  >
                    Visit Live Application
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white font-semibold text-center text-xs transition-colors"
                  >
                    View Source Code (GitHub)
                  </a>
                )}
              </div>
            </div>
          )}

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
