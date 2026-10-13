import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface AdminNextSectionProps {
  nextHref: string;
  nextTitle: string;
  nextDescription?: string;
  prevHref?: string;
  prevTitle?: string;
}

export function AdminNextSection({
  nextHref,
  prevHref,
}: AdminNextSectionProps) {
  return (
    <div className="pt-6 mt-10 border-t border-slate-200/90 dark:border-white/10 flex items-center justify-between gap-4">
      {prevHref ? (
        <a
          href={prevHref}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0e131d] hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Prev</span>
        </a>
      ) : (
        <div />
      )}

      {nextHref && (
        <a
          href={nextHref}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all ml-auto"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </a>
      )}
    </div>
  );
}
