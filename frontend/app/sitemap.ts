import { MetadataRoute } from 'next';
import { getServices, getProducts, getProjects, getBlogs } from '../services/api';

export const revalidate = 3600; // Cache the sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Production site URL (Default is sapirox.com)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sapirox.com';

  // 1. Static Pages list
  const staticRoutes = [
    '',
    '/services',
    '/products',
    '/portfolio',
    '/blog',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Containers for dynamic routes
  let serviceRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Fetch all dynamic entries from database in parallel
    const [services, products, projects, blogs] = await Promise.all([
      getServices().catch(() => []),
      getProducts().catch(() => []),
      getProjects().catch(() => []),
      getBlogs(100).catch(() => []),
    ]);

    // Format services links: /services/[slug]
    serviceRoutes = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Format products links: /products/[slug]
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Format project links: /portfolio/[slug]
    projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Format blog links: /blog/[slug]
    blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.publishedDate),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Failed to compile dynamic sitemap on server:", err);
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...productRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}
