import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#070b13] border-t border-gray-800/60 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-heading">
            Sapirox
          </span>
        </Link>
        
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Sapirox. All rights reserved. Designed & Engineered for high performance operations.
        </p>
        
        <div className="flex items-center gap-6 text-xs text-gray-400">
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
