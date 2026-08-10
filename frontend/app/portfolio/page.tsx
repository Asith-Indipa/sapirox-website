import { Metadata } from 'next';
import { ItemListSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { getProjects, Project } from '@/services/api';
import PortfolioClient from './PortfolioClient';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Deployed Case Studies & Portfolios";
  const fallbackDesc = "Browse software platforms, high-speed architectures, and digital layouts built and deployed by Sapirox.";
  
  try {
    const encodedPath = encodeURIComponent('/portfolio');
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
          keywords: data.keywords || "Sapirox,Portfolio,Projects,Case Studies",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load Portfolio page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

export default async function PortfolioPage() {
  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Failed to load portfolio on server side:', error);
  }

  return (
    <>
      <ItemListSchema 
        items={projects.map((p, idx) => ({
          name: p.title,
          url: `https://sapirox.com/portfolio/${p.slug}`,
          position: idx + 1
        }))}
      />
      <CustomSchema path="/portfolio" />
      <PortfolioClient initialProjects={projects} />
    </>
  );
}
