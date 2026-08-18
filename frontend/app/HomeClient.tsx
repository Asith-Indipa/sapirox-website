'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  submitContact,
  Service,
  Product,
  Project,
  Blog,
  Testimonial,
  getFullImageUrl
} from '../services/api';
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  Globe, 
  MessageSquare, 
  CheckCircle, 
  Send, 
  Code,
  Shield,
  Zap,
  Activity,
  Star
} from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

const PROJECT_TYPE_OPTIONS = [
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Mobile Application', label: 'Mobile Application' },
  { value: 'POS / Business System', label: 'POS / Business System' },
  { value: 'SaaS Product', label: 'SaaS Product' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Custom Software', label: 'Custom Software' },
  { value: 'Other', label: 'Other' },
];

interface HomeClientProps {
  initialServices: Service[];
  initialProducts: Product[];
  initialProjects: Project[];
  initialBlogs: Blog[];
  initialTestimonials: Testimonial[];
  servicesError?: boolean;
  productsError?: boolean;
  projectsError?: boolean;
  blogsError?: boolean;
  testimonialsError?: boolean;
}

export default function HomeClient({
  initialServices,
  initialProducts,
  initialProjects,
  initialBlogs,
  initialTestimonials,
  servicesError = false,
  productsError = false,
  projectsError = false,
  blogsError = false,
  testimonialsError = false
}: HomeClientProps) {
  // Navigation Menu state (not used inside layout but kept for compatibility/future use)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Data States initialized from server props
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  const visibleProducts = products.filter(p => p.showOnHomepage !== false);
  const visibleProjects = projects.filter(p => p.showOnHomepage !== false);
  const visibleBlogs = blogs.filter(b => b.showOnHomepage !== false);

  // Contact Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    company: '', 
    projectType: 'Web Application', 
    subject: '', 
    message: '' 
  });
  const [agreed, setAgreed] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (!agreed) {
      setFormStatus({ type: 'error', message: 'You must agree to the privacy policy to submit this form.' });
      return;
    }
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        projectType: formData.projectType,
        subject: formData.subject || `Inquiry: ${formData.projectType}`,
        message: formData.message,
      });
      setFormStatus({ type: 'success', message: 'Thank you! Your inquiry has been sent successfully. Our team will review it and get back to you shortly.' });
      setFormData({ 
        name: '', 
        email: '', 
        company: '', 
        projectType: 'Web Application', 
        subject: '', 
        message: '' 
      });
      setAgreed(false);
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to dynamically render Lucide icons based on service configuration
  const renderIcon = (iconName: string, sizeClass = "h-6 w-6") => {
    switch (iconName.toLowerCase()) {
      case 'cpu': return <Cpu className={`${sizeClass} text-primary animate-pulse`} />;
      case 'layers': return <Layers className={`${sizeClass} text-cyan-500 dark:text-cyan-400`} />;
      case 'globe': return <Globe className={`${sizeClass} text-blue-500 dark:text-blue-400`} />;
      case 'shield': return <Shield className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'code': return <Code className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'zap': return <Zap className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      default: return <Activity className={`${sizeClass} text-primary`} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* ── Background decoration / Glow grids ─────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/20 dark:bg-blue-600/30 blur-[130px]" />
        <div className="absolute -top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap className="h-3 w-3" /> Enterprise Grade IT Solutions
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl leading-tight mb-8 font-heading">
          Next-Gen Software for <br />
          <span className="premium-gradient-text">Modern Enterprise Growth</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
          At Sapirox, we engineer scalable web solutions, custom CMS platforms, internal administration software, and business-focused applications designed to accelerate productivity and technology adoption.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a 
            href="#contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-cyan-500/15 hover:scale-[1.02] transition-all duration-300"
          >
            Launch Project <ArrowRight className="h-5 w-5" />
          </a>
          <a 
            href="#products" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Explore Products
          </a>
        </div>
      </section>

      {/* ── SERVICES SECTION ────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto border-t border-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading">Bespoke Tech Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tailored engineering outputs designed to match complex enterprise rules and operations.
            </p>
          </div>
          <Link href="/services" className="text-primary font-semibold hover:opacity-90 transition-opacity mt-4 md:mt-0 flex items-center gap-2">
            Browse All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesError ? (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
              <p className="text-rose-500 dark:text-rose-400 font-medium">
                Something went wrong while loading our services. Please try again later.
              </p>
            </div>
          ) : services.filter(s => s.showOnHomepage !== false).length > 0 ? (
            services.filter(s => s.showOnHomepage !== false).map((service) => (
              <Link 
                key={service.id} 
                href={`/services/${service.slug}`}
                className={`premium-glass rounded-2xl border hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.01] group transition-all duration-300 flex flex-col justify-between min-w-0 w-full overflow-hidden ${
                  service.isFeatured 
                    ? 'border-primary/45 ring-1 ring-primary/20' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div>
                  {/* Thumbnail area with smaller floating icon overlay */}
                  <div className="aspect-video w-full bg-muted/20 flex items-center justify-center relative overflow-hidden border-b border-border/40">
                    {service.image ? (
                      <img 
                        src={getFullImageUrl(service.image)} 
                        alt={service.title}
                        className="h-full w-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/15" />
                    )}

                    {/* Small Icon container floating in bottom-left */}
                    <div className="absolute bottom-3 left-3 h-10 w-10 rounded-lg bg-background/90 backdrop-blur-sm border border-border/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {renderIcon(service.icon, "h-5 w-5")}
                    </div>

                    {/* Featured label overlay */}
                    {service.isFeatured && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        <Star className="h-3 w-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 break-words">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-xs break-words">{service.shortDescription}</p>

                    <ul className="space-y-2 mb-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div 
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-85 transition-opacity group-hover:translate-x-1 duration-200"
                  >
                    View Service Details <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
              <p className="text-muted-foreground font-medium">
                No services available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCTS SECTION ────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 px-6 bg-gradient-to-b from-transparent to-card/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading">Our Proprietary Solutions</h2>
              <p className="text-muted-foreground leading-relaxed">
                In-house digital solutions created to streamline and automate essential operations.
              </p>
            </div>
            <Link href="/products" className="text-primary font-semibold hover:opacity-90 transition-opacity mt-4 md:mt-0 flex items-center gap-2">
              Browse All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsError ? (
              <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
                <p className="text-rose-500 dark:text-rose-400 font-medium">
                  Something went wrong while loading our products. Please try again later.
                </p>
              </div>
            ) : visibleProducts.length > 0 ? (
              visibleProducts.map((prod) => (
                <Link 
                  key={prod.id} 
                  href={`/products/${prod.slug}`}
                  className="premium-glass rounded-2xl overflow-hidden border border-border flex flex-col justify-between hover:border-primary/30 hover:scale-[1.01] transition-all duration-300 group"
                >
                  <div>
                    {/* Thumbnail area */}
                    <div className="aspect-video w-full bg-muted flex items-center justify-center relative overflow-hidden">
                      {prod.productImage ? (
                        <img 
                          src={getFullImageUrl(prod.productImage)} 
                          alt={prod.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-550"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/15" />
                          <Code className="h-10 w-10 text-primary/45 group-hover:scale-105 transition-transform duration-300" />
                        </>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase border ${
                          prod.status === 'AVAILABLE' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : prod.status === 'BETA'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {prod.status.replace('_', ' ')}
                        </span>
                        {prod.category && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                            {prod.category}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{prod.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">{prod.shortDescription}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {prod.technology.map((tech, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/40 dark:border-muted-foreground/25 dark:bg-muted/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/40 border-t border-border/40 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      Ready to learn more?
                    </span>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-cyan-500/10">
                      {prod.ctaText || 'Learn More'} <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
                <p className="text-muted-foreground font-medium">
                  No proprietary products available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION ───────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto border-t border-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading">Successfully Deployed Projects</h2>
            <p className="text-muted-foreground leading-relaxed">
              Take a look at actual case studies of systems we engineered for our partners and clients.
            </p>
          </div>
          <Link href="/portfolio" className="text-primary font-semibold hover:opacity-90 transition-opacity mt-4 md:mt-0 flex items-center gap-2">
            Browse All Case Studies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsError ? (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
              <p className="text-rose-500 dark:text-rose-400 font-medium">
                Something went wrong while loading our case studies. Please try again later.
              </p>
            </div>
          ) : visibleProjects.length > 0 ? (
            visibleProjects.map((proj) => (
              <Link 
                key={proj.id} 
                href={`/portfolio/${proj.slug}`}
                className="premium-glass rounded-2xl overflow-hidden border border-border flex flex-col justify-between group hover:border-primary/30 hover:scale-[1.01] transition-all duration-300"
              >
                <div>
                  <div className="w-full aspect-video bg-muted/20 flex items-center justify-center relative overflow-hidden border-b border-border/40">
                    {proj.coverImage ? (
                      <img 
                        src={getFullImageUrl(proj.coverImage)} 
                        alt={proj.title}
                        className="h-full w-full object-contain group-hover:scale-[1.02] transition-transform duration-550"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/15" />
                        <Code className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">{proj.category}</span>
                    <h3 className="text-xl font-bold text-foreground mt-2 mb-3 group-hover:text-primary transition-colors">{proj.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technology.map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40 dark:border-muted-foreground/25 dark:bg-muted/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-muted/40 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
              <p className="text-muted-foreground font-medium">
                No case studies available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── INSIGHTS & BLOG SECTION ────────────────────────────────────────────── */}
      <section id="blog" className="py-24 px-6 bg-gradient-to-t from-transparent to-card/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading">Engineering & Design Blog</h2>
              <p className="text-muted-foreground leading-relaxed">
                Technical resources, solutions to architecture bottlenecks, and software engineering articles written by our core team.
              </p>
            </div>
            <Link href="/blog" className="text-primary font-semibold hover:opacity-90 transition-opacity mt-4 md:mt-0 flex items-center gap-2">
              Browse All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogsError ? (
              <div className="col-span-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
                <p className="text-rose-500 dark:text-rose-400 font-medium">
                  Something went wrong while loading our articles. Please try again later.
                </p>
              </div>
            ) : visibleBlogs.length > 0 ? (
              visibleBlogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className="premium-glass rounded-2xl overflow-hidden border border-border flex flex-col justify-between group hover:border-primary/30 hover:scale-[1.01] transition-all duration-300"
                >
                  <div>
                    <div className="relative w-full aspect-video overflow-hidden border-b border-border/40 bg-muted/20 flex items-center justify-center">
                      <img 
                        src={getFullImageUrl(blog.coverImage) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} 
                        alt={blog.coverImageAlt || blog.title} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-505 block"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">{blog.category?.name || 'Technology'}</span>
                      <h3 className="text-lg font-bold text-foreground mt-3 mb-3 group-hover:text-primary transition-colors leading-snug break-words">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-4 break-words">
                        {blog.excerpt || (blog.content ? blog.content.substring(0, 160) + '...' : '')}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/40 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'Draft'}</span>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      Read Full <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 px-6 rounded-2xl border border-border/40 bg-muted/10 text-center premium-glass">
                <p className="text-muted-foreground font-medium">
                  No articles available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-border/40 animate-in fade-in duration-700">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading">Partner Integrations & Reviews</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hear from startup founders and development leads who transformed their businesses using Sapirox architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="premium-glass p-8 rounded-2xl border border-border flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                <p className="text-muted-foreground italic leading-relaxed text-sm mb-6">"{t.feedback}"</p>
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img 
                      src={getFullImageUrl(t.avatar)} 
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover border border-border/60 bg-muted/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className = 'hidden';
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-sm border border-border/50">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CONTACT FORM SECTION ────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 bg-card/40 border-t border-border/40 relative">
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
              Ready to engineer your <br />
              <span className="premium-gradient-text">next business application?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Send us a direct message outlining your target deliverables, key system modules, and schedule. One of our lead software engineers will reply with a detailed system architecture proposal within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>support@sapirox.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-5 w-5 text-primary" />
                <span>Colombo, Sri Lanka (Remote Worldwide Support)</span>
              </div>
            </div>
          </div>

          <div className="premium-glass p-8 md:p-10 rounded-3xl border border-border shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" /> Project Inquiry Form
            </h3>
            
            {formStatus.type && (
              <div className={`p-4 rounded-xl mb-6 text-sm border ${
                formStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-650 dark:text-rose-400'
              }`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                    placeholder="e.g. john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                    placeholder="e.g. Sapirox Technologies"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Type *</label>
                  <CustomSelect
                    options={PROJECT_TYPE_OPTIONS}
                    value={formData.projectType}
                    onChange={(val) => setFormData({ ...formData, projectType: val })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                  placeholder="e.g. Enterprise web portal deployment"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message *</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300 resize-none"
                  placeholder="Briefly describe key user workflows, layouts, or data requirements..."
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="flex items-start gap-3 select-none bg-muted/40 p-4 rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-300">
                <input 
                  type="checkbox" 
                  id="privacy-consent-home"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary bg-background focus:ring-primary/30 cursor-pointer accent-primary"
                />
                <label htmlFor="privacy-consent-home" className="text-xs text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors">
                  I agree to the Privacy Policy and consent to Sapirox processing my information to respond to this inquiry.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !agreed}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-30 transition-all duration-300 shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                {isSubmitting ? 'Submitting Message...' : 'Send Message'} <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
