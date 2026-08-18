import { Metadata } from 'next';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getBlogs, Blog } from '@/services/api';
import BlogClient from './BlogClient';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Engineering & Design Blog";
  const fallbackDesc = "Read modern technical guidelines, architecture solutions, and articles written by Sapirox developers.";
  
  try {
    const encodedPath = encodeURIComponent('/blog');
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
          keywords: data.keywords || "Sapirox,Blog,Tech,Software",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load Blog page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

export default async function BlogPage() {
  let blogs: Blog[] = [];
  let isError = false;

  try {
    blogs = await getBlogs(12);
  } catch (error) {
    isError = true;
    console.error('Failed to load blogs on server side:', error);
  }

  return (
    <>
      <ItemListSchema 
        items={blogs.map((b, idx) => ({
          name: b.title,
          url: `https://sapirox.com/blog/${b.slug}`,
          position: idx + 1
        }))}
      />
      <CustomSchema path="/blog" />
      <BlogClient initialBlogs={blogs} isError={isError} />
    </>
  );
}
