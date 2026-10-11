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
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Goal Target
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatINR(targetAmount, true)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Basis: {settings.target_basis}
          </span>
        </div>

        <div className="bg-navy-900 border border-teal-800/40 rounded-2xl p-5 shadow-card">
          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold block mb-1">
            Reported Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
            {formatINR(totalActual, true)}
          </div>
          <span className="text-[11px] text-teal-500/80 mt-1 block">
            Definition: {settings.revenue_definition}
          </span>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Remaining Gap
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-200">
            {isTargetExceeded ? "Target Exceeded" : formatINR(remainingAmount, true)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            GST: {settings.gst_treatment}
          </span>
        </div>

        <div className="bg-navy-900 border border-brand-gold/40 rounded-2xl p-5 shadow-card">
          <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold block mb-1">
            Progress Percentage
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            {percentage}%
          </div>
          <span className="text-[11px] text-amber-500/80 mt-1 block">
            Updated: {formatDate(lastUpdated)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-400">Journey Progress</span>
          <span className="text-brand-gold">{percentage}% of ₹30 Crore Goal</span>
        </div>
        <div className="w-full h-4 rounded-full bg-navy-950 border border-navy-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-sky via-cyan-400 to-amber-400 transition-all duration-1000"
            style={{ width: `${Math.min(100, Math.max(1, percentage))}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 text-center">
          {isTargetExceeded 
            ? "Goal exceeded! AI Automation Labs has crossed the ₹30 Crore benchmark." 
            : `₹${((300000000 - totalActual) / 10000000).toFixed(2)} Crore remaining to target.`}
        </p>
      </div>

      {/* Monthly Chart (Suppressed if summary only) */}
      {visibility === "public_detailed" && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-navy-800 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                Monthly Target vs Actual (in ₹ Lakhs)
              </h2>
              <p className="text-xs text-slate-400">
                Tracking monthly financial velocity across corporate automation contracts.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/api/revenue/export"
                download
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white rounded-lg text-xs border border-navy-700 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                <span>Export CSV</span>
              </a>
            </div>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="L" />
                <Tooltip content={customTooltip} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="Target" fill="#334155" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="Actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Monthly Actuals Table (AC-14: handles "Not entered" states) */}
      {visibility === "public_detailed" && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-4">
            Detailed Monthly Ledger
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Month</th>
                  <th className="py-3 px-4 font-semibold">Target (INR)</th>
                  <th className="py-3 px-4 font-semibold">Actual (INR)</th>
                  <th className="py-3 px-4 font-semibold">Variance</th>
                  <th className="py-3 px-4 font-semibold">Status / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800 text-slate-300">
                {monthlyTrend.map((row) => (
                  <tr key={row.monthStart} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{row.month}</td>
                    <td className="py-3.5 px-4">{formatINR(row.target, true)}</td>
                    <td className="py-3.5 px-4 font-medium text-teal-300">
                      {row.hasData ? formatINR(row.actual, true) : (
                        <span className="italic text-slate-500">Not entered</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {row.hasData ? (
                        <span className={row.variance >= 0 ? "text-teal-400" : "text-amber-400"}>
                          {row.variance >= 0 ? "+" : ""}{formatINR(row.variance, true)} ({row.variancePct}%)
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
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
      <div className="bg-navy-950 border border-navy-800 rounded-2xl p-6 text-xs text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-brand-gold font-semibold text-xs">
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
