import React from "react";
import { ArrowLeft } from "lucide-react";
import { DhurandharLogo } from "@/components/brand/DhurandharLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Cosmic Horizon Glow */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-violet-600/20 via-indigo-600/10 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      {/* Sovereign Top-Left Navigation */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20">
        <a
          href="/"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40 text-xs font-semibold shadow-md transition-all group backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 group-hover:text-amber-400 transition-all" />
          <span>Back to Home</span>
        </a>
      </div>

      <div className="w-full max-w-md mx-auto pt-6 pb-2">
        <div className="relative bg-slate-900/60 dark:bg-[#0b101d]/75 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-indigo-950/60">
          {/* Glowing Floating Emblem */}
          <div className="flex justify-center -mt-16 sm:-mt-18 mb-2">
            <a
              href="/"
              className="inline-block p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950/95 border border-amber-400/40 shadow-xl shadow-amber-500/10 backdrop-blur-xl hover:scale-105 transition-transform"
            >
              <DhurandharLogo size="lg" />
            </a>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
