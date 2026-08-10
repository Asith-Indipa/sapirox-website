import { Metadata } from 'next';
import Link from 'next/link';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getProducts, Product } from '@/services/api';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Proprietary Software Solutions";
  const fallbackDesc = "Explore out-of-the-box business solutions designed by Sapirox to automate billing pipelines and monitor user events.";
  
  try {
    const encodedPath = encodeURIComponent('/products');
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
          keywords: data.keywords || "Sapirox,Products,SaaS,Software",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load Products page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error('Failed to load products on server side:', error);
  }

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-7xl mx-auto">
      <ItemListSchema 
        items={products.map((p, idx) => ({
          name: p.name,
          url: `https://sapirox.com/products/${p.slug}`,
          position: idx + 1
        }))}
      />
      <CustomSchema path="/products" />
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          In-House Solutions
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 font-heading tracking-tight leading-tight">
          Proprietary Software & <br />
          <span className="premium-gradient-text">Enterprise SaaS Products</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Explore out-of-the-box business solutions designed by Sapirox to automate billing pipelines, optimize content creation, and monitor user events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border ${
                    product.status === 'AVAILABLE' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : product.status === 'BETA'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {product.status.replace('_', ' ')}
                  </span>
                  {product.category && (
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {product.category}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{product.name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{product.shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.technology.map((tech, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-gray-800/80 text-gray-300 border border-gray-700/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-355 group-hover:text-indigo-400 transition-colors">
                  Ready to learn more?
                </span>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-300">
                  {product.ctaText || 'Learn More'} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Static Premium Fallback Products
          <>
            <Link 
              href="/contact" 
              className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
                  BETA TESTING
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">Sapirox Enterprise CMS</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  An API-first modern content delivery framework built to provide super-fast static output generation and secure API interfaces.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'Prisma', 'PostgreSQL', 'TailwindCSS'].map((tech, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gray-800/80 text-gray-300 border border-gray-750/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-400 transition-colors">Access beta panel</span>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                  Request Access <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link 
              href="/contact" 
              className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="p-8">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-6">
                  COMING SOON
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">Pulse CRM & ERP</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Integrated administrative dashboard to help startups monitor sales channels, manage invoices, support requests, and user logs.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Express.js', 'Postgres', 'WebSockets', 'Chart.js'].map((tech, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gray-800/80 text-gray-300 border border-gray-750/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-400 transition-colors">Join waiting list</span>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-850 text-white text-sm font-semibold border border-gray-700/40">
                  Join waitlist <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
