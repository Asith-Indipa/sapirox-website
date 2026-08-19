import { Metadata } from 'next';
import Link from 'next/link';
import { ServiceSchema } from '@/components/seo';
import { apiFetch, Service, getFullImageUrl } from '@/services/api';
import { Cpu, Layers, Globe, Shield, Code, Zap, Activity, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import ProjectCards from './ProjectCards';

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
        const metaTitle = service.seoTitle && service.seoTitle.trim() !== '' 
          ? service.seoTitle 
          : `${service.title} | Sapirox`;
        const metaDesc = service.seoDescription && service.seoDescription.trim() !== ''
          ? service.seoDescription
          : service.shortDescription;
        return {
          title: metaTitle,
          description: metaDesc,
          openGraph: {
            title: metaTitle,
            description: metaDesc,
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
      case 'cpu': return <Cpu className="h-10 w-10 text-primary" />;
      case 'layers': return <Layers className="h-10 w-10 text-cyan-500 dark:text-cyan-400" />;
      case 'globe': return <Globe className="h-10 w-10 text-blue-500 dark:text-blue-400" />;
      case 'shield': return <Shield className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />;
      case 'code': return <Code className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />;
      case 'zap': return <Zap className="h-10 w-10 text-amber-500 dark:text-amber-400" />;
      default: return <Activity className="h-10 w-10 text-primary" />;
    }
  };

  if (error || !service) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h2>
        <p className="text-muted-foreground mb-8">The service you are looking for does not exist or has been unpublished.</p>
        <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground border border-border font-semibold">
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
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> All Services
      </Link>

      {/* Service Header Info */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          {renderIcon(service.icon)}
        </div>
        <div className="min-w-0 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight font-heading break-words">
            {service.title}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed break-words">{service.shortDescription}</p>
        </div>
      </div>

      {/* Service Cover Image */}
      {service.image && service.image.trim() !== '' && (
        <div className="relative w-full max-w-2xl mb-12 overflow-hidden rounded-3xl border border-border/80 shadow-2xl shadow-primary/5">
          <img 
            src={getFullImageUrl(service.image)} 
            alt={service.title} 
            className="w-full h-auto block"
          />
        </div>
      )}

      {/* Detailed Description & Features section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Technologies section */}
          {service.technologies && service.technologies.length > 0 && (
            <div className="p-6 rounded-2xl bg-primary/[0.03] border border-primary/10 backdrop-blur-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Technologies Powered By</h3>
              <div className="flex flex-wrap gap-2.5">
                {service.technologies.map((tech) => (
                  <span key={tech} className="px-3.5 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-3">Service Overview</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base break-words">
              {service.fullDescription}
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="premium-glass p-8 rounded-3xl border border-border h-fit space-y-6">
          <h3 className="text-lg font-bold text-foreground">Included Features</h3>
          <ul className="space-y-4">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="break-words">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-border/80">
            <Link 
              href="/contact" 
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 text-sm transition-all duration-300 shadow-md shadow-cyan-500/10"
            >
              Get Started <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Related Projects section */}
      {service.projects && service.projects.length > 0 && (
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-heading">
            Our Case Studies
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Real-world solutions built using this capability.
          </p>
          
          <ProjectCards projects={service.projects} />
        </div>
      )}
    </div>
  );
}
