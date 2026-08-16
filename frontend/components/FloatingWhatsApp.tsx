'use client';

import React, { useState, useEffect } from 'react';
import { getPageContentByName } from '@/services/api';

export default function FloatingWhatsApp() {
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  useEffect(() => {
    async function loadWhatsapp() {
      try {
        const data = await getPageContentByName('contact');
        if (data && data.content && data.content.info) {
          const info = data.content.info as any;
          if (info.whatsappUrl) {
            setWhatsappUrl(info.whatsappUrl);
          } else if (info.whatsappNumber) {
            // fallback construct URL if number exists but URL doesn't
            const cleanNum = info.whatsappNumber.replace(/[^\d]/g, '');
            setWhatsappUrl(`https://wa.me/${cleanNum}`);
          }
        }
      } catch (err) {
        // Fail silently
      }
    }
    loadWhatsapp();
  }, []);

  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:hidden" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-gray-950 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        Chat with us on WhatsApp
      </span>

      {/* WhatsApp SVG Icon */}
      <svg
        className="h-7 w-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.022-.08-.117-.162-.285-.249-.17-.087-1.007-.497-1.162-.553-.158-.056-.273-.082-.389.09-.116.17-.448.552-.549.67-.101.116-.203.13-.372.046-.17-.087-.714-.263-1.36-.839-.503-.448-.842-.998-.94-1.169-.098-.17-.01-.262.075-.347.077-.076.17-.198.256-.299.086-.102.115-.17.172-.284.058-.115.029-.214-.014-.301-.044-.087-.39-1.007-.536-1.36-.143-.347-.288-.3-.396-.305-.102-.005-.22-.006-.338-.006a.65.65 0 0 0-.469.219c-.161.17-.615.6-.615 1.461 0 .863.629 1.696.717 1.817.088.12 1.238 1.892 3.001 2.651.419.18.747.288.998.368.42.133.803.114 1.106.07.338-.05 1.007-.412 1.148-.809.141-.397.141-.736.099-.809zM12.147 2.008c-5.502 0-9.977 4.478-9.977 9.984 0 1.76.459 3.479 1.332 4.997l-1.417 5.176 5.295-1.389a9.92 9.92 0 0 0 4.764 1.213c5.502 0 9.98-4.477 9.98-9.984 0-5.507-4.478-9.995-9.977-9.995zm.01 17.93c-1.49 0-2.95-.401-4.225-1.159l-.304-.18-3.143.825.84-3.064-.198-.314a8.27 8.27 0 0 1-1.267-4.329c0-4.57 3.72-8.293 8.3-8.293 2.217 0 4.303.866 5.867 2.434 1.564 1.569 2.427 3.658 2.426 5.876-.002 4.572-3.725 8.296-8.3 8.296z" />
      </svg>
    </a>
  );
}
