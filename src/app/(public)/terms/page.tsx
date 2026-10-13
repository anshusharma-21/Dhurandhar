import React from "react";
import { Metadata } from "next";
import { AlertCircle, Scale, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Revenue Disclaimer | Project Dhurandhar",
  description: "Terms of use and financial disclosure disclaimer for Project Dhurandhar.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
          <Scale className="w-4 h-4 text-brand-gold" />
          <span>Legal Disclosures</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Terms of Use & Financial Disclaimer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Please read these terms and revenue disclosures carefully before utilizing Project Dhurandhar.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Important Revenue Disclaimer Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2 font-bold text-sm text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5" />
            <span>MANDATORY REVENUE TRANSPARENCY DISCLAIMER</span>
          </div>
          <p className="text-xs leading-relaxed">
            All financial goals, progress metrics, monthly figures, and milestone declarations published on this website and in accompanying video logs are <strong>self-reported operational progress numbers</strong> by the management of AI Automation Labs LLP.
          </p>
          <p className="text-xs leading-relaxed">
            These disclosures <strong>do not constitute an audited financial statement</strong>, statutory filing, prospectus, or an offer/solicitation to invest in securities, equity, or promissory instruments.
          </p>
        </div>

        <section className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Informational & Educational Nature</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Project Dhurandhar is an entrepreneurial documentary chronicling the daily execution of AI Automation Labs LLP. The content is shared for business education, transparency, and personal storytelling.
          </p>
        </section>

        <section className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. User Conduct & Discussion Rules</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            By creating an account and participating in episode discussions, you agree not to submit unlawful, defamatory, infringing, or abusive material. We reserve the right to moderate, hide, or delete any comment that violates our community standards.
          </p>
        </section>

        <section className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Governing Law</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            These terms are governed by the applicable laws of India. Any disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>
      </div>
    </div>
  );
}
