import { Metadata } from 'next';
import Link from 'next/link';
import { ProductSchema } from '@/components/seo';
import { apiFetch, Product } from '@/services/api';
import ScreenshotsTabs from '@/components/ScreenshotsTabs';
import { ArrowLeft, CheckCircle2, ChevronRight, Play, ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/products/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const product = json.data;
        const metaTitle = product.seoTitle && product.seoTitle.trim() !== '' 
          ? product.seoTitle 
          : `${product.name} | Sapirox`;
        const metaDescription = product.seoDescription && product.seoDescription.trim() !== '' 
          ? product.seoDescription 
          : product.shortDescription;
        const imageUrl = product.productImage && product.productImage.trim() !== '' 
          ? product.productImage 
          : undefined;

        return {
          title: metaTitle,
          description: metaDescription,
          openGraph: {
            title: metaTitle,
            description: metaDescription,
            images: imageUrl ? [{ url: imageUrl }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load product detail SEO metadata on server side:", err);
  }

  return {
    title: "Product Details | Sapirox",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product: Product | null = null;
  let error: string | null = null;

  try {
    const response = await apiFetch<{ success: boolean; data: Product }>(`/products/${slug}`);
    product = response.data;
  } catch (err: any) {
    console.error('Error fetching product detail on server side:', err);
    error = err.message || 'Product not found';
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for is currently unavailable or doesn't exist.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground border border-border font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const activeFeatures = (product.features || []).filter(f => f.trim() !== '');
  const activeBenefits = (product.benefits || []).filter(b => b.trim() !== '');
  const activeTech = (product.technology || []).filter(t => t.trim() !== '');
  const activeIntegrations = (product.integrations || []).filter(i => i.trim() !== '');
  const activeTargetUsers = (product.targetUsers || []).filter(u => u.trim() !== '');
  const activeScreenshots = (product.screenshots || []).filter(s => s.imageUrl && s.imageUrl.trim() !== '');
  const activeHowItWorks = (product.howItWorks || []).filter(step => step.title.trim() !== '');

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-5xl mx-auto space-y-12">
      <ProductSchema 
        name={product.name}
        description={product.shortDescription}
        image={product.productImage}
        slug={product.slug}
        tech={product.technology}
        status={product.status}
      />
      
      {/* Background glow */}
      <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[110px] pointer-events-none" />

      {/* Back button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> All Products
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left column info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              {product.category || 'Other'}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border ${
              product.status === 'AVAILABLE' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : product.status === 'BETA'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {product.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight break-words">
            {product.name}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed break-words">
            {product.shortDescription}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              href="/contact"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/10 transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-white" /> {product.ctaText || 'Learn More'}
            </Link>
            {product.demoUrl && (
              <a 
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-muted border border-border text-foreground font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Live Demo <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Right column main image */}
        {product.productImage && product.productImage.trim() !== '' ? (
          <div className="lg:col-span-5 relative w-full">
            <img 
              src={product.productImage} 
              alt={product.name} 
              className="w-full h-auto rounded-3xl border border-border/80 shadow-2xl shadow-primary/5 block"
            />
          </div>
        ) : (
          <div className="lg:col-span-5 relative w-full h-[220px] sm:h-[320px] rounded-3xl overflow-hidden border border-border bg-muted/40 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Product Overview details split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-border/60">
        
        {/* About description */}
        <div className={activeFeatures.length > 0 ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground border-b border-border pb-2">About the Product</h2>
          <div className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">
            {product.description}
          </div>
        </div>

        {/* Features sidebar card */}
        {activeFeatures.length > 0 && (
          <div className="premium-glass p-6 rounded-2xl border border-border space-y-4 h-fit">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              Key Features
            </h3>
            <ul className="space-y-3">
              {activeFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="break-words">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Business benefits row */}
      {activeBenefits.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/60">
          <div className="border-b border-border pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Business Benefits</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Concrete impacts and outcomes achieved using our platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeBenefits.map((benefit, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3.5 hover:border-primary/20 transition-all duration-300">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Screenshots Gallery Section */}
      {activeScreenshots.length > 0 && (
        <div className="border-t border-border/60">
          <ScreenshotsTabs screenshots={activeScreenshots} />
        </div>
      )}

      {/* How It Works Steps workflow */}
      {activeHowItWorks.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/60">
          <div className="border-b border-border pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">How It Works</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Simple process to configure and launch software solutions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...activeHowItWorks]
              .sort((a, b) => a.order - b.order)
              .map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl bg-muted/40 border border-border space-y-3 hover:border-primary/20 transition-all duration-300">
                  <div className="text-2xl font-black text-primary/20">0{step.order || idx + 1}</div>
                  <h4 className="text-sm font-bold text-foreground break-words">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">{step.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Target Users / Who It's For list */}
      {activeTargetUsers.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/60">
          <div className="border-b border-border pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">Who It's For</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Tailored capabilities specifically matching these user profiles.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeTargetUsers.map((user, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/40 border border-border flex items-center gap-3 hover:border-primary/20 transition-all duration-300">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground font-medium break-words">{user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technology & Integrations side-by-side cards */}
      {(activeTech.length > 0 || activeIntegrations.length > 0) && (
        <div className={`grid grid-cols-1 ${activeTech.length > 0 && activeIntegrations.length > 0 ? 'md:grid-cols-2' : ''} gap-8 pt-8 border-t border-border/60`}>
          {/* Technologies Used */}
          {activeTech.length > 0 && (
            <div className="premium-glass p-6 rounded-2xl border border-border space-y-4">
              <h3 className="text-base font-bold text-foreground">Built With</h3>
              <div className="flex flex-wrap gap-2">
                {activeTech.map((tech, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Connectors/Integrations */}
          {activeIntegrations.length > 0 && (
            <div className="premium-glass p-6 rounded-2xl border border-border space-y-4">
              <h3 className="text-base font-bold text-foreground">Integrations & Connectors</h3>
              <div className="flex flex-wrap gap-2">
                {activeIntegrations.map((integ, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-primary">
                    {integ}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA block */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-cyan-500/5 to-primary/5 border border-primary/20 text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Ready to see it in action?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">Discover how {product.name} can streamline your operations, save time, and boost business efficiency.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/10 transition-all duration-300"
          >
            {product.ctaText || 'Get Demo Access'}
          </Link>
          <Link
            href="/contact"
            className="py-3 px-6 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-sm transition-all duration-300 border border-border"
          >
            Talk to Sales
          </Link>
        </div>
      </div>

    </div>
  );
}
