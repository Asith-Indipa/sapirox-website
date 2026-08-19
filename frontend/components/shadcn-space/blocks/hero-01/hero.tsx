"use client";

import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight, Zap, Star } from "lucide-react";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export type AvatarList = {
  image: string;
};

type HeroSectionProps = {
  avatarList?: AvatarList[];
};

function HeroSection({ avatarList }: HeroSectionProps) {
  return (
    <section className="relative pt-10 md:pt-20 pb-8">
      <div className="w-full h-full relative">
        <div className="relative w-full pt-0 md:pt-12 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-cyan-500/15 before:via-blue-600/10 before:to-primary/10 before:rounded-full before:top-12 before:blur-3xl before:-z-10 dark:before:from-cyan-500/20 dark:before:via-blue-600/20 dark:before:to-indigo-950/30 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
          <div className="container mx-auto relative z-10 px-4 sm:px-6">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              
              {/* Badge */}
              <div className="flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  <Zap className="h-3.5 w-3.5" /> Enterprise Grade IT Solutions
                </motion.div>
              </div>

              {/* Headline & Subtitle */}
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="lg:text-8xl md:text-7xl text-5xl font-extrabold tracking-tight leading-14 md:leading-20 lg:leading-24 font-heading text-foreground"
                >
                  Next-Gen Software for{" "}
                  <span className={`${instrumentSerif.className} tracking-tight font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500`}>
                    Modern Enterprise
                  </span>{" "}
                  Growth
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                  className="text-base md:text-lg font-normal max-w-2xl text-muted-foreground leading-relaxed"
                >
                  At Sapirox, we engineer scalable web solutions, custom CMS platforms, internal administration software, and business-focused applications designed to accelerate productivity and tech adoption.
                </motion.p>
              </div>

              {/* Action Buttons & Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col md:flex-row justify-center gap-8 pt-4"
              >
                <Link href="#contact">
                  <Button className="relative text-sm font-semibold rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 border-0">
                    <span className="relative z-10 transition-all duration-500">
                      Launch Project
                    </span>
                    <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shadow-sm">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                </Link>

                {avatarList && avatarList.length > 0 && (
                  <div className="flex items-center sm:gap-7 gap-3">
                    <ul className="avatar flex flex-row items-center">
                      {avatarList.map((avatar, index) => (
                        <li key={index} className="-mr-2.5 z-1 hover:z-10 transition-transform hover:scale-110">
                          <img
                            src={avatar.image}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-background object-cover h-10 w-10 shadow-sm"
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="gap-1 flex flex-col items-start">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="sm:text-sm text-xs font-medium text-muted-foreground">
                        Trusted by 100+ Enterprise Clients
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
