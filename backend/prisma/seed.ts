import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding database...');

  // 1. Seed Services
  const servicesData = [
    {
      title: 'Web Application Development',
      slug: 'web-application-development',
      shortDescription: 'Custom enterprise-grade web apps built using Next.js and secure APIs.',
      fullDescription: 'We build high-performance, secure, and scale-ready web applications customized to your specific business logic. Leveraging Next.js, React, and robust API endpoints, we ensure a seamless user experience.',
      icon: 'cpu',
      features: ['Real-time synchronization', 'SEO optimized architecture', 'High security protocols', 'Scale-ready performance'],
      order: 1,
      isFeatured: true,
      showOnHomepage: true,
      status: 'PUBLISHED' as const,
      seoTitle: 'Custom Web Application Development Services',
      seoDescription: 'Scale your operations with premium enterprise-grade web applications customized for your business.'
    },
    {
      title: 'CMS & Content Management',
      slug: 'cms-content-management',
      shortDescription: 'Secure, modern content distribution setups with simple admin inputs.',
      fullDescription: 'Custom headless and traditional CMS architectures designed to give your editors complete control while ensuring blistering load speeds on the frontend.',
      icon: 'layers',
      features: ['Bespoke administration dashboards', 'Granular role access rules', 'API-first content delivery', 'Automated image optimization'],
      order: 2,
      isFeatured: false,
      showOnHomepage: true,
      status: 'PUBLISHED' as const,
      seoTitle: 'Enterprise CMS & Content Management Systems',
      seoDescription: 'Blazing fast content publishing and distribution setups built on headless architecture.'
    },
    {
      title: 'E-commerce & SaaS Products',
      slug: 'ecommerce-saas-products',
      shortDescription: 'Custom digital sales pipelines, billing platforms, and business tools.',
      fullDescription: 'We build next-generation e-commerce platforms and software-as-a-service architectures equipped with subscription handling, multi-tenant billing, and deep analytics dashboards.',
      icon: 'globe',
      features: ['Secure stripe/paypal payment gateways', 'High-speed checkout routing', 'Automated tax and invoice generation', 'Interactive analytics graphs'],
      order: 3,
      isFeatured: false,
      showOnHomepage: true,
      status: 'PUBLISHED' as const,
      seoTitle: 'Tailored SaaS & E-commerce Software Development',
      seoDescription: 'Transform your sales pipeline with secure payment gateways, subscription setups, and analytics dashboards.'
    }
  ];

  console.log('⏳ Seeding Services...');
  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  // 2. Seed Products
  const productsData = [
    {
      name: 'Sapirox Enterprise CMS',
      slug: 'sapirox-enterprise-cms',
      shortDescription: 'An API-first modern content delivery framework built to provide super-fast static output generation.',
      description: 'A premium headless CMS featuring markdown support, real-time previewing, media library with automatic WebP compression, and nested block layout editing. Developed specifically to power high-traffic business websites.',
      productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      features: ['API-First Architecture', 'Real-time Rich Text Editing', 'WebP Auto-Compression', 'Custom Roles & Workflow Policies'],
      benefits: ['Blazing Fast LCP Metrics', 'No Server Maintenance Needed', 'Reduced Infrastructure Costs'],
      technology: ['Next.js', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
      status: 'BETA' as const,
      demoUrl: 'https://demo.sapirox.com/cms',
      ctaText: 'Request Access',
      seoTitle: 'Sapirox Enterprise CMS - Headless Content Management',
      seoDescription: 'Discover Sapirox Headless CMS: an API-first content distribution engine with real-time editing.'
    },
    {
      name: 'Pulse CRM & ERP',
      slug: 'pulse-crm-erp',
      shortDescription: 'Integrated administrative dashboard to help startups monitor sales channels, manage invoices and support requests.',
      description: 'An all-in-one ERP system tailored for startup SaaS providers. Pulse combines lead monitoring, customer relations, invoice auditing, automated billing triggers, and direct ticketing into a single screen.',
      productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      features: ['Lead Funnel Automation', 'Flexible Invoicing Schedules', 'Direct Client Portal', 'Instant Webhook Dispatches'],
      benefits: ['Consolidate Multiple Tools', 'Automate Billing Operations', 'Accelerate Support SLA Responses'],
      technology: ['Express.js', 'PostgreSQL', 'WebSockets', 'Chart.js'],
      status: 'COMING_SOON' as const,
      demoUrl: 'https://demo.sapirox.com/pulse',
      ctaText: 'Join Waitlist',
      seoTitle: 'Pulse CRM & ERP System for Modern Startups',
      seoDescription: 'Consolidate leads, invoices, subscriptions, and ticketing into a clean, automated dashboard.'
    }
  ];

  console.log('⏳ Seeding Products...');
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // 3. Seed Projects
  const projectsData = [
    {
      title: 'Corporate Portal V2',
      slug: 'corporate-portal-v2',
      description: 'Secure company management tool with active user directory mapping, document distribution rules, and instant noticeboards.',
      gallery: [],
      technology: ['React', 'Next.js', 'Auth0', 'TailwindCSS'],
      category: 'WEB PORTAL',
      status: 'PUBLISHED' as const,
      seoTitle: 'Corporate Portal V2 case study',
      seoDescription: 'Learn how Sapirox built a highly secure enterprise corporate portal with user directory mapping.'
    },
    {
      title: 'Global Retail Pipeline',
      slug: 'global-retail-pipeline',
      description: 'Distributed database synchronization layer designed to aggregate sales receipts from over 120 global retail stores with offline resilience.',
      gallery: [],
      technology: ['Node.js', 'Postgres', 'Redis', 'Docker'],
      category: 'E-COMMERCE',
      status: 'PUBLISHED' as const,
      seoTitle: 'Global Retail Database Sync Pipeline',
      seoDescription: 'High-reliability replication logic for global retail networks built on Redis and Node.js.'
    },
    {
      title: 'Finance Data Engine',
      slug: 'finance-data-engine',
      description: 'High-speed reporting dashboard with automated PDF, CSV, and Excel document generation, supporting deep search query logs.',
      gallery: [],
      technology: ['Python', 'FastAPI', 'Pandas', 'AWS Lambda'],
      category: 'FINTECH',
      status: 'PUBLISHED' as const,
      seoTitle: 'Finance Reporting & Data Engine Case Study',
      seoDescription: 'Custom financial reporting engines compiling complex database models into formatted audits.'
    }
  ];

  console.log('⏳ Seeding Projects...');
  for (const project of projectsData) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  // 4. Seed Testimonials
  const testimonialsData = [
    {
      name: 'Kanishka Silva',
      role: 'Founder, TradeFlow',
      feedback: 'Sapirox delivered our retail synchronization dashboard 2 weeks ahead of schedule. The code architecture is extremely clean, and database scaling operates smoothly.',
      order: 1
    },
    {
      name: 'Malith Perera',
      role: 'Tech Lead, PayPulse',
      feedback: 'Implementing custom JWT middleware and role restrictions was simplified with their backend engineering consultancy. They know security inside out.',
      order: 2
    },
    {
      name: 'Sanduni Fernando',
      role: 'Product Owner, EduStart',
      feedback: 'The static rendering setup next.js website has enhanced our SEO rankings by 40% within just three months. Highly recommended for modern web projects.',
      order: 3
    }
  ];

  console.log('⏳ Seeding Testimonials...');
  // Clear and seed testimonials to keep it simple (they do not have unique slugs)
  await prisma.testimonial.deleteMany({});
  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: testimonial
    });
  }

  console.log('🎉 Seeding completed successfully!');
  console.log('💡 Note: Admin accounts are managed separately. Run `ts-node src/create_admin.ts` to create the Super Admin user via Supabase.');
}

main()
  .catch((e) => {
    console.error('❌ Error running seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

