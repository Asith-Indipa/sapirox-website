import { Metadata } from 'next';
import Link from 'next/link';
import { ArticleSchema } from '@/components/seo';
import { apiFetch, Blog } from '@/services/api';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`http://localhost:5000/api/blogs/${slug}`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const blog = json.data;
        return {
          title: `${blog.title} | Sapirox`,
          description: blog.content.substring(0, 160),
          openGraph: {
            title: `${blog.title} | Sapirox Blog`,
            description: blog.content.substring(0, 160),
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
        <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
        <p className="text-gray-455 mb-8">The engineering resource you requested does not exist or has been archived.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="relative min-h-[85vh] py-20 px-6 max-w-3xl mx-auto">
      <ArticleSchema 
        title={blog.title}
        description={blog.content.substring(0, 160)}
        coverImage={blog.coverImage}
        slug={blog.slug}
        datePublished={blog.publishedDate}
        category={blog.category?.name || 'Technology'}
      />
      
      {/* Background glow */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-12">
        <ArrowLeft className="h-4 w-4" /> Back to Insights
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          {blog.category.name}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-6 mb-6 leading-tight tracking-tight font-heading">
          {blog.title}
        </h1>

        {/* Metadata section */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 border-y border-gray-800/80 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content markup */}
      <div className="text-gray-350 leading-relaxed text-sm md:text-base whitespace-pre-wrap space-y-6">
        {blog.content}
      </div>

      {/* Tag taxonomy area */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-800/80">
          <h3 className="text-sm font-semibold text-gray-450 uppercase mb-4 tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4" /> Associated Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag.slug} className="text-xs px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-300">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
