import React from "react";
import { Metadata } from "next";
import { dbRepository } from "@/lib/db/repository";
import { AboutFounderSection } from "@/components/about/AboutFounderSection";
import { Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Journey | Project Dhurandhar",
  description:
    "Learn about Dr. Ajay Kumar, AI Automation Labs LLP, and the philosophy behind Project Dhurandhar: Road to ₹30CR Revenue.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const founderProfile = await dbRepository.getFounderProfile();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Editorial Header - High-contrast in both Light & Dark modes */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>The Founder & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Why We Are Building Towards ₹30 Crore in Public
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Most business success stories in India are packaged in hindsight. Project Dhurandhar documents the raw, daily reality of scaling an enterprise AI company in real-time.
        </p>
      </div>

      {/* Interactive Founder Profile & Operating Principles */}
      <AboutFounderSection initialProfile={founderProfile} />
    </div>
  );
}
