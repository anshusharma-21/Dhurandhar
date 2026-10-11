import React from "react";
import { Settings, Save, Globe, Bot, Mail, ShieldAlert } from "lucide-react";

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Site Settings & Provider Integrations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global environment, AI models, timezone offsets, and public contact emails.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Settings saved.")}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save System Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Localization & Canonical Host */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Globe className="w-4 h-4 text-brand-sky" />
            <span>Site Metadata & Timezone</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Canonical Hostname
            </label>
            <input
              type="text"
              readOnly
              value="https://projectdhurandhar.automationlabs.online"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Timezone
            </label>
            <input
              type="text"
              defaultValue="Asia/Kolkata"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Default timezone for all episode publication dates and timestamps.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              defaultValue="contact@automationlabs.online"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* AI & Email Integrations */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Bot className="w-4 h-4 text-brand-gold" />
            <span>AI & Transactional Providers</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              AI Provider
            </label>
            <select
              defaultValue="gemini"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="gemini">Google Gemini (Recommended)</option>
              <option value="openai">OpenAI (GPT-4o Mini)</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="mock">Local Deterministic Synthesizer (Zero API Cost)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Provider
            </label>
            <select
              defaultValue="resend"
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="resend">Resend Transactional Email</option>
              <option value="smtp">Custom SMTP Server</option>
              <option value="mock">Local Development Mock</option>
            </select>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Real API keys are strictly loaded via server-side environment variables and never rendered on this client form (AC-26).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
