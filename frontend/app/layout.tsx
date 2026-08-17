import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sapirox | Premium Enterprise Software Solutions & IT Startup",
  description: "Accelerate your business with Sapirox. We deliver modern web development, bespoke internal tools, scalable SaaS solutions, and premium enterprise UI services.",
  keywords: ["Sapirox", "Software Startup", "Enterprise Solutions", "Next.js", "Web Development", "Bespoke Software", "SaaS", "CMS"],
  authors: [{ name: "Sapirox Dev Team" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark')
                } else {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}