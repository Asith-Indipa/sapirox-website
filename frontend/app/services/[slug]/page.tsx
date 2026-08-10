import { Metadata } from 'next';
import Link from 'next/link';
import { ServiceSchema } from '@/components/seo';
import { apiFetch, Service } from '@/services/api';
import { Cpu, Layers, Globe, Shield, Code, Zap, Activity, CheckCircle, ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/services/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const service = json.data;
        return {
          title: `${service.title} | Sapirox`,
          description: service.shortDescription,
          openGraph: {
            title: `${service.title} | Sapirox Services`,
            description: service.shortDescription,
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load service detail SEO metadata on server side:", err);
  }

  return {
    title: "Service Details | Sapirox",
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let service: Service | null = null;
  let error: string | null = null;

  try {
    // Calling apiFetch works perfectly on server side too
    const response = await apiFetch<{ success: boolean; data: Service }>(`/services/${slug}`);
    service = response.data;
  } catch (err: any) {
    console.error('Error fetching service detail on server side:', err);
    error = err.message || 'Service not found';
  }

  const renderIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'cpu': return <Cpu className="h-10 w-10 text-indigo-400" />;
      case 'layers': return <Layers className="h-10 w-10 text-purple-400" />;
      case 'globe': return <Globe className="h-10 w-10 text-pink-400" />;
      case 'shield': return <Shield className="h-10 w-10 text-emerald-400" />;
      case 'code': return <Code className="h-10 w-10 text-blue-400" />;
      case 'zap': return <Zap className="h-10 w-10 text-amber-400" />;
      default: return <Activity className="h-10 w-10 text-indigo-400" />;
    }
  };

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Service Not Found</h2>
        <p className="text-gray-450 mb-8">The service you are looking for does not exist or has been unpublished.</p>
        <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-20 px-6 md:px-12 lg:px-20 max-w-[1536px] mx-auto w-full overflow-hidden">
      <ServiceSchema 
        title={service.title}
        description={service.shortDescription}
        features={service.features}
      />
      
      {/* Background glow effects */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <Link href="/services" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> All Services
      </Link>

      {/* Service Header Info */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          {renderIcon(service.icon)}
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-heading">
            {service.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{service.shortDescription}</p>
        </div>
      </div>

      {/* Service Cover Image */}
      {service.image && service.image.trim() !== '' && (
        <div className="relative w-full mb-12 max-w-4xl">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-auto rounded-3xl border border-gray-800/80 shadow-2xl shadow-indigo-950/20 block"
          />
        </div>
      )}

      {/* Detailed Description & Features section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Technologies section */}
          {service.technologies && service.technologies.length > 0 && (
            <div className="p-6 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/10 backdrop-blur-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-4">Technologies Powered By</h3>
              <div className="flex flex-wrap gap-2.5">
                {service.technologies.map((tech) => (
                  <span key={tech} className="px-3.5 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:border-indigo-500/40 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-3">Service Overview</h2>
            <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base">
              {service.fullDescription}
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="premium-glass p-8 rounded-3xl border border-gray-800 h-fit space-y-6">
          <h3 className="text-lg font-bold text-white">Included Features</h3>
          <ul className="space-y-4">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-300">
                <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-gray-800/80">
            <Link 
              href="/contact" 
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 text-sm transition-all duration-300 shadow-md shadow-indigo-500/10"
            >
              Get Started <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Related Projects section */}
      {service.projects && service.projects.length > 0 && (
        <div className="mt-20 pt-12 border-t border-gray-900">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading">
            Our Case Studies
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Real-world solutions built using this capability.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {service.projects.map((project) => (
              <div key={project.id} className="premium-glass rounded-2xl overflow-hidden border border-gray-800 group hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {(project.coverImage || (project.gallery && project.gallery[0])) && (
                    <Link href={`/portfolio/${project.slug}`} className="relative h-48 w-full overflow-hidden block">
                      <img 
                        src={project.coverImage || project.gallery[0]} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 block"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    </Link>
                  )}
                  <div className="p-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-3 mb-2 hover:text-indigo-400 transition-colors">
                      <Link href={`/portfolio/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{project.description}</p>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technology.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/40 gap-3">
                    <Link 
                      href={`/portfolio/${project.slug}`}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                    >
                      Read Case Study &rarr;
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-450 hover:text-indigo-400 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-450 hover:text-white transition-colors"
                          title="GitHub Repository"
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
        </div>
      )}
    </div>
  );
}
