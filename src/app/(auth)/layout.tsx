import React from "react";
import { ArrowLeft } from "lucide-react";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-150">
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <a href="/" className="inline-block group py-1" aria-label="DHURANDHAR Home">
          <DhurandharWordmark size="lg" />
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 py-8 px-6 sm:px-10 rounded-3xl shadow-xl dark:shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
