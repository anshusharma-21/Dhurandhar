"use client";

import React, { useState } from "react";
import { RevenueSettings, RevenueCalculations, RevenueMilestone } from "@/lib/types/revenue";
import { formatINR, formatDate } from "@/lib/utils/formatters";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  FileSpreadsheet, 
  Info, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface RevenueDashboardViewProps {
  settings: RevenueSettings;
  metrics: RevenueCalculations | null;
  milestones: RevenueMilestone[];
  visibility: "public_detailed" | "public_summary" | "private";
}

export function RevenueDashboardView({
  settings,
  metrics,
  milestones,
  visibility,
}: RevenueDashboardViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  // AC-15: Privacy mode handling
  if (visibility === "private" || !metrics) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-navy-900 border border-navy-700 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-brand-gold" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Revenue Dashboard is Private
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
          The administrator has configured the financial metrics for Project Dhurandhar to private mode. Please check back later or review published daily episodes.
        </p>
        <a
          href="/episodes"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-sky text-slate-950 font-semibold rounded-xl text-xs"
        >
          <span>Explore Daily Episodes</span>
        </a>
      </div>
    );
  }

  const {
    targetAmount,
    totalActual,
    remainingAmount,
    percentage,
    isTargetExceeded,
    lastUpdated,
    monthlyTrend,
  } = metrics;

  // Chart data formatting
  const chartData = monthlyTrend.map((m) => ({
    name: m.month,
    Target: m.target / 100000, // In Lakhs for chart readability
    Actual: m.actual / 100000,
    hasData: m.hasData,
  }));

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-navy-950 border border-navy-700 p-3 rounded-xl shadow-card text-xs">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {dataPoint.hasData ? (
            <div className="space-y-1">
              <p className="text-brand-sky">
                Actual: <strong className="text-white">₹{(dataPoint.Actual).toFixed(2)} Lakhs</strong>
              </p>
              <p className="text-slate-400">
                Target: <strong className="text-white">₹{(dataPoint.Target).toFixed(2)} Lakhs</strong>
              </p>
            </div>
          ) : (
            <p className="text-amber-400 italic">Not entered by owner</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12">
      {/* Executive Progress Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-card hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
            Goal Target
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(targetAmount, true)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
            Basis: {settings.target_basis}
          </span>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-teal-500/30 dark:border-teal-800/40 hover:border-teal-500/70 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-card hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold block mb-1">
            Reported Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300 tracking-tight">
            {formatINR(totalActual, true)}
          </div>
          <span className="text-[11px] text-teal-600/90 dark:text-teal-400/80 mt-1 block font-mono">
            Definition: {settings.revenue_definition}
          </span>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-card hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
            Remaining Gap
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-200 tracking-tight">
            {isTargetExceeded ? "Target Exceeded" : formatINR(remainingAmount, true)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
            GST: {settings.gst_treatment}
          </span>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-amber-500/40 hover:border-amber-500/80 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-card hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold block mb-1">
            Progress Percentage
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300 tracking-tight">
            {percentage}%
          </div>
          <span className="text-[11px] text-amber-600/90 dark:text-amber-400/80 mt-1 block font-mono">
            Updated: {formatDate(lastUpdated)}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 border-t-2 border-t-amber-500/40 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-3 transition-colors">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">Journey Progress</span>
          <span className="text-amber-700 dark:text-amber-400">{percentage}% of ₹30 Crore Goal</span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-1000 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(1, percentage))}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
          {isTargetExceeded 
            ? "Goal exceeded! AI Automation Labs has crossed the ₹30 Crore benchmark." 
            : `₹${((300000000 - totalActual) / 10000000).toFixed(2)} Crore remaining to target.`}
        </p>
      </div>

      {/* Monthly Chart */}
      {visibility === "public_detailed" && (
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-card transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-navy-800 gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Monthly Target vs Actual (in ₹ Lakhs)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tracking monthly financial velocity across corporate automation contracts.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/api/revenue/export"
                download
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-navy-950 dark:hover:bg-navy-800 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold border border-slate-300 dark:border-navy-700 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Export CSV</span>
              </a>
            </div>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="L" />
                <Tooltip content={customTooltip} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="Actual" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Monthly Actuals Table */}
      {visibility === "public_detailed" && (
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card overflow-hidden transition-colors">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Detailed Monthly Ledger
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-navy-800">
                <tr>
                  <th className="py-3 px-4 font-bold">Month</th>
                  <th className="py-3 px-4 font-bold">Target (INR)</th>
                  <th className="py-3 px-4 font-bold">Actual (INR)</th>
                  <th className="py-3 px-4 font-bold">Variance</th>
                  <th className="py-3 px-4 font-bold">Status / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-navy-800 text-slate-700 dark:text-slate-300">
                {monthlyTrend.map((row) => (
                  <tr key={row.monthStart} className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">{row.month}</td>
                    <td className="py-3.5 px-4 font-medium">{formatINR(row.target, true)}</td>
                    <td className="py-3.5 px-4 font-bold text-teal-700 dark:text-teal-300">
                      {row.hasData ? formatINR(row.actual, true) : (
                        <span className="italic text-slate-400">Not entered</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.hasData ? (
                        <span className={row.variance >= 0 ? "text-teal-700 dark:text-teal-400 font-bold" : "text-amber-700 dark:text-amber-400 font-bold"}>
                          {row.variance >= 0 ? "+" : ""}{formatINR(row.variance, true)} ({row.variancePct}%)
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {row.note || (row.hasData ? "Normal operations" : "Pending month-end close")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimers & Definitions Note */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 text-xs text-slate-600 dark:text-slate-400 space-y-2 shadow-sm dark:shadow-card transition-colors">
        <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
          <Info className="w-4 h-4" />
          <span>Accounting Definitions & Transparency Note</span>
        </div>
        <p className="leading-relaxed">
          <strong>Revenue Definition:</strong> Current figures represent <em>{settings.revenue_definition} revenue</em> under <em>{settings.target_basis}</em> accounting for AI Automation Labs LLP. GST treatment is <em>{settings.gst_treatment}</em>.
        </p>
        <p className="leading-relaxed text-[11px] text-slate-500">
          This dashboard is maintained directly by the founder and management team. It is intended for public entrepreneurial transparency and does not represent an audited statutory filing or securities prospectus.
        </p>
      </div>
    </div>
  );
}
