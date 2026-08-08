import { Metadata } from 'next';
import Link from 'next/link';
import { ProductSchema } from '@/components/seo';
import { apiFetch, Product } from '@/services/api';
import { ArrowLeft, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`http://localhost:5000/api/products/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const product = json.data;
        return {
          title: `${product.name} | Sapirox`,
          description: product.shortDescription,
          openGraph: {
            title: `${product.name} | Sapirox Products`,
            description: product.shortDescription,
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
        <p className="text-gray-455 mb-8">The product you are looking for is currently unavailable or doesn't exist.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-5xl mx-auto">
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
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> All Products
      </Link>

      {/* Header section */}
      <div className="mb-12">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border ${
          product.status === 'ACTIVE' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : product.status === 'BETA'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        }`}>
          {product.status}
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-heading">
          {product.name}
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          {product.shortDescription}
        </p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
        
        {/* Main description details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-3">About the Product</h2>
            <div className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {product.description}
            </div>
          </div>

          {/* Benefits section */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-white">Key Business Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar settings */}
        <div className="space-y-8">
          
          {/* Features panel */}
          <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Product Features</h3>
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-indigo-400 shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack panel */}
          <div className="premium-glass p-8 rounded-3xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {product.technology.map((tech, idx) => (
                <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-350">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="pt-6 border-t border-gray-800/80">
              <Link 
                href={product.demoUrl || '/contact'}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 text-sm shadow-md transition-all duration-300"
              >
                {product.ctaText || 'Get Demo Access'} <MessageSquare className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
