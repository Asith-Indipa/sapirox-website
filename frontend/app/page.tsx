import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { OrganizationSchema } from '@/components/seo';
import CustomSchema from '@/components/CustomSchema';
import { 
  getServices, 
  getProducts, 
  getProjects, 
  getBlogs, 
  getTestimonials,
  Service,
  Product,
  Project,
  Blog,
  Testimonial
} from '../services/api';

// Disable client caching for dynamic metadata updates
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Sapirox | Premium Enterprise Software Solutions";
  const fallbackDesc = "We engineer scalable web solutions, custom CMS platforms, internal administration software, and business-focused applications.";
  const fallbackKeywords = "Sapirox,Software Startup,Enterprise Solutions,Next.js,Web Development,Bespoke Software,SaaS,CMS";

  try {
    const encodedPath = encodeURIComponent('/');
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
          keywords: data.keywords || fallbackKeywords,
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load SEO metadata on server side:", err);
  }

  // Fallback metadata if API fails or record doesn't exist
  return {
    title: fallbackTitle,
    description: fallbackDesc,
    keywords: fallbackKeywords,
  };
}

export default async function Home() {
  // Fetch services, products, projects, blogs, testimonials on the server
  let services: Service[] = [];
  let products: Product[] = [];
  let projects: Project[] = [];
  let blogs: Blog[] = [];
  let testimonials: Testimonial[] = [];

  try {
    const [servicesData, productsData, projectsData, blogsData, testimonialsData] = await Promise.all([
      getServices().catch(() => []),
      getProducts().catch(() => []),
      getProjects().catch(() => []),
      getBlogs(3).catch(() => []),
      getTestimonials().catch(() => [])
    ]);
    services = servicesData;
    products = productsData;
    projects = projectsData;
    blogs = blogsData;
    testimonials = testimonialsData;
  } catch (err) {
    console.error("Failed to fetch initial database collections on server side:", err);
  }

  return (
    <>
      <OrganizationSchema />
      <CustomSchema path="/" />
      <HomeClient 
        initialServices={services}
        initialProducts={products}
        initialProjects={projects}
        initialBlogs={blogs}
        initialTestimonials={testimonials}
      />
    </>
  );
}
