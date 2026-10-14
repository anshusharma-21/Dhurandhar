"use client";

import React, { useState } from "react";
import { Save, Globe, Bot, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { SiteSettings } from "@/lib/types/settings";

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save system settings.");
      }

      setSettings(data.settings);
      setFeedback({ type: "success", text: "System settings saved successfully to Supabase." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 transition-all ${
            feedback.type === "success"
              ? "bg-teal-950/70 border border-teal-800 text-teal-200"
              : "bg-red-950/70 border border-red-800 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-950" />
              <span>Save System Settings</span>
            </>
          )}
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
              value={settings.canonical_hostname}
              onChange={(e) => setSettings({ ...settings, canonical_hostname: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Timezone
            </label>
            <input
              type="text"
              value={settings.display_timezone}
              onChange={(e) => setSettings({ ...settings, display_timezone: e.target.value })}
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
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
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
              value={settings.ai_provider}
              onChange={(e) => setSettings({ ...settings, ai_provider: e.target.value as any })}
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
              value={settings.email_provider}
              onChange={(e) => setSettings({ ...settings, email_provider: e.target.value as any })}
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
    </form>
  );
}
