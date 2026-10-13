"use client";

import React, { useState } from "react";
import { RevenueSettings, RevenueMonth } from "@/lib/types/revenue";
import { formatINR } from "@/lib/utils/formatters";
import { AdminNextSection } from "./AdminNextSection";
import { 
  TrendingUp, 
  Save, 
  PlusCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Calendar 
} from "lucide-react";

interface RevenueManagerClientProps {
  initialSettings: RevenueSettings;
  initialMonths: RevenueMonth[];
}

export function RevenueManagerClient({
  initialSettings,
  initialMonths,
}: RevenueManagerClientProps) {
  const [settings, setSettings] = useState<RevenueSettings>(initialSettings);
  const [months, setMonths] = useState<RevenueMonth[]>(initialMonths);
  const [savingSettings, setSavingSettings] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Single clean date input state (Default to current date)
  const [newMonthStart, setNewMonthStart] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [newMonthActual, setNewMonthActual] = useState("");
  const [newMonthTarget, setNewMonthTarget] = useState("");
  const [newMonthNote, setNewMonthNote] = useState("");
  const [savingMonth, setSavingMonth] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "settings",
          settings: {
            ...settings,
            target_amount: Number(settings.target_amount),
          },
          actorId: "admin-1",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update revenue settings.");

      setSettings(data);
      setFeedback({ type: "success", text: "Revenue configuration saved successfully." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonthStart || !newMonthActual) {
      setFeedback({ type: "error", text: "Please enter both the date and actual revenue." });
      return;
    }

    setSavingMonth(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "month",
          monthData: {
            month_start: newMonthStart,
            actual_amount: Number(newMonthActual),
            target_amount: newMonthTarget ? Number(newMonthTarget) : 0,
            note: newMonthNote,
          },
          actorId: "admin-1",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save monthly revenue.");

      // Update or append
      const existingIdx = months.findIndex((m) => m.month_start === data.month_start);
      if (existingIdx >= 0) {
        const updated = [...months];
        updated[existingIdx] = data;
        setMonths(updated);
      } else {
        setMonths([...months, data].sort((a, b) => a.month_start.localeCompare(b.month_start)));
      }

      setNewMonthActual("");
      setNewMonthNote("");
      setFeedback({ type: "success", text: `Monthly record for ${newMonthStart} saved successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSavingMonth(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-3 ${
            feedback.type === "success"
              ? "bg-teal-500/10 border border-teal-500/30 text-teal-800 dark:text-teal-200"
              : "bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Grid: Global Settings & Add Month */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form (7 cols) */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Revenue Goal Parameters
            </h2>
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSettings ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Goal Label
              </label>
              <input
                type="text"
                value={settings.goal_label}
                onChange={(e) => setSettings({ ...settings, goal_label: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount (INR)
              </label>
              <input
                type="number"
                value={settings.target_amount}
                onChange={(e) => setSettings({ ...settings, target_amount: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                required
              />
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-1 font-mono">
                {formatINR(settings.target_amount, true)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Basis
              </label>
              <select
                value={settings.target_basis}
                onChange={(e) => setSettings({ ...settings, target_basis: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="cumulative">Cumulative (Since Launch)</option>
                <option value="financial_year">Financial Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accounting Definition
              </label>
              <select
                value={settings.revenue_definition}
                onChange={(e) => setSettings({ ...settings, revenue_definition: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="recognised">Recognised Revenue</option>
                <option value="invoiced">Invoiced Revenue</option>
                <option value="cash_collected">Cash Collected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GST Treatment
              </label>
              <select
                value={settings.gst_treatment}
                onChange={(e) => setSettings({ ...settings, gst_treatment: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="excluded">Excluded (Net Revenue)</option>
                <option value="included">Included (Gross Receipts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Public Visibility Mode (AC-15)
              </label>
              <select
                value={settings.visibility}
                onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="public_detailed">Public Detailed (Chart + Table)</option>
                <option value="public_summary">Public Summary Only (Total Progress Only)</option>
                <option value="private">Private (Admin Eyes Only)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Public Note / Methodology
            </label>
            <textarea
              rows={2}
              value={settings.notes || ""}
              onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>
        </form>

        {/* Add/Edit Month Actual Form (5 cols) - Single Unified Date Picker */}
        <form onSubmit={handleAddMonth} className="lg:col-span-5 bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Record Monthly Actual
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Enter verified monthly figures. Overwrites if month exists.
            </p>
          </div>

          {/* 1 Single Date Field: Type or Select via Calendar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Date / Month Selection *</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                Pick today, yesterday, or any day
              </span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={newMonthStart}
                onChange={(e) => setNewMonthStart(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            {newMonthStart && (
              <span className="text-[11px] text-amber-700 dark:text-amber-400 block mt-1.5 font-semibold">
                ✓ Selected Date: {newMonthStart} (Applies to {new Date(newMonthStart).toLocaleString('default', { month: 'long', year: 'numeric' })})
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Actual (INR) *
              </label>
              <input
                type="number"
                value={newMonthActual}
                onChange={(e) => setNewMonthActual(e.target.value)}
                placeholder="e.g. 40000"
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                required
              />
              {newMonthActual && !isNaN(Number(newMonthActual)) && (
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-1 font-mono">
                  {formatINR(Number(newMonthActual), false)} ({formatINR(Number(newMonthActual), true)})
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target (INR)
              </label>
              <input
                type="number"
                value={newMonthTarget}
                onChange={(e) => setNewMonthTarget(e.target.value)}
                placeholder="e.g. 45000"
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
              {newMonthTarget && !isNaN(Number(newMonthTarget)) && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-mono">
                  {formatINR(Number(newMonthTarget), false)} ({formatINR(Number(newMonthTarget), true)})
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Operational Note
            </label>
            <input
              type="text"
              value={newMonthNote}
              onChange={(e) => setNewMonthNote(e.target.value)}
              placeholder="e.g. 3 new enterprise AI retainers added"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={savingMonth}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{savingMonth ? "Saving..." : "Save Month Actual"}</span>
          </button>
        </form>
      </div>

      {/* Historical Ledger Table */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Authoritative Historical Ledger ({months.length} Months)
          </h2>
          <a
            href="/api/revenue/export"
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-semibold border border-slate-300 dark:border-white/10 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Export Authorised CSV</span>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Month Start</th>
                <th className="py-3 px-4 font-semibold">Actual (INR)</th>
                <th className="py-3 px-4 font-semibold">Target (INR)</th>
                <th className="py-3 px-4 font-semibold">Variance</th>
                <th className="py-3 px-4 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {months.map((m) => {
                const diff = m.actual_amount - m.target_amount;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{m.month_start}</td>
                    <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">{formatINR(m.actual_amount, true)}</td>
                    <td className="py-3 px-4 font-medium">{formatINR(m.target_amount, true)}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={diff >= 0 ? "text-teal-700 dark:text-teal-400" : "text-amber-700 dark:text-amber-400"}>
                        {diff >= 0 ? "+" : ""}{formatINR(diff, true)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">{m.note || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Step Section */}
      <AdminNextSection
        nextHref="/admin/people"
        nextTitle="People & Team Profiles"
        nextDescription="Configure leadership team, partners, and public profile listings"
        prevHref="/admin/comments"
        prevTitle="Comments Queue"
      />
    </div>
  );
}
