import { Metadata } from 'next';
import ContactClient from './ContactClient';
import CustomSchema from '@/components/CustomSchema';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Contact Our Engineering Team";
  const fallbackDesc = "Connect with lead Sapirox software developers to plan system architectures, APIs, and business applications.";
  
  try {
    const encodedPath = encodeURIComponent('/contact');
    const res = await fetch(`http://localhost:5000/api/seo/${encodedPath}`, { 
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
          keywords: data.keywords || "Sapirox,Contact,Support,Quote",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load Contact page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

export default function ContactPage() {
  return (
    <>
      <CustomSchema path="/contact" />
      <ContactClient />
    </>
  );
}
