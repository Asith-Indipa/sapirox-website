const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiFetch<T>(endpoint: string, options: ApiRequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  
  // If we are in client browser, try to load auth token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sapirox_auth_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let bodyInit: BodyInit | undefined;
  if (options.body !== undefined) {
    if (typeof options.body === 'object' && options.body !== null && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      bodyInit = JSON.stringify(options.body);
    } else {
      bodyInit = options.body as BodyInit;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    body: bodyInit,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong with the request');
  }

  return result;
}

// ── Service Endpoints ────────────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image?: string;
  features: string[];
  order: number;
  isFeatured?: boolean;
  showOnHomepage?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
}

export const getServices = async (): Promise<Service[]> => {
  const res = await apiFetch<{ success: boolean; data: Service[] }>('/services');
  return res.data;
};

// ── Product Endpoints ────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  productImage: string;
  gallery: string[];
  features: string[];
  benefits: string[];
  technology: string[];
  status: 'ACTIVE' | 'BETA' | 'COMING_SOON';
  demoUrl?: string;
  ctaText?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await apiFetch<{ success: boolean; data: Product[] }>('/products');
  return res.data;
};

// ── Project Endpoints ────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  gallery: string[];
  technology: string[];
  category: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const res = await apiFetch<{ success: boolean; data: Project[] }>('/portfolio');
  return res.data;
};

// ── Blog Endpoints ───────────────────────────────────────────────────────────
export interface Blog {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  publishedDate: string;
  category: { name: string; slug: string };
  tags: { name: string; slug: string }[];
  author: { email: string };
}

export const getBlogs = async (limit = 3): Promise<Blog[]> => {
  const res = await apiFetch<{ success: boolean; data: Blog[] }>(`/blogs?limit=${limit}`);
  return res.data;
};

// ── Testimonials ──────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  feedback: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const res = await apiFetch<{ success: boolean; data: Testimonial[] }>('/testimonials');
  return res.data;
};

// ── Contact Submission ─────────────────────────────────────────────────────────
export const submitContact = async (data: { name: string; email: string; subject?: string; message: string }) => {
  return apiFetch<{ success: boolean; message: string }>('/contact', {
    method: 'POST',
    body: data,
  });
};

// ── Admin Fetch Endpoints ───────────────────────────────────────────────────
export const getAdminServices = async (): Promise<Service[]> => {
  const res = await apiFetch<{ success: boolean; data: Service[] }>('/admin/services');
  return res.data;
};

export const getAdminProducts = async (): Promise<Product[]> => {
  const res = await apiFetch<{ success: boolean; data: Product[] }>('/admin/products');
  return res.data;
};

export const getAdminProjects = async (): Promise<Project[]> => {
  const res = await apiFetch<{ success: boolean; data: Project[] }>('/admin/portfolio');
  return res.data;
};

export const getAdminBlogs = async (): Promise<Blog[]> => {
  const res = await apiFetch<{ success: boolean; data: Blog[] }>('/admin/blogs');
  return res.data;
};

// ── Admin Services CRUD ────────────────────────────────────────────────────────
export const createService = async (data: Partial<Service>): Promise<Service> => {
  const res = await apiFetch<{ success: boolean; data: Service }>('/admin/services', {
    method: 'POST',
    body: data,
  });
  return res.data;
};

export const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  const res = await apiFetch<{ success: boolean; data: Service }>(`/admin/services/${id}`, {
    method: 'PUT',
    body: data,
  });
  return res.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await apiFetch<{ success: boolean }>(`/admin/services/${id}`, {
    method: 'DELETE',
  });
};

// ── Admin Products CRUD ───────────────────────────────────────────────────────
export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const res = await apiFetch<{ success: boolean; data: Product }>('/admin/products', {
    method: 'POST',
    body: data,
  });
  return res.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const res = await apiFetch<{ success: boolean; data: Product }>(`/admin/products/${id}`, {
    method: 'PUT',
    body: data,
  });
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiFetch<{ success: boolean }>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
};

// ── Admin Projects CRUD ───────────────────────────────────────────────────────
export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await apiFetch<{ success: boolean; data: Project }>('/admin/portfolio', {
    method: 'POST',
    body: data,
  });
  return res.data;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const res = await apiFetch<{ success: boolean; data: Project }>(`/admin/portfolio/${id}`, {
    method: 'PUT',
    body: data,
  });
  return res.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiFetch<{ success: boolean }>(`/admin/portfolio/${id}`, {
    method: 'DELETE',
  });
};

// ── Admin Blogs CRUD ──────────────────────────────────────────────────────────
export const createBlog = async (data: unknown): Promise<Blog> => {
  const res = await apiFetch<{ success: boolean; data: Blog }>('/admin/blogs', {
    method: 'POST',
    body: data,
  });
  return res.data;
};

export const updateBlog = async (id: string, data: unknown): Promise<Blog> => {
  const res = await apiFetch<{ success: boolean; data: Blog }>(`/admin/blogs/${id}`, {
    method: 'PUT',
    body: data,
  });
  return res.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await apiFetch<{ success: boolean }>(`/admin/blogs/${id}`, {
    method: 'DELETE',
  });
};

// ── Admin SEO Settings ────────────────────────────────────────────────────────
export interface SEOSetting {
  id?: string;
  pagePath: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemaMarkup?: unknown;
}

export const getSeoSettingsByPath = async (path: string): Promise<SEOSetting> => {
  const encodedPath = encodeURIComponent(path);
  const res = await apiFetch<{ success: boolean; data: SEOSetting }>(`/seo/${encodedPath}`);
  return res.data;
};

export const upsertSeoSetting = async (data: SEOSetting): Promise<SEOSetting> => {
  const res = await apiFetch<{ success: boolean; data: SEOSetting }>('/admin/seo', {
    method: 'POST',
    body: data,
  });
  return res.data;
};
