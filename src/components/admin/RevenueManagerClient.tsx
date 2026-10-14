"use client";

import React, { useState } from "react";
import { RevenueSettings, RevenueMonth, RevenueMilestone } from "@/lib/types/revenue";
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
  Calendar,
  Flag,
  Trash2,
  Eye,
  EyeOff,
  Edit2,
  Target,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface RevenueManagerClientProps {
  initialSettings: RevenueSettings;
  initialMonths: RevenueMonth[];
  initialMilestones?: RevenueMilestone[];
}

export function RevenueManagerClient({
  initialSettings,
  initialMonths,
  initialMilestones = [],
}: RevenueManagerClientProps) {
  const [settings, setSettings] = useState<RevenueSettings>(initialSettings);
  const [months, setMonths] = useState<RevenueMonth[]>(initialMonths);
  const [milestones, setMilestones] = useState<RevenueMilestone[]>(initialMilestones);
  const [savingSettings, setSavingSettings] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Month actions state
  const [deletingMonthId, setDeletingMonthId] = useState<string | null>(null);
  const [clearingMonths, setClearingMonths] = useState(false);
  const [editingMonthLabel, setEditingMonthLabel] = useState<string | null>(null);

  // Milestone form state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestoneOrder, setMilestoneOrder] = useState<number>(1);
  const [milestoneVisibility, setMilestoneVisibility] = useState(true);
  const [savingMilestone, setSavingMilestone] = useState(false);

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
      setEditingMonthLabel(null);
      setFeedback({ type: "success", text: `Monthly record for ${newMonthStart} saved successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSavingMonth(false);
    }
  };

  const handleEditMonth = (m: RevenueMonth) => {
    setNewMonthStart(m.month_start);
    setNewMonthActual(String(m.actual_amount));
    setNewMonthTarget(String(m.target_amount));
    setNewMonthNote(m.note || "");
    setEditingMonthLabel(m.month_start);
    const el = document.getElementById("record-monthly-actual-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteMonth = async (id: string, month_start: string) => {
    if (!confirm(`Are you sure you want to delete the record for ${month_start}?`)) return;
    setDeletingMonthId(id);
    setFeedback(null);
    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "delete_month",
          id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete month.");
      setMonths(months.filter((m) => m.id !== id));
      setFeedback({ type: "success", text: `Record for ${month_start} deleted successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setDeletingMonthId(null);
    }
  };

  const handleClearAllMonths = async () => {
    if (
      !confirm(
        "Kya aap sach me sare sample months delete karke ₹0 se shuru karna chahte hain?\n\nThis will reset your Mission Total to ₹0 on both the Admin Panel and the Homepage."
      )
    ) {
      return;
    }
    setClearingMonths(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "clear_months",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear ledger.");
      setMonths([]);
      setFeedback({
        type: "success",
        text: "All sample records cleared! Your mission ledger is now reset to ₹0.",
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setClearingMonths(false);
    }
  };

  const handleOpenAddMilestone = () => {
    setEditingMilestoneId(null);
    setMilestoneTitle("");
    setMilestoneDesc("");
    setMilestoneDate(new Date().toISOString().split("T")[0]);
    setMilestoneOrder(milestones.length + 1);
    setMilestoneVisibility(true);
    setShowMilestoneModal(true);
  };

  const handleOpenEditMilestone = (m: RevenueMilestone) => {
    setEditingMilestoneId(m.id);
    setMilestoneTitle(m.title);
    setMilestoneDesc(m.description || "");
    setMilestoneDate(m.milestone_date);
    setMilestoneOrder(m.sort_order);
    setMilestoneVisibility(m.visibility);
    setShowMilestoneModal(true);
  };

  const handleSaveMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) {
      setFeedback({ type: "error", text: "Milestone title is required." });
      return;
    }
    setSavingMilestone(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "milestone",
          milestone: {
            id: editingMilestoneId || undefined,
            title: milestoneTitle.trim(),
            description: milestoneDesc.trim(),
            milestone_date: milestoneDate,
            sort_order: Number(milestoneOrder) || 1,
            visibility: milestoneVisibility,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save milestone.");

      const updated = editingMilestoneId
        ? milestones.map((m) => (m.id === data.id ? data : m))
        : [...milestones, data];
      setMilestones(updated.sort((a, b) => a.sort_order - b.sort_order));

      setShowMilestoneModal(false);
      setFeedback({ type: "success", text: `Milestone "${data.title}" saved successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSavingMilestone(false);
    }
  };

  const handleDeleteMilestoneClick = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete milestone "${title}"?`)) return;

    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete_milestone", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete milestone.");

      setMilestones(milestones.filter((m) => m.id !== id));
      setFeedback({ type: "success", text: `Milestone "${title}" deleted successfully.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const handleToggleMilestoneVisibility = async (m: RevenueMilestone) => {
    try {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "milestone",
          milestone: {
            id: m.id,
            title: m.title,
            description: m.description,
            milestone_date: m.milestone_date,
            sort_order: m.sort_order,
            visibility: !m.visibility,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update milestone visibility.");

      setMilestones(milestones.map((item) => (item.id === data.id ? data : item)));
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    }
  };

  const totalAchieved = months.reduce((acc, m) => acc + (Number(m.actual_amount) || 0), 0);
  const targetTotal = Number(settings.target_amount) || 300000000;
  const progressPct = targetTotal > 0 ? ((totalAchieved / targetTotal) * 100).toFixed(1) : "0";
  const remainingGap = Math.max(0, targetTotal - totalAchieved);

  return (
    <div className="space-y-8">
      {/* Live Financial Status Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/[0.04] to-transparent border border-amber-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Homepage Financial Status</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Current Mission Total: {formatINR(totalAchieved, true)} Achieved
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {progressPct}% of {formatINR(targetTotal, true)} Completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Mission Target</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{formatINR(targetTotal, true)}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{formatINR(targetTotal, false)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Revenue Achieved</span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">{formatINR(totalAchieved, true)}</span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block font-mono">{formatINR(totalAchieved, false)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Remaining Gap</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{formatINR(remainingGap, true)}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{formatINR(remainingGap, false)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Ledger Data Count</span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{months.length} Months</span>
            <span className="text-[10px] text-slate-500 block">{months.length === 0 ? "Empty Ledger (₹0)" : "Active records"}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 gap-2">
          <span>
            💡 <strong>Ye {formatINR(totalAchieved, true)} kahan se aaya?</strong> Homepage par jo Achieved Revenue dikhta hai, wo neeche diye gaye <strong>Historical Ledger</strong> ke sabhi {months.length} mahino ka jod (total sum) hai.
          </span>
          {months.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllMonths}
              disabled={clearingMonths}
              className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400 hover:underline font-bold shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to ₹0 (Clear Demo Months)</span>
            </button>
          )}
        </div>
      </div>

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
        <form id="record-monthly-actual-card" onSubmit={handleAddMonth} className="lg:col-span-5 bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Record Monthly Actual
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Enter verified monthly figures. Overwrites if month exists.
              </p>
            </div>
            {editingMonthLabel && (
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-[10px] font-bold border border-amber-500/30 flex items-center space-x-1">
                <Edit2 className="w-3 h-3" />
                <span>Editing {editingMonthLabel}</span>
              </span>
            )}
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

          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={savingMonth}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>{savingMonth ? "Saving..." : editingMonthLabel ? "Update Month Record" : "Save Month Actual"}</span>
            </button>
            {editingMonthLabel && (
              <button
                type="button"
                onClick={() => {
                  setEditingMonthLabel(null);
                  setNewMonthActual("");
                  setNewMonthNote("");
                }}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Historical Ledger Table */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Authoritative Historical Ledger ({months.length} Months)
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Cumulative Total: <strong className="text-teal-700 dark:text-teal-400 font-bold">{formatINR(totalAchieved, true)}</strong> ({formatINR(totalAchieved, false)})
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {months.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllMonths}
                disabled={clearingMonths}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearingMonths ? "Clearing..." : "Reset to ₹0 (Clear Demo Months)"}</span>
              </button>
            )}
            <a
              href="/api/revenue/export"
              download
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-semibold border border-slate-300 dark:border-white/10 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Export Authorised CSV</span>
            </a>
          </div>
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
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {months.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No months recorded yet. Total revenue is ₹0. Use the form above to add your first month!
                  </td>
                </tr>
              ) : (
                months.map((m) => {
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
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5 justify-end">
                          <button
                            type="button"
                            title="Edit this month"
                            onClick={() => handleEditMonth(m)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Delete this month"
                            onClick={() => handleDeleteMonth(m.id, m.month_start)}
                            disabled={deletingMonthId === m.id}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Roadmap Milestones Manager Card */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <Flag className="w-4 h-4 text-amber-500" />
              <span>Strategic Roadmap Milestones</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage timeline milestones shown on the homepage and revenue dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddMilestone}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Milestone</span>
          </button>
        </div>

        {milestones.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No milestones configured yet. Click above to add your first milestone.
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 hover:border-amber-400/40 transition-all gap-3"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                    #{m.sort_order}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {m.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        ({m.milestone_date})
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.visibility
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {m.visibility ? "Public" : "Hidden"}
                      </span>
                    </div>
                    {m.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleMilestoneVisibility(m)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={m.visibility ? "Hide from public view" : "Make visible publicly"}
                  >
                    {m.visibility ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditMilestone(m)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Edit milestone"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestoneClick(m.id, m.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Milestone Modal Dialog */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-white/10 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>{editingMilestoneId ? "Edit Milestone" : "Add New Milestone"}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMilestoneModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestoneSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. ₹10 Crore Run-rate Crossed"
                  required
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Description / Milestone Detail
                </label>
                <textarea
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  placeholder="e.g. Achieved during Q2 close with 98% gross retention."
                  rows={3}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Target / Reached Date
                  </label>
                  <input
                    type="date"
                    value={milestoneDate}
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    required
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Sort Order (Sequence)
                  </label>
                  <input
                    type="number"
                    value={milestoneOrder}
                    onChange={(e) => setMilestoneOrder(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mVisibility"
                  checked={milestoneVisibility}
                  onChange={(e) => setMilestoneVisibility(e.target.checked)}
                  className="rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="mVisibility" className="text-slate-300 font-medium cursor-pointer">
                  Visible to public on homepage roadmap
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMilestone}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  {savingMilestone ? "Saving..." : "Save Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
