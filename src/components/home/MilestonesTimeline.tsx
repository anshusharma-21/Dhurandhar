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
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3 shadow-sm">
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20" aria-labelledby="milestones-heading">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-[0.2em]">
          <Flag className="w-4 h-4 text-amber-500" />
          <span>ROADMAP TO ₹30CR</span>
        </div>
        <h2 id="milestones-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Strategic Journey Milestones
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Critical operational inflection points and revenue markers across our journey from Day 1 to ₹30 Crore ARR.
        </p>
      </div>

      <div className="relative border-l-2 border-amber-500/30 dark:border-amber-400/20 ml-4 md:ml-24 lg:ml-32 space-y-7 pl-6 md:pl-10">
        {visibleMilestones.map((milestone) => {
          const isPast = new Date(milestone.milestone_date) <= new Date();

          return (
            <div key={milestone.id} className="relative group">
              {/* High-Contrast Node Icon */}
              <div
                className={`absolute -left-[35px] md:-left-[51px] top-3.5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110 shadow-sm ${
                  isPast
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : "bg-slate-900 dark:bg-black border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              {/* Polished Milestone Card */}
              <div className="bg-white dark:bg-[#0e131d] hover:bg-slate-50/80 dark:hover:bg-[#131824] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {milestone.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0 w-fit">
                    {formatDate(milestone.milestone_date)}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
