import { Metadata } from 'next';
import Link from 'next/link';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getProducts, Product, getFullImageUrl } from '@/services/api';
import { ArrowRight, ExternalLink, Code } from 'lucide-react';

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
  let isError = false;

  try {
    products = await getProducts();
  } catch (error) {
    isError = true;
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
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          In-House Solutions
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mt-6 mb-6 font-heading tracking-tight leading-tight">
          Proprietary Software & <br />
          <span className="premium-gradient-text">Enterprise SaaS Products</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Explore out-of-the-box business solutions designed by Sapirox to automate billing pipelines, optimize content creation, and monitor user events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isError ? (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
            <p className="text-rose-500 dark:text-rose-400 font-medium">
              Something went wrong while loading our products. Please try again later.
            </p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="premium-glass rounded-2xl overflow-hidden border border-border flex flex-col justify-between hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 group"
            >
              <div>
                {/* Thumbnail area */}
                <div className="aspect-video w-full bg-muted/20 flex items-center justify-center relative overflow-hidden border-b border-border/40">
                  {product.productImage ? (
                    <img 
                      src={getFullImageUrl(product.productImage)} 
                      alt={product.name}
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
                  <div className="flex items-center gap-2 mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border ${
                      product.status === 'AVAILABLE' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : product.status === 'BETA'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {product.status.replace('_', ' ')}
                    </span>
                    {product.category && (
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors break-words">{product.name}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 break-words">{product.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.technology.map((tech, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/40 dark:border-muted-foreground/25 dark:bg-muted/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/40 border-t border-border/40 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Ready to learn more?
                </span>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-cyan-500/10">
                  {product.ctaText || 'Learn More'} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
            <p className="text-muted-foreground font-medium">
              No proprietary products available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
