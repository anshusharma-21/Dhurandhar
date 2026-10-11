"use client";

import React, { useState } from "react";
import { RevenueSettings, RevenueMonth } from "@/lib/types/revenue";
import { formatINR } from "@/lib/utils/formatters";
import { 
  TrendingUp, 
  Save, 
  PlusCircle, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock 
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

  // New month input state
  const [newMonthStart, setNewMonthStart] = useState("2026-10-01");
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
    if (!newMonthStart || !newMonthActual) return;

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
      setFeedback({ type: "success", text: `Monthly record for ${newMonthStart} saved.` });
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
              ? "bg-teal-950 border border-teal-800 text-teal-200"
              : "bg-red-950 border border-red-800 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Grid: Global Settings & Add Month */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form (7 cols) */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Revenue Goal Parameters
            </h2>
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSettings ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Goal Label
              </label>
              <input
                type="text"
                value={settings.goal_label}
                onChange={(e) => setSettings({ ...settings, goal_label: e.target.value })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Amount (INR)
              </label>
              <input
                type="number"
                value={settings.target_amount}
                onChange={(e) => setSettings({ ...settings, target_amount: Number(e.target.value) })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Basis
              </label>
              <select
                value={settings.target_basis}
                onChange={(e) => setSettings({ ...settings, target_basis: e.target.value as any })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="cumulative">Cumulative (Since Launch)</option>
                <option value="financial_year">Financial Year Target</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Accounting Definition
              </label>
              <select
                value={settings.revenue_definition}
                onChange={(e) => setSettings({ ...settings, revenue_definition: e.target.value as any })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="recognised">Recognised Revenue</option>
                <option value="invoiced">Invoiced Revenue</option>
                <option value="cash_collected">Cash Collected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GST Treatment
              </label>
              <select
                value={settings.gst_treatment}
                onChange={(e) => setSettings({ ...settings, gst_treatment: e.target.value as any })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="excluded">Excluded (Net Revenue)</option>
                <option value="included">Included (Gross Receipts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Public Visibility Mode (AC-15)
              </label>
              <select
                value={settings.visibility}
                onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="public_detailed">Public Detailed (Chart + Table)</option>
                <option value="public_summary">Public Summary Only (Total Progress Only)</option>
                <option value="private">Private (Admin Eyes Only)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Public Note / Methodology
            </label>
            <textarea
              rows={2}
              value={settings.notes || ""}
              onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white resize-none"
            />
          </div>
        </form>

        {/* Add/Edit Month Actual Form (5 cols) */}
        <form onSubmit={handleAddMonth} className="lg:col-span-5 bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="pb-3 border-b border-navy-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Record Monthly Actual
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter verified monthly figures. Overwrites if month exists.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Month Start (YYYY-MM-01)
            </label>
            <input
              type="date"
              value={newMonthStart}
              onChange={(e) => setNewMonthStart(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Actual (INR) *
              </label>
              <input
                type="number"
                value={newMonthActual}
                onChange={(e) => setNewMonthActual(e.target.value)}
                placeholder="e.g. 15000000"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target (INR)
              </label>
              <input
                type="number"
                value={newMonthTarget}
                onChange={(e) => setNewMonthTarget(e.target.value)}
                placeholder="e.g. 15000000"
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monthly Operational Note
            </label>
            <input
              type="text"
              value={newMonthNote}
              onChange={(e) => setNewMonthNote(e.target.value)}
              placeholder="e.g. 3 new enterprise AI retainers added"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={savingMonth}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-sky hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{savingMonth ? "Saving..." : "Save Month Actual"}</span>
          </button>
        </form>
      </div>

      {/* Historical Ledger Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Authoritative Historical Ledger ({months.length} Months)
          </h2>
          <a
            href="/api/revenue/export"
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-navy-950 hover:bg-navy-850 text-slate-300 hover:text-white rounded-lg text-xs border border-navy-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Authorised CSV</span>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Month Start</th>
                <th className="py-3 px-4 font-semibold">Actual (INR)</th>
                <th className="py-3 px-4 font-semibold">Target (INR)</th>
                <th className="py-3 px-4 font-semibold">Variance</th>
                <th className="py-3 px-4 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {months.map((m) => {
                const diff = m.actual_amount - m.target_amount;
                return (
                  <tr key={m.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{m.month_start}</td>
                    <td className="py-3 px-4 font-bold text-teal-300">{formatINR(m.actual_amount, true)}</td>
                    <td className="py-3 px-4">{formatINR(m.target_amount, true)}</td>
                    <td className="py-3 px-4">
                      <span className={diff >= 0 ? "text-teal-400" : "text-amber-400"}>
                        {diff >= 0 ? "+" : ""}{formatINR(diff, true)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{m.note || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
