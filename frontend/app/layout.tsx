import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      className={`${outfit.variable} ${geistSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-[#F8F9FA] selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
