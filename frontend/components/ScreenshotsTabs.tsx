'use client';

import React, { useState } from 'react';

interface Screenshot {
  imageUrl: string;
  title: string;
  description: string;
}

export default function ScreenshotsTabs({ screenshots }: { screenshots: Screenshot[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  const active = screenshots[activeIdx] || screenshots[0];

  return (
    <div className="space-y-8 pt-8">
      <div className="border-b border-gray-800 pb-3">
        <h3 className="text-xl md:text-2xl font-bold text-white">Product Screenshots</h3>
        <p className="text-xs md:text-sm text-gray-400 mt-1">Explore the actual user interface and workflow in detail.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Screenshot selection tabs */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 shrink-0">
          {screenshots.map((scr, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 min-w-[200px] lg:min-w-0 ${
                activeIdx === idx
                  ? 'bg-indigo-950/20 border-indigo-500/30 text-white shadow-lg'
                  : 'bg-gray-900/30 border-transparent text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`}
            >
              <h4 className="text-xs md:text-sm font-bold">{scr.title || `Screenshot #${idx + 1}`}</h4>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1 line-clamp-1 lg:line-clamp-2">{scr.description || 'View software layout details'}</p>
            </button>
          ))}
        </div>

        {/* Right Side: Active screenshot preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full rounded-2xl overflow-hidden border border-gray-800/80 shadow-2xl shadow-indigo-950/20 animate-in fade-in duration-300">
            <img
              src={active.imageUrl}
              alt={active.title || 'Product Screenshot'}
              className="w-full h-auto block"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <h4 className="text-xs md:text-sm font-bold">{active.title}</h4>
              <p className="text-[10px] md:text-xs text-gray-300 mt-1">{active.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
