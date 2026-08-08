import { Metadata } from 'next';
import Link from 'next/link';
import { ServiceSchema } from '@/components/seo';
import { apiFetch, Service } from '@/services/api';
import { Cpu, Layers, Globe, Shield, Code, Zap, Activity, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    // API is fully accessible on localhost
    const res = await fetch(`http://localhost:5000/api/services/${slug}`, { 
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
    <div className="relative min-h-[85vh] py-20 px-6 max-w-5xl mx-auto">
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

      {/* Detailed Description & Features section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-3">Service Overview</h2>
          <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base">
            {service.fullDescription}
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
    </div>
  );
}
