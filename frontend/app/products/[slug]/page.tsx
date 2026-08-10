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
        <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-8">The product you are looking for is currently unavailable or doesn't exist.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold">
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
      <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[110px] pointer-events-none" />

      {/* Back button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> All Products
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left column info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.category || 'Other'}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border ${
              product.status === 'AVAILABLE' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : product.status === 'BETA'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>
              {product.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {product.name}
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              href="/contact"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-white" /> {product.ctaText || 'Learn More'}
            </Link>
            {product.demoUrl && (
              <a 
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white font-bold text-sm hover:bg-gray-850 transition-colors flex items-center gap-2"
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
              className="w-full h-auto rounded-3xl border border-gray-800/80 shadow-2xl shadow-indigo-950/20 block"
            />
          </div>
        ) : (
          <div className="lg:col-span-5 relative w-full h-[220px] sm:h-[320px] rounded-3xl overflow-hidden border border-gray-850 bg-gray-900/40 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Product Overview details split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-800/60">
        
        {/* About description */}
        <div className={activeFeatures.length > 0 ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <h2 className="text-xl md:text-2xl font-bold text-white border-b border-gray-800 pb-2">About the Product</h2>
          <div className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
            {product.description}
          </div>
        </div>

        {/* Features sidebar card */}
        {activeFeatures.length > 0 && (
          <div className="premium-glass p-6 rounded-2xl border border-gray-800 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Key Features
            </h3>
            <ul className="space-y-3">
              {activeFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Business benefits row */}
      {activeBenefits.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-800/60">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">Business Benefits</h3>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Concrete impacts and outcomes achieved using our platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeBenefits.map((benefit, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-900/40 border border-gray-800/60 flex items-start gap-3.5 hover:border-indigo-500/20 transition-all duration-300">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Screenshots Gallery Section */}
      {activeScreenshots.length > 0 && (
        <div className="border-t border-gray-800/60">
          <ScreenshotsTabs screenshots={activeScreenshots} />
        </div>
      )}

      {/* How It Works Steps workflow */}
      {activeHowItWorks.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-800/60">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">How It Works</h3>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Simple process to configure and launch software solutions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...activeHowItWorks]
              .sort((a, b) => a.order - b.order)
              .map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-3 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="text-2xl font-black text-indigo-500/20">0{step.order || idx + 1}</div>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Target Users / Who It's For list */}
      {activeTargetUsers.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-800/60">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-xl md:text-2xl font-bold text-white">Who It's For</h3>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Tailored capabilities specifically matching these user profiles.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeTargetUsers.map((user, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-900/40 border border-gray-850 flex items-center gap-3 hover:border-indigo-500/20 transition-all duration-300">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300 font-medium">{user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technology & Integrations side-by-side cards */}
      {(activeTech.length > 0 || activeIntegrations.length > 0) && (
        <div className={`grid grid-cols-1 ${activeTech.length > 0 && activeIntegrations.length > 0 ? 'md:grid-cols-2' : ''} gap-8 pt-8 border-t border-gray-800/60`}>
          {/* Technologies Used */}
          {activeTech.length > 0 && (
            <div className="premium-glass p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white">Built With</h3>
              <div className="flex flex-wrap gap-2">
                {activeTech.map((tech, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Connectors/Integrations */}
          {activeIntegrations.length > 0 && (
            <div className="premium-glass p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white">Integrations & Connectors</h3>
              <div className="flex flex-wrap gap-2">
                {activeIntegrations.map((integ, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-900/30 text-indigo-300">
                    {integ}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA block */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-gray-900/40 border border-indigo-500/20 text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ready to see it in action?</h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">Discover how {product.name} can streamline your operations, save time, and boost business efficiency.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all duration-300"
          >
            {product.ctaText || 'Get Demo Access'}
          </Link>
          <Link
            href="/contact"
            className="py-3 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 border border-gray-800"
          >
            Talk to Sales
          </Link>
        </div>
      </div>

    </div>
  );
}
