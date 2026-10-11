import React from "react";
import { formatINR, formatDate } from "@/lib/utils/formatters";
import { RevenueCalculations, RevenueSettings } from "@/lib/types/revenue";
import { TrendingUp, Target, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";

interface RevenueSnapshotProps {
  metrics: RevenueCalculations | null;
  settings: RevenueSettings;
}

export function RevenueSnapshot({ metrics, settings }: RevenueSnapshotProps) {
  if (settings.visibility === "private" || !metrics) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 text-center text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-brand-gold mx-auto mb-2" />
          <span>Revenue figures are currently kept private by administrator configuration.</span>
        </div>
      </section>
    );
  }

  const { targetAmount, totalActual, remainingAmount, percentage, isTargetExceeded, lastUpdated } = metrics;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" aria-labelledby="revenue-snapshot-heading">
      <div className="bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-navy-800/80 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-1">
              <Target className="w-4 h-4 text-brand-gold" />
              <span>Target Progress Snapshot</span>
            </div>
            <h2 id="revenue-snapshot-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {settings.goal_label}
            </h2>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated: {formatDate(lastUpdated)}</span>
            </div>
            <a
              href="/revenue"
              className="inline-flex items-center space-x-1 text-brand-sky hover:text-white font-semibold transition-colors"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Essential Metrics Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {/* Target Amount */}
          <div className="bg-navy-950/70 border border-navy-800/80 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Stated Target
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              {formatINR(targetAmount, true)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {formatINR(targetAmount, false)}
            </span>
          </div>

          {/* Current Verified Progress */}
          <div className="bg-navy-950/70 border border-teal-900/40 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-medium text-teal-400 uppercase tracking-wider block mb-1">
              Progress So Far
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300">
              {formatINR(totalActual, true)}
            </div>
            <span className="text-[10px] text-teal-500/80 mt-1 block">
              Self-reported ({settings.revenue_definition})
            </span>
          </div>

          {/* Remaining Gap */}
          <div className="bg-navy-950/70 border border-navy-800/80 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Remaining to Goal
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-200">
              {isTargetExceeded ? "Target Exceeded" : formatINR(remainingAmount, true)}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {isTargetExceeded ? "Above ₹30 Crore Goal" : "Gap to ₹30.00 Cr"}
            </span>
          </div>

          {/* Percentage Finished */}
          <div className="bg-navy-950/70 border border-brand-gold/30 rounded-2xl p-4 sm:p-5">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider block mb-1">
              Target Achieved
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
              {percentage}%
            </div>
            <span className="text-[10px] text-amber-500/80 mt-1 block">
              {isTargetExceeded ? "100%+ Accomplished" : `${(100 - percentage).toFixed(1)}% to completion`}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>₹0 (Journey Start)</span>
            <span className="text-brand-gold font-semibold">{percentage}% of ₹30 Crore Completed</span>
            <span>₹30.00 Cr (Target)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-navy-950 border border-navy-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-sky via-teal-400 to-brand-gold transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
