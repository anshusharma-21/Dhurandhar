import React from "react";
import { RevenueMilestone } from "@/lib/types/revenue";
import { formatDate } from "@/lib/utils/formatters";
import { Flag, CheckCircle2, Clock, Calendar, Sparkles } from "lucide-react";

interface MilestonesTimelineProps {
  milestones: RevenueMilestone[];
}

export function MilestonesTimeline({ milestones }: MilestonesTimelineProps) {
  const visibleMilestones = milestones.filter((m) => m.visibility);

  if (visibleMilestones.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="milestones-heading">
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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20" aria-labelledby="milestones-heading">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
          <Flag className="w-3.5 h-3.5 text-amber-500" />
          <span>ROADMAP TO ₹30CR</span>
        </div>
        <h2 id="milestones-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Strategic Journey Milestones
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
          Critical operational inflection points and revenue markers across our journey from Day 1 to ₹30 Crore ARR.
        </p>
      </div>

      {/* Integrated Timeline Spine & Connected Cards */}
      <div className="relative space-y-4 sm:space-y-5">
        {visibleMilestones.map((milestone, idx) => {
          const isPast = new Date(milestone.milestone_date) <= new Date();
          const isLast = idx === visibleMilestones.length - 1;

          return (
            <div key={milestone.id} className="relative flex items-stretch group">
              {/* Connected Left Timeline Column */}
              <div className="flex flex-col items-center shrink-0 mr-3.5 sm:mr-5">
                {/* Node Tick / Indicator Icon - Level-aligned with card title header */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 mt-3 sm:mt-3.5 shadow-sm shrink-0 z-10 ${
                    isPast
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20"
                      : "bg-slate-900 dark:bg-black border-amber-500 text-amber-400 shadow-amber-500/20"
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>

                {/* Vertical Continuous Connecting Spine */}
                {!isLast && (
                  <div className="w-[2px] flex-1 bg-gradient-to-b from-amber-500/30 via-slate-200 dark:via-white/10 to-transparent my-1 rounded-full" />
                )}
              </div>

              {/* Polished Milestone Card */}
              <div className="flex-1 bg-white dark:bg-[#0e131d] hover:bg-slate-50/80 dark:hover:bg-[#131826] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Phase {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors tracking-tight">
                      {milestone.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-mono">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span>{formatDate(milestone.milestone_date)}</span>
                    </span>

                    {isPast && (
                      <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                {milestone.description ? (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {milestone.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    Milestone operational objectives successfully registered on public ledger.
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
