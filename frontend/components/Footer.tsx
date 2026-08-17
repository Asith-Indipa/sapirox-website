import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/40 pt-16 pb-12 px-6 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/40">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Sapirox Logo" 
                className="h-9 w-auto object-contain max-h-9 dark:bg-white dark:px-2 dark:py-1 dark:rounded-xl" 
              />
              <span className="text-xl font-bold tracking-tight text-foreground font-heading">
                Sapirox
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Engineering reliable software for modern businesses.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact?ref=careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Connect</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@sapirox.com" className="hover:text-foreground transition-colors block">
                  info@sapirox.com
                </a>
              </li>
              <li>
                <a href="mailto:support@sapirox.com" className="hover:text-foreground transition-colors block">
                  support@sapirox.com
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors block">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors block">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row: Legal links & copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Sapirox. All rights reserved.</span>
            <span className="hidden md:inline text-border">·</span>
            <span>Sri Lanka · Serving clients worldwide</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
