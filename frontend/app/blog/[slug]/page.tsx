import { Metadata } from 'next';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo';
import { apiFetch, Blog, getFullImageUrl } from '@/services/api';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/blogs/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const blog = json.data;
        const pageTitle = blog.seoTitle || `${blog.title} | Sapirox`;
        const pageDesc = blog.seoDescription || blog.excerpt || blog.content.substring(0, 160);
        return {
          title: pageTitle,
          description: pageDesc,
          openGraph: {
            title: pageTitle,
            description: pageDesc,
            images: blog.coverImage ? [getFullImageUrl(blog.coverImage)] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load blog detail SEO metadata on server side:", err);
  }

  return {
    title: "Article Details | Sapirox",
  };
}

const getSafeDateString = (dateVal: string | null | undefined, fallbackVal?: string | null | undefined): string => {
  const target = dateVal || fallbackVal;
  if (!target) return 'Draft';
  const d = new Date(target);
  if (isNaN(d.getTime()) || d.getTime() === 0) return 'Draft';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let blog: Blog | null = null;
  let error: string | null = null;

  try {
    const response = await apiFetch<{ success: boolean; data: Blog }>(`/blogs/${slug}`);
    blog = response.data;
  } catch (err: any) {
    console.error('Error fetching blog detail on server side:', err);
    error = err.message || 'Article not found';
  }

  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The engineering resource you requested does not exist or has been archived.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground border border-border font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="relative min-h-[85vh] py-20 px-6 max-w-3xl mx-auto">
      <ArticleSchema 
        title={blog.title}
        description={blog.seoDescription || blog.excerpt || blog.content.substring(0, 160)}
        coverImage={getFullImageUrl(blog.coverImage)}
        slug={blog.slug}
        datePublished={blog.publishedDate || blog.createdAt || ''}
        category={blog.category?.name || 'Technology'}
      />
      
      {/* Background glow */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to Insights
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <span className="text-xs text-primary font-semibold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          {blog.category.name}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mt-6 mb-6 leading-tight tracking-tight font-heading break-words">
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary pl-4 font-medium italic break-words">
            {blog.excerpt}
          </p>
        )}

        {/* Metadata section */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-y border-border py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/80" />
            <span>{getSafeDateString(blog.publishedDate, blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary/80" />
            <span>{blog.author?.email ? blog.author.email.split('@')[0] : 'admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/80" />
            <span>{blog.readingTime || 5} min read</span>
          </div>
        </div>
      </header>

      {/* Blog Cover Image */}
      {blog.coverImage && blog.coverImage.trim() !== '' && (
        <div className="relative w-full mb-12 bg-muted rounded-3xl overflow-hidden border border-border/85 shadow-2xl shadow-primary/5">
          <img 
            src={getFullImageUrl(blog.coverImage) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} 
            alt={blog.coverImageAlt || blog.title} 
            className="w-full h-auto block"
          />
        </div>
      )}

      {/* Article Content markup */}
      <div className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-wrap space-y-6 break-words">
        {blog.content}
      </div>

      {/* Tag taxonomy area */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4 tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4" /> Associated Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag.slug} className="text-xs px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
