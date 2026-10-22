"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Compass } from "lucide-react";

export function TheJourney() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsInView(true);
      return;
    }

    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const principles = [
    {
      num: "01",
      title: "Radical Public Transparency",
      desc: "No vanity ARR metrics or inflated pipeline numbers. We report actual invoiced delivery, recognised collections, and real unit economics.",
      delayMs: 150,
    },
    {
      num: "02",
      title: "Daily Architectural Logs",
      desc: "Every day Dr. Ajay Kumar documents operational choices, agentic software pipelines, and engineering trade-offs made in the field.",
      delayMs: 350,
    },
    {
      num: "03",
      title: "Unvarnished Setbacks",
      desc: "When client deals stall, prompts drift, or delivery timelines hit friction, we do not edit out the struggle. We dissect it openly.",
      delayMs: 550,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      aria-labelledby="the-journey-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Editorial Manifesto Column */}
        <div
          className={`lg:col-span-5 space-y-6 transition-all duration-700 ease-out ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>THE PURPOSE & MANIFESTO</span>
          </div>

          <h2
            id="the-journey-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.14]"
          >
            Why document an enterprise journey in public?
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Most business growth stories are told in retrospect, polished and sanitised with survivorship bias.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white font-semibold">Project Dhurandhar</strong> flips the script. We are recording our path to <span className="whitespace-nowrap">₹30 Crore</span> in annual revenue as it unfolds in real time—before knowing the ultimate ending.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-l-2 border-amber-500/50 pl-4 py-1 italic">
              “Building a high-margin technology enterprise in India requires relentless operational discipline, not overnight hype. This journal is our public contract of accountability.”
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/about"
              className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 uppercase tracking-wider transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read the Full Founding Story</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right 3 Core Operating Pillars - Staggered Slide In from Right One by One */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-5 overflow-hidden py-1">
          {principles.map((item) => (
            <div
              key={item.num}
              style={{
                transitionDuration: "700ms",
                transitionDelay: `${item.delayMs}ms`,
              }}
              className={`group relative overflow-hidden bg-white/90 dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#141a27] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-card hover:shadow-[0_12px_32px_-6px_rgba(245,158,11,0.22)] hover:-translate-y-1.5 hover:translate-x-1.5 transition-all ease-out cursor-default ${
                isInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              }`}
            >
              {/* Golden top accent bar on hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Corner ambient gold glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start space-x-5">
                <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400/80 group-hover:text-amber-500 dark:group-hover:text-amber-300 group-hover:scale-110 transition-all shrink-0">
                  {item.num}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
