'use client';

import React, { useState, useEffect } from 'react';
import { 
  submitContact,
  Service,
  Product,
  Project,
  Blog,
  Testimonial 
} from '../services/api';
import { 
  ArrowRight, 
  Cpu, 
  Layers, 
  Globe, 
  MessageSquare, 
  CheckCircle, 
  Send, 
  ExternalLink,
  Code,
  Shield,
  Zap,
  Activity,
  Star
} from 'lucide-react';

interface HomeClientProps {
  initialServices: Service[];
  initialProducts: Product[];
  initialProjects: Project[];
  initialBlogs: Blog[];
  initialTestimonials: Testimonial[];
}

export default function HomeClient({
  initialServices,
  initialProducts,
  initialProjects,
  initialBlogs,
  initialTestimonials
}: HomeClientProps) {
  // Navigation Menu state (not used inside layout but kept for compatibility/future use)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Data States initialized from server props
  const [services, setServices] = useState<Service[]>(initialServices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      await submitContact(formData);
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setFormStatus({ type: 'error', message: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to dynamically render Lucide icons based on service configuration
  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu': return <Cpu className="h-6 w-6 text-indigo-400" />;
      case 'layers': return <Layers className="h-6 w-6 text-purple-400" />;
      case 'globe': return <Globe className="h-6 w-6 text-pink-400" />;
      case 'shield': return <Shield className="h-6 w-6 text-emerald-400" />;
      case 'code': return <Code className="h-6 w-6 text-blue-400" />;
      case 'zap': return <Zap className="h-6 w-6 text-amber-400" />;
      default: return <Activity className="h-6 w-6 text-indigo-400" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-gray-100 overflow-x-hidden font-sans">
      
      {/* ── Background decoration / Glow grids ─────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[130px]" />
        <div className="absolute -top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Zap className="h-3 w-3" /> Enterprise Grade IT Solutions
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight mb-8 font-heading">
          Next-Gen Software for <br />
          <span className="premium-gradient-text">Modern Enterprise Growth</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed mb-12">
          At Sapirox, we engineer scalable web solutions, custom CMS platforms, internal administration software, and business-focused applications designed to accelerate productivity and technology adoption.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a 
            href="#contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all duration-300"
          >
            Launch Project <ArrowRight className="h-5 w-5" />
          </a>
          <a 
            href="#products" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700/80 border border-gray-700/60 text-white font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Explore Products
          </a>
        </div>
      </section>

      {/* ── SERVICES SECTION ────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-800/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Bespoke Tech Services</h2>
          <p className="text-gray-400 leading-relaxed">
            Tailored engineering outputs designed to match complex enterprise rules and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.filter(s => s.showOnHomepage !== false).length > 0 ? (
            services.filter(s => s.showOnHomepage !== false).map((service) => (
              <div 
                key={service.id} 
                className={`premium-glass p-8 rounded-2xl border hover:shadow-2xl hover:shadow-indigo-500/5 group transition-all duration-300 flex flex-col justify-between ${
                  service.isFeatured 
                    ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' 
                    : 'border-gray-800 hover:border-indigo-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {renderIcon(service.icon)}
                    </div>
                    {service.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        <Star className="h-3 w-3 fill-amber-400" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6 text-sm">{service.shortDescription}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Static Placeholders if no data yet in database
            [
              { title: 'Web Application Development', desc: 'Custom enterprise-grade web apps built using Next.js and secure APIs.', icon: 'cpu', feats: ['Real-time sync', 'SEO optimized', 'Scale ready'] },
              { title: 'CMS & Content Management', desc: 'Secure, modern content distribution setups with simple admin inputs.', icon: 'layers', feats: ['Bespoke dashboards', 'Role access rules', 'API ready'] },
              { title: 'E-commerce & SaaS Products', desc: 'Custom digital sales pipelines, billing platforms and business tools.', icon: 'globe', feats: ['Secure payments', 'High speed routing', 'Analytics graphs'] }
            ].map((item, idx) => (
              <div key={idx} className="premium-glass p-8 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                    {renderIcon(item.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6 text-sm">{item.desc}</p>
                </div>
                <ul className="space-y-3">
                  {item.feats.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="h-4 w-4 text-indigo-400" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── PRODUCTS SECTION ────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0e1322] border-t border-gray-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Our Proprietary Solutions</h2>
              <p className="text-gray-400 leading-relaxed">
                In-house digital solutions created to streamline and automate essential operations.
              </p>
            </div>
            <a href="#contact" className="hidden md:inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors mt-4 md:mt-0">
              Request Demo Product <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.length > 0 ? (
              products.map((prod) => (
                <div key={prod.id} className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between">
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
                      {prod.status}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{prod.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{prod.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {prod.technology.map((tech, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gray-800/80 text-gray-300 border border-gray-700/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Ready to test?</span>
                    <a 
                      href={prod.demoUrl || '#contact'} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-300"
                    >
                      {prod.ctaText || 'Learn More'} <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              // Fallback cards if database is clean
              <>
                <div className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between">
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
                      BETA TESTING
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Sapirox Enterprise CMS</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      An API-first modern content delivery framework built to provide super-fast static output generation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js', 'Prisma', 'PostgreSQL', 'TailwindCSS'].map((tech, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gray-800/80 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Access beta panel</span>
                    <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                      Request Access <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="premium-glass rounded-3xl overflow-hidden border border-gray-800 flex flex-col justify-between">
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-6">
                      COMING SOON
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Pulse CRM & ERP</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      Integrated administrative dashboard to help startups monitor sales channels, manage invoices and support requests.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Express.js', 'Postgres', 'WebSockets', 'Chart.js'].map((tech, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-gray-800/80 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-[#080d19]/80 border-t border-gray-800/40 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Join waiting list</span>
                    <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-850 hover:bg-gray-800 text-white text-sm font-semibold border border-gray-700/40">
                      Join waitlist <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO SECTION ───────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-800/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Successfully Deployed Projects</h2>
          <p className="text-gray-400 leading-relaxed">
            Take a look at actual case studies of systems we engineered for our partners and clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div key={proj.id} className="premium-glass rounded-2xl overflow-hidden border border-gray-800 group hover:border-indigo-500/30 transition-all duration-300">
                <div className="h-48 w-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40" />
                  <Code className="h-10 w-10 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">{proj.category}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">{proj.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technology.map((tech, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback grid
            [
              { title: 'Corporate Portal V2', cat: 'WEB PORTAL', desc: 'Secure company management tool with active user directory mapping.', tech: ['React', 'Next.js', 'Auth0'] },
              { title: 'Global Retail Pipeline', cat: 'E-COMMERCE', desc: 'Distributed database synchronization layer for global retail outlets.', tech: ['Node.js', 'Postgres', 'Redis'] },
              { title: 'Finance Data Engine', cat: 'FINTECH', desc: 'High-speed reporting dashboard with automated PDF and excel generation.', tech: ['FastAPI', 'Pandas', 'AWS'] }
            ].map((proj, idx) => (
              <div key={idx} className="premium-glass rounded-2xl overflow-hidden border border-gray-800 group">
                <div className="h-48 w-full bg-gray-900/60 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-955/20 to-purple-955/20" />
                  <Code className="h-10 w-10 text-indigo-500/40" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{proj.cat}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{proj.title}</h3>
                  <p className="text-gray-450 text-xs leading-relaxed mb-4">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.tech.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-gray-800/80 text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── INSIGHTS & BLOG SECTION ────────────────────────────────────────────── */}
      <section id="blog" className="py-24 px-6 bg-gradient-to-t from-transparent to-[#0e1322] border-t border-gray-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Engineering & Design Blog</h2>
              <p className="text-gray-400 leading-relaxed">
                Technical resources, solutions to architecture bottlenecks, and software engineering articles written by our core team.
              </p>
            </div>
            <a href="#blog" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors mt-4 md:mt-0 flex items-center gap-2">
              Browse All Articles <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <article key={blog.id} className="premium-glass rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between group hover:border-indigo-500/20 transition-all duration-300">
                  <div className="p-6">
                    <span className="text-xs text-indigo-400 font-semibold">{blog.category.name}</span>
                    <h3 className="text-lg font-bold text-white mt-3 mb-4 group-hover:text-indigo-300 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-3 mb-6">{blog.content.substring(0, 150)}...</p>
                  </div>
                  <div className="p-6 bg-gray-900/40 border-t border-gray-800/30 flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                      Read Full <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              ))
            ) : (
              // Static fallback articles
              [
                { title: 'Scaling Next.js API Routes Under High Concurrency Load', cat: 'DEVELOPMENT', date: 'August 05, 2026' },
                { title: 'Configuring JWT Role Access Controls with Prisma Schema Maps', cat: 'SECURITY', date: 'July 28, 2026' },
                { title: 'Optimizing Supabase PostgreSQL connection limits on Serverless', cat: 'DATABASE', date: 'July 14, 2026' }
              ].map((blog, idx) => (
                <article key={idx} className="premium-glass rounded-2xl overflow-hidden border border-gray-800 flex flex-col justify-between group">
                  <div className="p-6">
                    <span className="text-xs text-indigo-400 font-semibold">{blog.cat}</span>
                    <h3 className="text-base font-bold text-white mt-3 mb-3 group-hover:text-indigo-300 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-450 text-xs leading-relaxed">
                      Deep dive into technical patterns, step-by-step solutions, and structural guidelines to build scalable applications.
                    </p>
                  </div>
                  <div className="p-6 bg-gray-900/40 border-t border-gray-800/30 flex items-center justify-between text-xs text-gray-400">
                    <span>{blog.date}</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-800/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">Partner Integrations & Reviews</h2>
          <p className="text-gray-400 leading-relaxed">
            Hear from startup founders and development leads who transformed their businesses using Sapirox architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div key={t.id} className="premium-glass p-8 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <p className="text-gray-300 italic leading-relaxed text-sm mb-6">"{t.feedback}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-indigo-400 text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-gray-450">{t.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Static testimonies
            [
              { name: 'Kanishka Silva', role: 'Founder, TradeFlow', text: 'Sapirox delivered our retail synchronization dashboard 2 weeks ahead of schedule. The code architecture is extremely clean.' },
              { name: 'Malith Perera', role: 'Tech Lead, PayPulse', text: 'Implementing custom JWT middleware and role restrictions was simplified with their backend engineering consultancy.' },
              { name: 'Sanduni Fernando', role: 'Product Owner, EduStart', text: 'The static rendering setup next.js website has enhanced our SEO rankings by 40% within just three months.' }
            ].map((t, idx) => (
              <div key={idx} className="premium-glass p-8 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <p className="text-gray-300 italic leading-relaxed text-sm mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-indigo-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── CONTACT FORM SECTION ────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 bg-[#090d19]/60 border-t border-gray-800/40 relative">
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[90px] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Ready to engineer your <br />
              <span className="premium-gradient-text">next business application?</span>
            </h2>
            <p className="text-gray-450 leading-relaxed mb-8">
              Send us a direct message outlining your target deliverables, key system modules, and schedule. One of our lead software engineers will reply with a detailed system architecture proposal within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                <span>support@sapirox.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Globe className="h-5 w-5 text-indigo-400" />
                <span>Colombo, Sri Lanka (Remote Worldwide Support)</span>
              </div>
            </div>
          </div>

          <div className="premium-glass p-8 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6">Outline Your Project Goals</h3>
            
            {formStatus.type && (
              <div className={`p-4 rounded-xl mb-6 text-sm ${formStatus.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                    placeholder="E.g. john@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
                  placeholder="E.g. Web portal development requirement"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors resize-none"
                  placeholder="Outline key system features or database constraints..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'} <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
