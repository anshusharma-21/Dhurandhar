import React from "react";
import { Metadata } from "next";
import { MessageSquare, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Guidelines | Project Dhurandhar",
  description: "Rules of engagement and moderation principles for Project Dhurandhar discussion.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-sky uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Constructive Discourse</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Community Guidelines & Moderation Policy
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Project Dhurandhar is a masterclass in business execution. Our discussion areas exist to foster sharp insights, respectful debate, and peer learning for ambitious operators.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-card">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>1. What We Encourage</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
            <li>Thoughtful questions regarding Dr. Ajay Kumar's operational decisions and tech architecture.</li>
            <li>Constructive critiques grounded in personal operating or engineering experience.</li>
            <li>Sharing relevant lessons, frameworks, and resource suggestions.</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-card">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>2. First-Time Comment Moderation</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            To prevent spam bots, self-promotional spam, and abuse, every newly registered user's initial comment enters a moderation queue. Once approved by our team, subsequent submissions will post directly subject to rate limits.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-card">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>3. Zero Tolerance for Spam & Harassment</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Personal attacks, vulgarity, repeated commercial link drops, investment solicitations, and hostile speech will result in immediate removal and permanent account suspension.
          </p>
        </div>
      </div>
    </div>
  );
}
