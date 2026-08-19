'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayClass?: string; // Tailwind transition-delay utility class (e.g. delay-100, delay-200, etc.)
}

export default function ScrollReveal({ children, className = '', delayClass = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
