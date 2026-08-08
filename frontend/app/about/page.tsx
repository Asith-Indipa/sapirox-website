import { Metadata } from 'next';
import Link from 'next/link';
import CustomSchema from '@/components/CustomSchema';
import { Users, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "About Sapirox | Elite Software Engineering Team";
  const fallbackDesc = "Meet Sapirox's core team of architects and engineers. We design, build, and deploy premium enterprise solutions and scalable custom software.";
  
  try {
    const encodedPath = encodeURIComponent('/about');
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
          keywords: data.keywords || "About Sapirox,Startup,Software Team,Core Engineers",
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

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="h-8 w-8 text-indigo-400" />,
      title: "Direct Collaboration",
      desc: "Work directly with the architects and core builders. We eliminate account managers and communication delays so your vision is translated directly to code."
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      title: "Agile Execution",
      desc: "We prioritize speed and performance. We skip corporate red tape, allowing us to build, deploy, and iterate custom software at lightning speeds."
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "High Concurrency & Security",
      desc: "Every line of code is written with scalability and protection in mind. We design systems that handle massive traffic spikes with ironclad database security."
    }
  ];

  const team = [
    {
      name: "Sahan Perera",
      role: "Founder & Chief Architect",
      bio: "Focuses on high-level system designs, cloud-native scalability, and data pipeline structures.",
      color: "from-indigo-600 to-indigo-400",
      accent: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
      name: "Dilshan Silva",
      role: "Co-Founder & Lead Systems Engineer",
      bio: "Specializes in secure API development, backend optimization, serverless architecture, and devops pipelines.",
      color: "from-purple-600 to-purple-400",
      accent: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "Nuwan Fernando",
      role: "UI/UX Architect & Frontend Developer",
      bio: "Dedicated to designing modern interface aesthetics, interactive micro-animations, and fluid responsive layouts.",
      color: "from-emerald-600 to-emerald-400",
      accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      gradient: "from-emerald-500/20 to-indigo-500/20"
    }
  ];

  return (
    <div className="relative min-h-[85vh] py-20 px-6 max-w-7xl mx-auto">
      <CustomSchema path="/about" />
      
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Hero Header section */}
      <div className="max-w-3xl mb-20">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          <Sparkles className="h-3 w-3" /> Meet the Builders
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 font-heading tracking-tight leading-tight">
          An Elite Core Team of <br />
          <span className="premium-gradient-text">Software Architects</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          We are a highly agile, founder-led software engineering startup. We bypass corporate layers and bureaucracy to build premium, secure, and scalable digital solutions directly for our partners.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {values.map((val, idx) => (
          <div 
            key={idx}
            className="premium-glass p-8 rounded-2xl border border-gray-800/40 relative overflow-hidden group hover:border-gray-700/60 transition-all duration-300"
          >
            <div className="mb-6 inline-block p-4 rounded-xl bg-gray-900/60 border border-gray-800/60">
              {val.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-heading">{val.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{val.desc}</p>
          </div>
        ))}
      </div>

      {/* Section Divider Heading */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
          SAPIROX FOUNDATION
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 font-heading">
          Our Core Engineers
        </h2>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {team.map((member, idx) => (
          <div 
            key={idx}
            className="premium-glass rounded-2xl border border-gray-800/40 overflow-hidden group hover:-translate-y-2 hover:border-gray-700/60 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top decorative gradient card-header */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${member.color}`} />
            
            <div className="p-8 flex-1 flex flex-col items-center text-center">
              {/* Profile Avatar Badge */}
              <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center border border-gray-800/60 mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                <span className={`text-2xl font-black bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              {/* Title & Role */}
              <h3 className="text-xl font-bold text-white font-heading mb-1">{member.name}</h3>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border mb-6 ${member.accent}`}>
                {member.role}
              </span>

              {/* Bio */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="premium-glass p-8 md:p-12 rounded-3xl border border-gray-800/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        <div className="max-w-xl z-10 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-heading mb-3">
            Have a project in mind?
          </h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Collaborate directly with our engineers to design, build, and deploy your next application suite.
          </p>
        </div>
        <div className="z-10 w-full md:w-auto">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-95 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 transition-all duration-300"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
