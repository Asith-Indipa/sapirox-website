import React from 'react';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Sapirox',
  description: 'Learn how Sapirox collects, uses, and protects your information when using our services and products.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-[85vh] pt-32 pb-20 px-6 max-w-4xl mx-auto">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="relative space-y-8">
        <div className="border-b border-gray-800 pb-8">
          <div className="flex items-center gap-3 text-indigo-400 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xs font-semibold uppercase tracking-wider">Security & Trust</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-heading">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            Last Updated: August 17, 2026
          </p>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
          <p>
            At Sapirox, we prioritize the privacy and security of our clients, users, and website visitors. This Privacy Policy details the types of information we collect, how we process it, and the security protocols we employ to protect your data.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when submitting queries via our Contact Form, expressing interest in our products, or applying for job openings. This information includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Personal identifiers such as name, email address, and phone number.</li>
              <li>Professional information such as company name and organization structure.</li>
              <li>Project details, preferences, and custom messages provided during inquiries.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. How We Use Your Information</h2>
            <p>
              Sapirox processes collected information for legitimate business purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>To evaluate and respond to software engineering, design, and consultancy inquiries.</li>
              <li>To provide, maintain, and improve our services, web applications, and products.</li>
              <li>To send updates, system alerts, notifications, and response updates.</li>
              <li>To comply with legal obligations and prevent fraud or malicious activities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. Data Retention & Security</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to protect your personal data from unauthorized access, loss, or alteration. We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is mandated by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Third-Party Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to third parties. We may use trusted third-party service providers (such as hosting platforms or email services) to help us operate our business, provided they agree to keep your information confidential.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Your Consent</h2>
            <p>
              By using our website, submitting inquiries, or agreeing to our checkbox consent fields, you consent to our collection and processing of your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-gray-800/60">
            <h2 className="text-xl font-bold text-white tracking-tight">6. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your personal data, please reach out to us at:
            </p>
            <p className="text-indigo-400 font-semibold mt-1">
              Email: info@sapirox.com | support@sapirox.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
