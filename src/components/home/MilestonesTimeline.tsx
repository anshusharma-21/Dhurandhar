import React from "react";
import { RevenueMilestone } from "@/lib/types/revenue";
import { formatDate } from "@/lib/utils/formatters";
import { Flag, CheckCircle2, Clock } from "lucide-react";

interface MilestonesTimelineProps {
  milestones: RevenueMilestone[];
}

export function MilestonesTimeline({ milestones }: MilestonesTimelineProps) {
  const visibleMilestones = milestones.filter((m) => m.visibility);

  if (visibleMilestones.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="milestones-heading">
        <div className="bg-white/80 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3">
          <Flag className="w-6 h-6 text-amber-500 mx-auto" />
          <h2 id="milestones-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Journey Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Roadmap milestones are currently being scheduled for the next financial phase.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="milestones-heading">
      <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
          <Flag className="w-4 h-4 text-amber-500" />
          <span>ROADMAP TO ₹30CR</span>
        </div>
        <h2 id="milestones-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Strategic Journey Milestones
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Critical operational inflection points and revenue markers across our journey from Day 1 to ₹30 Crore ARR.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-300 dark:border-white/10 ml-4 md:ml-32 space-y-8 pl-6 md:pl-10">
        {visibleMilestones.map((milestone) => {
          const isPast = new Date(milestone.milestone_date) <= new Date();

          return (
            <div key={milestone.id} className="relative group">
              {/* Node Icon */}
              <div
                className={`absolute -left-[35px] md:-left-[51px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110 ${
                  isPast
                    ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-[#07090e] border-amber-500 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Milestone Card */}
              <div className="bg-white/90 dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131824] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm dark:shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {milestone.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                    {formatDate(milestone.milestone_date)}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {milestone.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
