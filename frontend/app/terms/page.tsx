import React from 'react';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Sapirox',
  description: 'Understand the terms and conditions that govern your use of the services and products provided by Sapirox.',
};

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-[85vh] pt-32 pb-20 px-6 max-w-4xl mx-auto">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative space-y-8">
        <div className="border-b border-border pb-8">
          <div className="flex items-center gap-3 text-primary mb-4">
            <FileText className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wider">Agreement & Conditions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground/80 mt-3">
            Last Updated: August 17, 2026
          </p>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
          <p>
            Welcome to Sapirox. These Terms of Service outline the rules, regulations, and conditions governing the use of Sapirox's website, products, software services, and consulting solutions. By accessing this website or engaging our services, you agree to comply with these terms.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">1. Services & Engagement</h2>
            <p>
              Sapirox provides custom software development, mobile application development, enterprise POS systems, UI/UX design, and SaaS products. The specific deliverables, project scope, timelines, and payment structures of any custom engagement will be detailed in separate, mutually signed agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">2. Intellectual Property</h2>
            <p>
              Unless otherwise specified in a separate project contract, all intellectual property rights for the Sapirox brand, website content, software platforms, logos, and custom codebases built by our engineers remain the property of Sapirox Technologies. You are granted a limited license to access our public resources for personal or prospective business evaluation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">3. User Conduct</h2>
            <p>
              When utilizing our contact forms, inquiry blocks, or software platforms, you agree:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Not to submit false, misleading, or fraudulent contact information.</li>
              <li>Not to inject malicious code, scripts, or perform denial of service attacks.</li>
              <li>Not to attempt unauthorized access to our administrative backends or server infrastructures.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">4. Limitation of Liability</h2>
            <p>
              Under no circumstances shall Sapirox, its directors, or its software engineers be liable for any indirect, incidental, special, or consequential damages (including loss of profits, data, or operational downtime) arising out of the use or inability to use this website or our public resources.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-border/60">
            <h2 className="text-xl font-bold text-foreground tracking-tight">5. Updates & Modification</h2>
            <p>
              Sapirox reserves the right to revise or modify these Terms of Service at any time without prior notice. By continuing to use our website or services, you agree to be bound by the updated terms.
            </p>
            <p className="text-primary font-semibold mt-1">
              If you have queries, contact: info@sapirox.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
