import React from "react";
import { Metadata } from "next";
import { Flame, ShieldCheck, Target, Building2, User, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Journey | Project Dhurandhar",
  description:
    "Learn about Dr. Ajay Kumar, AI Automation Labs LLP, and the philosophy behind Project Dhurandhar: Road to ₹30CR Revenue.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4 text-brand-gold" />
          <span>The Founder & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Why We Are Building Towards ₹30 Crore in Public
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Most business success stories in India are packaged in hindsight. Project Dhurandhar documents the raw, daily reality of scaling an enterprise AI company in real-time.
        </p>
      </div>

      {/* Founder Profile Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-sky via-cyan-500 to-amber-500 p-0.5 shrink-0">
          <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-brand-gold">
            AK
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-white">Dr. Ajay Kumar</h2>
            <span className="text-xs text-brand-cyan font-semibold block">
              Founder & Managing Partner • AI Automation Labs LLP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dr. Ajay Kumar is leading AI Automation Labs LLP on a mission to build a ₹30 Crore enterprise automation firm. Chronicling the journey daily on Project Dhurandhar, he shares operational decisions, client delivery frameworks, and business lessons with total candor.
          </p>
          <div className="pt-2 flex items-center space-x-4 text-xs text-brand-sky">
            <a
              href="https://automationlabs.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 hover:underline"
            >
              <span>AI Automation Labs Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Core Operating Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-navy-900/70 border border-navy-800 rounded-2xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-950 border border-navy-700 flex items-center justify-center text-brand-gold">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Radical Accountability</h3>
            <p className="text-slate-400 leading-relaxed">
              Every milestone, metric, and setback is recorded publicly. No vanity numbers or paper valuations.
            </p>
          </div>

          <div className="bg-navy-900/70 border border-navy-800 rounded-2xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-950 border border-navy-700 flex items-center justify-center text-teal-400">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Enterprise Delivery</h3>
            <p className="text-slate-400 leading-relaxed">
              Building autonomous AI workflows and digital transformations that deliver measurable financial ROI to clients.
            </p>
          </div>

          <div className="bg-navy-900/70 border border-navy-800 rounded-2xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-950 border border-navy-700 flex items-center justify-center text-brand-sky">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Human + AI Synergy</h3>
            <p className="text-slate-400 leading-relaxed">
              Deploying artificial intelligence to multiply human leverage while keeping human discernment firmly in control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
