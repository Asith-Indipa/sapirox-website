import { Metadata } from 'next';
import Link from 'next/link';
import CustomSchema from '@/components/CustomSchema';
import { 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Target, 
  Eye, 
  Code, 
  Cpu, 
  Layers, 
  CheckCircle,
  MessageSquare,
  Activity,
  Server,
  HeartHandshake
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "About Sapirox | Custom Software & Web Development Studio";
  const fallbackDesc = "Learn about Sapirox, a founder-led software development studio. We build custom web applications, SaaS platforms, and scalable digital solutions.";
  
  try {
    const encodedPath = encodeURIComponent('/about');
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
          keywords: data.keywords || "About Sapirox,Startup,Software Team,Core Engineers,Web Development",
          openGraph: {
            title: data.ogTitle || data.metaTitle || fallbackTitle,
            description: data.ogDescription || data.metaDescription || fallbackDesc,
            images: data.ogImage ? [{ url: data.ogImage }] : [],
          }
        };
      }
    }
  } catch (err) {
    console.error("Failed to load About page SEO metadata on server side:", err);
  }

  return {
    title: fallbackTitle,
    description: fallbackDesc,
  };
}

// ── Default Fallback Content ────────────────────────────────────────────────
const DEFAULTS = {
  hero: {
    title: 'We Build Custom',
    titleHighlight: 'Software that Empowers',
    subtitle: 'A founder-led software development studio. We bypass corporate layers and bureaucracy to build premium, secure, and scalable digital solutions directly for our partners.',
  },
  story: {
    paragraph1: 'We noticed a persistent problem in the software industry: traditional agencies often introduce heavy overhead, project managers who act as filters, and rigid structures that dilute your actual product vision.',
    paragraph2: 'Sapirox was founded to bridge that gap. We connect our clients directly with the builders, focusing purely on clean code, solid performance, and transparent collaboration. We build practical software that solves real business problems and scales with you.',
  },
  mission: 'To deliver high-performance, secure, and custom-tailored software solutions that empower modern businesses to operate efficiently, build competitive advantages, and scale gracefully.',
  vision: 'To become the go-to software engineering partner for growing businesses and startups by continuously leveraging modern architectures and delivering exceptional product quality.',
  trustPoints: [
    { title: 'Custom Solutions', desc: 'No generic templates or cookie-cutter builders. Every application is built specifically to address your unique workflow and business goals.' },
    { title: 'Transparent Communication', desc: 'You collaborate directly with the engineers writing your code, eliminating middlemen, misunderstandings, and unnecessary project delays.' },
    { title: 'Scalable Architecture', desc: 'We design robust, high-performance systems prepared for future growth and high concurrency using clean coding principles.' },
    { title: 'Long-term Support', desc: 'Our relationship doesn\'t end at deployment. We provide dedicated support, maintenance, and iterative updates to keep your systems running smoothly.' },
  ],
  workflowSteps: [
    { number: '01', title: 'Discover', desc: 'We sit down to understand your business goals, target audience, and functional requirements.' },
    { number: '02', title: 'Design', desc: 'Architecting the system design, secure database schema, and interactive UI/UX prototypes.' },
    { number: '03', title: 'Develop', desc: 'Writing clean, modular, and optimized code using modern, maintainable software practices.' },
    { number: '04', title: 'Test', desc: 'Conducting rigorous testing for security, responsiveness, bugs, and performance under load.' },
    { number: '05', title: 'Deploy', desc: 'Configuring secure servers, cloud pipelines, and launching your platform smoothly to production.' },
    { number: '06', title: 'Support', desc: 'Providing ongoing maintenance, monitoring, and updates to keep your systems running flawlessly.' },
  ],
  team: [
    { name: 'Sahan Perera', role: 'Founder & Software Engineer', bio: 'Focuses on high-level system designs, cloud-native scalability, and database architecture.' },
    { name: 'Dilshan Silva', role: 'Co-Founder & Systems Engineer', bio: 'Specializes in secure API development, backend optimization, serverless architecture, and DevOps pipelines.' },
    { name: 'Nuwan Fernando', role: 'Frontend Developer & Designer', bio: 'Dedicated to designing modern interface aesthetics, interactive micro-animations, and fluid responsive layouts.' },
  ],
  technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'REST APIs', 'Git & GitHub'],
  cta: {
    title: 'Ready to bring your ideas to life?',
    subtitle: 'Reach out to our engineering team directly to discuss your upcoming project requirements.',
  }
};

// Team color presets
const TEAM_COLORS = [
  { color: 'from-cyan-500 to-blue-600', accent: 'bg-primary/10 text-primary border-primary/20', gradient: 'from-cyan-500/10 to-blue-500/10' },
  { color: 'from-blue-600 to-indigo-600', accent: 'bg-primary/10 text-primary border-primary/20', gradient: 'from-blue-500/10 to-indigo-500/10' },
  { color: 'from-indigo-600 to-purple-600', accent: 'bg-primary/10 text-primary border-primary/20', gradient: 'from-indigo-500/10 to-purple-500/10' },
];

// Trust point icons cycling
const TRUST_ICONS = [
  <Cpu key="cpu" className="h-6 w-6 text-primary" />,
  <MessageSquare key="msg" className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />,
  <Layers key="layers" className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
  <HeartHandshake key="heart" className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
  <Shield key="shield" className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />,
];

