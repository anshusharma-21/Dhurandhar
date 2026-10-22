import React from "react";
import { formatINR, formatDate } from "@/lib/utils/formatters";
import { RevenueCalculations, RevenueSettings, RevenueMilestone } from "@/lib/types/revenue";
import { isServerSupabaseConfigured } from "@/lib/supabase/server";
import { Target, Clock, ArrowUpRight, ShieldCheck, Flag, CheckCircle2 } from "lucide-react";

interface RevenueSnapshotProps {
  metrics: RevenueCalculations | null;
  settings: RevenueSettings;
  milestones?: RevenueMilestone[];
}

export function RevenueSnapshot({ metrics, settings, milestones = [] }: RevenueSnapshotProps) {
  if (settings.visibility === "private" || !metrics) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 dark:bg-[#111622] border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <span>Revenue figures are currently kept private by administrator configuration.</span>
        </div>
      </section>
    );
  }

  const { targetAmount, totalActual, remainingAmount, percentage, isTargetExceeded, lastUpdated } = metrics;
  const isLiveDb = isServerSupabaseConfigured;
  // Key trajectory waypoints along the ₹30 Crore roadmap
  const roadmapPoints = [
    { label: "Day 1 Launch", targetCr: "₹0 Cr", pct: 0 },
    { label: "First Enterprise Retainer", targetCr: "₹1.5 Cr", pct: 5 },
    { label: "Phase 1 Foundation", targetCr: "₹5.0 Cr", pct: 16.6 },
    { label: "Scale Inflection", targetCr: "₹15.0 Cr", pct: 50 },
    { label: "₹30 Crore Target", targetCr: "₹30.0 Cr", pct: 100 },
  ];

  const activeMilestonesCount = milestones.filter((m) => m.visibility).length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" aria-labelledby="revenue-mission-heading">
      <div className="bg-white/95 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 border-t-2 border-t-amber-500/50 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-400/5 blur-[120px] pointer-events-none -z-0" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

        {/* Section Top Header & Data Mode Verification Badge */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-slate-200/80 dark:border-white/10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
              <Target className="w-4 h-4 text-amber-500" />
              <span>THE FINANCIAL CORE • {settings.goal_label}</span>
            </div>
            <h2 id="revenue-mission-heading" className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Trajectory to ₹30 Crore
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Every invoice, receipt, and financial stage logged transparently under self-reported {settings.revenue_definition} accounting ({settings.gst_treatment === "excluded" ? "excl. 18% GST" : "incl. GST"}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Status Indicator Badge */}
            <div
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isLiveDb
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveDb ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span>{isLiveDb ? `Updated ${formatDate(lastUpdated)}` : "Operational Baseline"}</span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(lastUpdated)}</span>
              {activeMilestonesCount > 0 && (
                <>
                  <span>•</span>
                  <span>{activeMilestonesCount} Milestones</span>
                </>
              )}
            </div>

            <a
              href="/revenue"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 hover:border-amber-500/50 bg-slate-100 dark:bg-white/5 transition-colors"
            >
              <span>Detailed Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Big Editorial Numbers Grid - Interactive Luxury Cards */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* 1. Target Stated */}
          <div className="group relative overflow-hidden bg-slate-50/90 dark:bg-[#111622] hover:bg-slate-100/90 dark:hover:bg-[#151c2d] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-6px_rgba(245,158,11,0.22)] cursor-default">
            {/* Golden top accent line on hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Subtle ambient corner glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 uppercase tracking-[0.16em] block mb-2 transition-colors">
              Mission Target
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-950 dark:group-hover:text-white transition-colors whitespace-nowrap font-tabular">
              {formatINR(targetAmount, true)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-amber-600/80 dark:group-hover:text-amber-400/80 mt-2 block font-mono transition-colors whitespace-nowrap">
              ₹30,00,00,000 INR
            </span>
          </div>

          {/* 2. Achieved Revenue */}
          <div className="group relative overflow-hidden bg-slate-50/90 dark:bg-[#111622] hover:bg-slate-100/90 dark:hover:bg-[#161d2d] border border-amber-500/40 dark:border-amber-400/40 hover:border-amber-500/80 dark:hover:border-amber-400/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-6px_rgba(245,158,11,0.3)] cursor-default">
            {/* Always-on subtle golden top line, brighter on hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-amber-400 to-amber-500/40 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/15 group-hover:bg-amber-500/25 rounded-full blur-xl pointer-events-none transition-all duration-300" />
            
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.16em] block mb-2">
              Revenue Achieved
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700 dark:text-amber-300 group-hover:text-amber-600 dark:group-hover:text-amber-200 tracking-tight transition-colors whitespace-nowrap font-tabular">
              {formatINR(totalActual, true)}
            </div>
            <span className="text-[11px] text-amber-600/90 dark:text-amber-400/80 mt-2 block font-mono whitespace-nowrap">
              {formatINR(totalActual, false)}
            </span>
          </div>

          {/* 3. Gap Remaining */}
          <div className="group relative overflow-hidden bg-slate-50/90 dark:bg-[#111622] hover:bg-slate-100/90 dark:hover:bg-[#151c2d] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-6px_rgba(245,158,11,0.22)] cursor-default">
            {/* Golden top accent line on hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 uppercase tracking-[0.16em] block mb-2 transition-colors">
              Remaining Gap
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-950 dark:group-hover:text-white transition-colors whitespace-nowrap font-tabular">
              {isTargetExceeded ? "Completed" : formatINR(remainingAmount, true)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-amber-600/80 dark:group-hover:text-amber-400/80 mt-2 block font-mono transition-colors whitespace-nowrap">
              {isTargetExceeded ? "Target Goal Reached" : `${formatINR(remainingAmount, false)} to go`}
            </span>
          </div>

          {/* 4. Target Percentage */}
          <div className="group relative overflow-hidden bg-slate-50/90 dark:bg-[#111622] hover:bg-slate-100/90 dark:hover:bg-[#151c2d] border border-slate-200/80 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-6px_rgba(245,158,11,0.22)] cursor-default">
            {/* Golden top accent line on hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 uppercase tracking-[0.16em] block mb-2 transition-colors">
              Target Completed
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors font-tabular">
              {percentage}%
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-amber-600/80 dark:group-hover:text-amber-400/80 mt-2 block transition-colors whitespace-nowrap">
              {(100 - percentage).toFixed(1)}% of ₹30 Cr remaining
            </span>
          </div>
        </div>

        {/* Visually Powerful Horizontal Progress Trajectory Graphic */}
        <div className="relative z-10 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
              <span className="whitespace-nowrap">₹0 (Day 1 Inception)</span>
            </div>
            <div className="text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-xs whitespace-nowrap">
              Current Trajectory: {percentage}% of ₹30 Cr Realised
            </div>
            <div className="flex items-center space-x-2 text-right">
              <span className="whitespace-nowrap font-semibold">Goal: ₹30 Cr</span>
              <Flag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            </div>
          </div>

          {/* The Multi-layer Trajectory Gauge */}
          <div className="relative w-full">
            {/* Track Background */}
            <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-[#171e2c] border border-slate-300 dark:border-white/10 overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 ${percentage > 0 ? "shadow-[0_0_20px_rgba(245,158,11,0.5)]" : ""} transition-all duration-1000`}
                style={{ width: `${Math.min(100, percentage)}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Revenue progress toward ₹30 Crore target"
              />
            </div>
          </div>

          {/* Trajectory Waypoints Markers */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {roadmapPoints.map((point, idx) => {
              const isAchieved = percentage >= point.pct && point.pct > 0;
              return (
                <div key={idx} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
                    {isAchieved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                    )}
                    <span className="truncate">{point.targetCr}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 truncate">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
