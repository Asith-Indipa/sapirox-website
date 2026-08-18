'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm flex items-center justify-between transition-all duration-300 cursor-pointer"
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Options Panel Overlay */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-background/95 dark:bg-background/98 shadow-xl backdrop-blur-md z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 select-scrollbar"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 text-primary font-semibold border-l-2 border-primary'
                    : 'text-foreground hover:bg-muted/70'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
