import { Metadata } from 'next';
import Link from 'next/link';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getServices, Service, getFullImageUrl } from '@/services/api';
import { Cpu, Layers, Globe, Shield, Code, Zap, Activity, CheckCircle, ArrowRight, Star } from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Bespoke Tech Services";
  const fallbackDesc = "We architect secure, high-concurrency systems, cloud-ready frameworks, and custom administration software.";
  
  try {
    const encodedPath = encodeURIComponent('/services');
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/seo/${encodedPath}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        return {
          title: data.metaTitle || fallbackTitle,
          description: data.metaDescription || fallbackDesc,
          keywords: data.keywords || "Sapirox,Services,Software Development,API",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load Services page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

export default async function ServicesPage() {
  let services: Service[] = [];
  let isError = false;
  
  try {
    services = await getServices();
  } catch (error) {
    isError = true;
    console.error('Failed to load services on server side:', error);
  }

  const renderIcon = (iconName: string, sizeClass = "h-8 w-8") => {
    switch (iconName?.toLowerCase()) {
      case 'cpu': return <Cpu className={`${sizeClass} text-primary animate-pulse`} />;
      case 'layers': return <Layers className={`${sizeClass} text-cyan-500 dark:text-cyan-400`} />;
      case 'globe': return <Globe className={`${sizeClass} text-blue-500 dark:text-blue-400`} />;
      case 'shield': return <Shield className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'code': return <Code className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'zap': return <Zap className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      default: return <Activity className={`${sizeClass} text-primary`} />;
    }
  };

  return (
    <div className="relative min-h-[85vh] py-20 px-6 md:px-12 lg:px-20 max-w-[1536px] mx-auto w-full overflow-hidden">
      <ItemListSchema 
        items={services.map((s, idx) => ({
          name: s.title,
          url: `https://sapirox.com/services/${s.slug}`,
          position: idx + 1
        }))}
      />
      <CustomSchema path="/services" />
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          Our Capabilities
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mt-6 mb-6 font-heading tracking-tight leading-tight">
          Bespoke Tech Services <br />
          <span className="premium-gradient-text">Engineered for Scale</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We architect secure, high-concurrency systems, cloud-ready frameworks, and custom administration software targeted to improve business workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isError ? (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
            <p className="text-rose-500 dark:text-rose-400 font-medium">
              Something went wrong while loading our services. Please try again later.
            </p>
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <Link 
              key={service.id} 
              href={`/services/${service.slug}`}
              className="premium-glass rounded-2xl border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.01] group transition-all duration-300 flex flex-col justify-between min-w-0 w-full overflow-hidden"
            >
              <div>
                {/* Thumbnail area with smaller floating icon overlay */}
                <div className="aspect-video w-full bg-muted/20 flex items-center justify-center relative overflow-hidden border-b border-border/40">
                  {service.image ? (
                    <img 
                      src={getFullImageUrl(service.image)} 
                      alt={service.title}
                      className="h-full w-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/15" />
                  )}

                  {/* Small Icon container floating in bottom-left */}
                  <div className="absolute bottom-3 left-3 h-10 w-10 rounded-lg bg-background/90 backdrop-blur-sm border border-border/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(service.icon, "h-5 w-5")}
                  </div>

                  {/* Featured label overlay */}
                  {service.isFeatured && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                      <Star className="h-3 w-3 fill-white" /> Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-3 break-words">{service.title}</h2>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-4 break-words">{service.shortDescription}</p>

                  <ul className="space-y-2 mb-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="px-6 pb-6 pt-2">
                <div 
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-85 transition-opacity group-hover:translate-x-1 duration-200"
                >
                  View Service Details <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
            <p className="text-muted-foreground font-medium">
              No services available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
