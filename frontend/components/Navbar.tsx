'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check initial theme from document class
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setTheme('dark');
    }
  };

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Insights', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-border/60 bg-background/90 backdrop-blur-lg shadow-sm shadow-primary/5 py-1' 
        : 'border-border/40 bg-background/95 backdrop-blur-md py-3'
    }`}>
      <div className={`max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'h-14' : 'h-20'
      }`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Sapirox Logo" 
            className="h-10 w-auto object-contain max-h-10 dark:bg-white dark:px-2.5 dark:py-1 dark:rounded-xl" 
          />
          <span className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Sapirox
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`transition-colors py-1 nav-link-underline ${
                isActive(link.href) 
                  ? 'text-primary font-semibold active' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-95 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-muted-foreground hover:text-foreground py-2 text-lg ${
                isActive(link.href) ? 'text-primary font-semibold' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center justify-between gap-4 mt-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border/60 text-muted-foreground bg-muted/20 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <Link 
              href="/contact" 
              className="flex-2 text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
