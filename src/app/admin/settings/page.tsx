import React from "react";
import { Save, Globe, Bot, ShieldAlert } from "lucide-react";
import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Site Settings & Provider Integrations
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Global environment, AI models, timezone offsets, and public contact emails.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Settings saved.")}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <Save className="w-3.5 h-3.5 text-slate-950" />
          <span>Save System Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Localization & Canonical Host */}
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Site Metadata & Timezone</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Canonical Hostname
            </label>
            <input
              type="text"
              readOnly
              value="https://projectdhurandhar.automationlabs.online"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Timezone
            </label>
            <input
              type="text"
              defaultValue="Asia/Kolkata"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Default timezone for all episode publication dates and timestamps.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              defaultValue="contact@automationlabs.online"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* AI & Email Integrations */}
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
            <Bot className="w-4 h-4 text-amber-500" />
            <span>AI & Transactional Providers</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              AI Provider
            </label>
            <select
              defaultValue="gemini"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="gemini">Google Gemini (Recommended)</option>
              <option value="openai">OpenAI (GPT-4o Mini)</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="mock">Local Deterministic Synthesizer (Zero API Cost)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Provider
            </label>
            <select
              defaultValue="resend"
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="resend">Resend Transactional Email</option>
              <option value="smtp">Custom SMTP Server</option>
              <option value="mock">Local Development Mock</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#070b12] rounded-xl border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 flex items-start space-x-2 transition-colors">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Real API keys are strictly loaded via server-side environment variables and never rendered on this client form (AC-26).
            </span>
          </div>
        </div>
      </div>

      <AdminNextSection
        nextHref="/admin/audit-logs"
        nextTitle="Audit Logs"
        prevHref="/admin/members"
        prevTitle="Members Directory"
      />
    </div>
  );
}
