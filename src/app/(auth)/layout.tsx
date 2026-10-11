import React from "react";
import { Flame, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Dhurandhar</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <a href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-700 flex items-center justify-center">
            <Flame className="w-5 h-5 text-brand-gold" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            PROJECT DHURANDHAR
          </span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-navy-900 border border-navy-800 py-8 px-6 sm:px-10 rounded-3xl shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
