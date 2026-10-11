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
    <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-navy-800">
        <div className="flex items-center space-x-2 text-brand-sky">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Summary & Takeaways Studio
          </h3>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded bg-navy-950 text-slate-400 border border-navy-800">
          Model: dhurandhar-synthesizer / Gemini
        </span>
      </div>

      {/* Input source checklist */}
      <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800/80 text-xs">
        <span className="font-semibold text-slate-300 block mb-2">Available Source Inputs:</span>
        <div className="flex flex-wrap gap-4 text-slate-400">
          <span className={`inline-flex items-center space-x-1.5 ${transcriptText ? "text-teal-400" : "text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${transcriptText ? "bg-teal-400" : "bg-slate-700"}`} />
            <span>Transcript ({transcriptText ? `${transcriptText.length} chars` : "None"})</span>
          </span>
          <span className={`inline-flex items-center space-x-1.5 ${captionText ? "text-teal-400" : "text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${captionText ? "bg-teal-400" : "bg-slate-700"}`} />
            <span>Caption ({captionText ? `${captionText.length} chars` : "None"})</span>
          </span>
          <span className={`inline-flex items-center space-x-1.5 ${contextNotes ? "text-teal-400" : "text-slate-600"}`}>
            <span className={`w-2 h-2 rounded-full ${contextNotes ? "bg-teal-400" : "bg-slate-700"}`} />
            <span>Context Notes ({contextNotes ? `${contextNotes.length} chars` : "None"})</span>
          </span>
        </div>
      </div>

      {/* AC-07 Regeneration Confirmation Warning */}
      {showRegenConfirm && (
        <div className="bg-amber-950/70 border border-amber-800/80 rounded-xl p-4 text-xs text-amber-200 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4" />
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
              className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error / Insufficient Input Notice (AC-06) */}
      {errorMessage && (
        <div className="bg-red-950/70 border border-red-800 rounded-xl p-4 text-xs text-red-200 flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Generation Trigger Button */}
      <div>
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-sky via-cyan-500 to-sky-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle disabled:opacity-50 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Generating Draft..." : currentSummary ? "Regenerate AI Summary" : "Generate AI Summary"}</span>
        </button>
      </div>

      {/* Generated Output Preview */}
      {aiDraft && (
        <div className="bg-navy-950 rounded-xl border border-navy-800 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <span className="font-semibold text-teal-400">
              Draft Summary Generated (Source: {aiDraft.sourceType})
            </span>
            <button
              type="button"
              onClick={handleApplyToEpisode}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to Episode Form</span>
            </button>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">Generated Summary:</span>
            <p className="text-slate-200 leading-relaxed bg-navy-900 p-3 rounded-lg border border-navy-800">
              {aiDraft.summary}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">Key Takeaways:</span>
            <ul className="space-y-1.5 bg-navy-900 p-3 rounded-lg border border-navy-800">
              {aiDraft.takeaways.map((t, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">SEO Description:</span>
            <p className="text-slate-300 italic bg-navy-900 p-2 rounded-lg border border-navy-800">
              {aiDraft.seoMetaDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
