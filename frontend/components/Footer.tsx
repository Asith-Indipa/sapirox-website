import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#070b13] border-t border-gray-800/60 pt-16 pb-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/40">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/10">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Sapirox
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Engineering reliable software for modern businesses.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact?ref=careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Connect</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="mailto:info@sapirox.com" className="hover:text-white transition-colors block">
                  info@sapirox.com
                </a>
              </li>
              <li>
                <a href="mailto:support@sapirox.com" className="hover:text-white transition-colors block">
                  support@sapirox.com
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row: Legal links & copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} Sapirox. All rights reserved.</span>
            <span className="hidden md:inline text-gray-700">·</span>
            <span>Sri Lanka · Serving clients worldwide</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
