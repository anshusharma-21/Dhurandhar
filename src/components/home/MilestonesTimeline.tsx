import React from "react";
import { RevenueMilestone } from "@/lib/types/revenue";
import { formatDate } from "@/lib/utils/formatters";
import { Flag, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface MilestonesTimelineProps {
  milestones: RevenueMilestone[];
}

export function MilestonesTimeline({ milestones }: MilestonesTimelineProps) {
  const visibleMilestones = milestones.filter((m) => m.visibility);
  if (visibleMilestones.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" aria-labelledby="milestones-heading">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
          <Flag className="w-4 h-4 text-brand-gold" />
          <span>The Road to 30CR Roadmap</span>
        </div>
        <h2 id="milestones-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Strategic Journey Milestones
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Key inflection points and financial hurdles on our journey from Day 1 to ₹30 Crore ARR.
        </p>
      </div>

      <div className="relative border-l-2 border-navy-800 ml-4 md:ml-32 space-y-8 pl-6 md:pl-8">
        {visibleMilestones.map((milestone, idx) => {
          const isPast = new Date(milestone.milestone_date) <= new Date();

          return (
            <div key={milestone.id} className="relative group">
              {/* Node Icon */}
              <div
                className={`absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  isPast
                    ? "bg-teal-950 border-teal-400 text-teal-300"
                    : "bg-navy-950 border-amber-500 text-amber-400"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Milestone Card */}
              <div className="bg-navy-900/80 hover:bg-navy-850 border border-navy-800 rounded-2xl p-5 transition-all shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {milestone.title}
                  </h3>
                  <span className="text-xs font-medium text-brand-gold">
                    {formatDate(milestone.milestone_date)}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
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
