import { Metadata } from 'next';
import Link from 'next/link';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getServices, Service } from '@/services/api';
import { Cpu, Layers, Globe, Shield, Code, Zap, Activity, CheckCircle, ArrowRight } from 'lucide-react';

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
  
  try {
    services = await getServices();
  } catch (error) {
    console.error('Failed to load services on server side:', error);
  }

  const renderIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'cpu': return <Cpu className="h-8 w-8 text-primary animate-pulse" />;
      case 'layers': return <Layers className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />;
      case 'globe': return <Globe className="h-8 w-8 text-blue-500 dark:text-blue-400" />;
      case 'shield': return <Shield className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />;
      case 'code': return <Code className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />;
      case 'zap': return <Zap className="h-8 w-8 text-amber-500 dark:text-amber-400" />;
      default: return <Activity className="h-8 w-8 text-primary" />;
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
        {services.length > 0 ? (
          services.map((service) => (
            <div 
              key={service.id} 
              className="premium-glass p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {renderIcon(service.icon)}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{service.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">{service.shortDescription}</p>
              </div>
              
              <div>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-85 transition-opacity group-hover:translate-x-1 duration-200"
                >
                  View Service Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          // Custom premium placeholders
          [
            { title: 'Web Application Development', desc: 'Custom enterprise-grade web apps built using Next.js and secure APIs.', icon: 'cpu', feats: ['Real-time synchronization', 'SEO optimized structures', 'Scalable cloud deployment'] },
            { title: 'CMS & Content Management', desc: 'Secure, modern content distribution setups with simple admin inputs.', icon: 'layers', feats: ['Bespoke administration dashboards', 'Role access rules', 'API ready head setups'] },
            { title: 'E-commerce & SaaS Products', desc: 'Custom digital sales pipelines, billing platforms and business tools.', icon: 'globe', feats: ['Secure payments integrations', 'High speed server routing', 'Analytical reporting panels'] }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="premium-glass p-8 rounded-2xl border border-border hover:border-primary/20 group transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  {renderIcon(item.icon)}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{item.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.desc}</p>
              </div>
              
              <div>
                <ul className="space-y-3 mb-8">
                  {item.feats.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-85 transition-opacity"
                >
                  Discuss Requirement <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
