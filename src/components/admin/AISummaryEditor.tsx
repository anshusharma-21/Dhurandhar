"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

interface AISummaryEditorProps {
  dayNumber: number;
  episodeTitle: string;
  transcriptText: string;
  captionText: string;
  contextNotes: string;
  currentSummary: string;
  currentTakeaways: string[];
  onApplySummary: (summary: string, takeaways: string[], metaDesc: string) => void;
}

export function AISummaryEditor({
  dayNumber,
  episodeTitle,
  transcriptText,
  captionText,
  contextNotes,
  currentSummary,
  currentTakeaways,
  onApplySummary,
}: AISummaryEditorProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasEditedCopy, setHasEditedCopy] = useState(Boolean(currentSummary));
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [aiDraft, setAiDraft] = useState<{
    summary: string;
    takeaways: string[];
    suggestedTags: string[];
    seoMetaDescription: string;
    sourceType: string;
  } | null>(null);

  const triggerAIGeneration = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayNumber,
          episodeTitle,
          transcriptText,
          captionText,
          contextNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI summary.");
      }

      setAiDraft(data);
      setShowRegenConfirm(false);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = () => {
    // AC-07: If edited copy exists, ask for confirmation first!
    if (currentSummary && currentSummary.trim().length > 0 && !showRegenConfirm) {
      setShowRegenConfirm(true);
      return;
    }
    triggerAIGeneration();
  };

  const handleApplyToEpisode = () => {
    if (aiDraft) {
      onApplySummary(aiDraft.summary, aiDraft.takeaways, aiDraft.seoMetaDescription);
      setHasEditedCopy(true);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-6 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            AI Summary & Takeaways Studio
          </h3>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-[#070b12] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
          Model: dhurandhar-synthesizer / Gemini
        </span>
      </div>

      {/* Input source checklist */}
      <div className="bg-slate-50 dark:bg-[#070b12] p-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs transition-colors">
        <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-2">Available Source Inputs:</span>
        <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400">
          <span className={`inline-flex items-center space-x-1.5 ${transcriptText ? "text-teal-700 dark:text-teal-400 font-semibold" : "text-slate-400 dark:text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${transcriptText ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            <span>Transcript ({transcriptText ? `${transcriptText.length} chars` : "None"})</span>
          </span>
          <span className={`inline-flex items-center space-x-1.5 ${captionText ? "text-teal-700 dark:text-teal-400 font-semibold" : "text-slate-400 dark:text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${captionText ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            <span>Caption ({captionText ? `${captionText.length} chars` : "None"})</span>
          </span>
          <span className={`inline-flex items-center space-x-1.5 ${contextNotes ? "text-teal-700 dark:text-teal-400 font-semibold" : "text-slate-400 dark:text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${contextNotes ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            <span>Context Notes ({contextNotes ? `${contextNotes.length} chars` : "None"})</span>
          </span>
        </div>
      </div>

      {/* AC-07 Regeneration Confirmation Warning */}
      {showRegenConfirm && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Warning: Existing edited summary exists</span>
          </div>
          <p className="leading-relaxed">
            Regenerating will replace your existing approved copy. Are you sure you wish to proceed? Your current text is preserved until you confirm.
          </p>
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={triggerAIGeneration}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Confirm & Regenerate
            </button>
            <button
              type="button"
              onClick={() => setShowRegenConfirm(false)}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error / Insufficient Input Notice (AC-06) */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-800 dark:text-red-200 flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Generation Trigger Button */}
      <div>
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-sm disabled:opacity-50 transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{loading ? "Generating Draft..." : currentSummary ? "Regenerate AI Summary" : "Generate AI Summary"}</span>
        </button>
      </div>

      {/* Generated Output Preview */}
      {aiDraft && (
        <div className="bg-slate-50 dark:bg-[#070b12] rounded-xl border border-slate-200 dark:border-white/10 p-5 space-y-4 text-xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <span className="font-semibold text-teal-700 dark:text-teal-400">
              Draft Summary Generated (Source: {aiDraft.sourceType})
            </span>
            <button
              type="button"
              onClick={handleApplyToEpisode}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to Episode Form</span>
            </button>
          </div>

          <div>
            <span className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Generated Summary:</span>
            <p className="text-slate-900 dark:text-slate-200 leading-relaxed bg-white dark:bg-[#0e131d] p-3 rounded-lg border border-slate-200 dark:border-white/10">
              {aiDraft.summary}
            </p>
          </div>

          <div>
            <span className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Key Takeaways:</span>
            <ul className="space-y-1.5 bg-white dark:bg-[#0e131d] p-3 rounded-lg border border-slate-200 dark:border-white/10">
              {aiDraft.takeaways.map((t, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-800 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">SEO Description:</span>
            <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-[#0e131d] p-2 rounded-lg border border-slate-200 dark:border-white/10">
              {aiDraft.seoMetaDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
