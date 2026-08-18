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

  let servicesError = false;
  let productsError = false;
  let projectsError = false;
  let blogsError = false;
  let testimonialsError = false;

  try {
    const results = await Promise.allSettled([
      getServices(),
      getProducts(),
      getProjects(),
      getBlogs(3),
      getTestimonials()
    ]);

    if (results[0].status === 'fulfilled') {
      services = results[0].value;
    } else {
      servicesError = true;
      console.error("Failed to fetch services on server side:", results[0].reason);
    }

    if (results[1].status === 'fulfilled') {
      products = results[1].value;
    } else {
      productsError = true;
      console.error("Failed to fetch products on server side:", results[1].reason);
    }

    if (results[2].status === 'fulfilled') {
      projects = results[2].value;
    } else {
      projectsError = true;
      console.error("Failed to fetch projects on server side:", results[2].reason);
    }

    if (results[3].status === 'fulfilled') {
      blogs = results[3].value;
    } else {
      blogsError = true;
      console.error("Failed to fetch blogs on server side:", results[3].reason);
    }

    if (results[4].status === 'fulfilled') {
      testimonials = results[4].value;
    } else {
      testimonialsError = true;
      console.error("Failed to fetch testimonials on server side:", results[4].reason);
    }
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
        servicesError={servicesError}
        productsError={productsError}
        projectsError={projectsError}
        blogsError={blogsError}
        testimonialsError={testimonialsError}
      />
    </>
  );
}