export default async function AboutPage() {
  // Fetch dynamic content from backend
  let content = DEFAULTS;
  let isError = false;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiBase}/page-content/about`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.content) {
        content = { ...DEFAULTS, ...json.data.content };
      } else {
        isError = true;
      }
    } else {
      isError = true;
    }
  } catch (err) {
    isError = true;
    console.error("Failed to load About page content:", err);
  }

  if (isError) {
    return (
      <div className="relative min-h-[85vh] py-20 px-6 max-w-7xl mx-auto flex flex-col justify-center items-center">
        <CustomSchema path="/about" />
        <div className="max-w-md w-full py-12 px-6 rounded-2xl border border-rose-500/10 bg-rose-500/5 text-center premium-glass">
          <p className="text-rose-500 dark:text-rose-400 font-medium">
            Something went wrong while loading our content. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-7xl mx-auto">
      <CustomSchema path="/about" />
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Hero Header section */}
      <ScrollReveal className="max-w-3xl mb-24">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            <Sparkles className="h-3 w-3" /> About Sapirox
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mt-6 mb-6 font-heading tracking-tight leading-tight">
            {content.hero.title} <br />
            <span className="premium-gradient-text">{content.hero.titleHighlight}</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {content.hero.subtitle}
          </p>
        </div>
      </ScrollReveal>

      {/* Our Story Section */}
      <ScrollReveal className="w-full mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              OUR STORY
            </span>
            <h2 className="text-3xl font-bold text-foreground mt-2 font-heading">
              Why We Started
            </h2>
          </div>
          <div className="lg:col-span-8 premium-glass p-8 rounded-2xl border border-border">
            <p className="text-muted-foreground leading-relaxed text-base mb-4">
              {content.story.paragraph1}
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              {content.story.paragraph2}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <ScrollReveal className="w-full flex">
          <div className="premium-glass p-8 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 w-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
            <div className="mb-6 inline-block p-4 rounded-xl bg-muted border border-border">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {content.mission}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full flex" delayClass="animation-delay-100">
          <div className="premium-glass p-8 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 w-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
            <div className="mb-6 inline-block p-4 rounded-xl bg-muted border border-border">
              <Eye className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {content.vision}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Trust / Why Sapirox Section */}
      {content.trustPoints && content.trustPoints.length > 0 && (
        <div className="mb-24">
          <ScrollReveal className="w-full text-center mb-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                WHY SAPIROX?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 font-heading">
                Built on Trust & Integrity
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.trustPoints.map((item: { title: string; desc: string }, idx: number) => (
              <ScrollReveal key={idx} delayClass={`animation-delay-${(idx % 4) * 100}`} className="w-full flex">
                <div 
                  className="premium-glass p-8 rounded-2xl border border-border hover:border-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between w-full"
                >
                  <div>
                    <div className="mb-6 inline-block p-3 rounded-xl bg-muted border border-border">
                      {TRUST_ICONS[idx % TRUST_ICONS.length]}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3 font-heading">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* How We Work Section */}
      {content.workflowSteps && content.workflowSteps.length > 0 && (
        <div className="mb-24">
          <ScrollReveal className="w-full text-center mb-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                OUR APPROACH
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 font-heading">
                How We Work
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
                A structured, collaborative approach to take your software project from concept to launch.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.workflowSteps.map((step: { number: string; title: string; desc: string }, idx: number) => (
              <ScrollReveal key={idx} delayClass={`animation-delay-${(idx % 3) * 100}`} className="w-full flex">
                <div 
                  className="premium-glass p-8 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 w-full"
                >
                  <div className="absolute top-4 right-6 text-4xl font-black text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* Core Team Section */}
      {content.team && content.team.length > 0 && (
        <div className="mb-24">
          <ScrollReveal className="w-full text-center mb-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                THE BUILDERS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 font-heading">
                Our Core Team
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.team.map((member: { name: string; role: string; bio: string; image?: string }, idx: number) => {
              const colors = TEAM_COLORS[idx % TEAM_COLORS.length];
              return (
                <ScrollReveal key={idx} delayClass={`animation-delay-${(idx % 3) * 100}`} className="w-full flex">
                  <div 
                    className="premium-glass rounded-2xl overflow-hidden border border-border group hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between w-full"
                  >
                    <div>
                      {/* Thumbnail area */}
                      <div className="h-52 w-full bg-muted flex items-center justify-center relative overflow-hidden">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-550"
                          />
                        ) : (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-40`} />
                            <span className={`text-4xl font-black bg-gradient-to-r ${colors.color} bg-clip-text text-transparent z-10 group-hover:scale-105 transition-transform duration-300`}>
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{member.role}</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{member.name}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      )}

      {/* Technologies Section */}
      {content.technologies && content.technologies.length > 0 && (
        <ScrollReveal className="w-full mb-24">
          <div>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                OUR EXPERTISE
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 font-heading">
                Technologies We Use
              </h2>
            </div>

            <div className="premium-glass p-8 rounded-2xl border border-border max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
              {content.technologies.map((tech: string, idx: number) => (
                <span 
                  key={idx}
                  className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-xl border border-border/60 hover:border-primary hover:text-foreground hover:-translate-y-0.5 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Call to Action Banner */}
      <ScrollReveal className="w-full">
        <div className="premium-glass p-8 md:p-12 rounded-3xl border border-border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-500/5 pointer-events-none" />
          <div className="max-w-xl z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground font-heading mb-3">
              {content.cta.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {content.cta.subtitle}
            </p>
          </div>
          <div className="z-10 w-full md:w-auto">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-95 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Get in Touch <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
