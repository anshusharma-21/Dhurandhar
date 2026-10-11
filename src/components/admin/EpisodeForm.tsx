"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Episode, Tag, EpisodeStatus } from "@/lib/types/episode";
import { AISummaryEditor } from "./AISummaryEditor";
import { InstagramEmbed } from "../episode/InstagramEmbed";
import { validateAndCleanInstagramUrl } from "@/lib/utils/instagram";
import { BackButton } from "@/components/navigation/BackButton";
import { 
  Tv, 
  Save, 
  Send, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Eye, 
  Calendar 
} from "lucide-react";

interface EpisodeFormProps {
  initialEpisode?: Episode;
  availableTags: Tag[];
}

export function EpisodeForm({ initialEpisode, availableTags }: EpisodeFormProps) {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState<number>(initialEpisode?.day_number || 1);
  const [title, setTitle] = useState<string>(initialEpisode?.title || "");
  const [slug, setSlug] = useState<string>(initialEpisode?.slug || "");
  const [instagramUrl, setInstagramUrl] = useState<string>(initialEpisode?.instagram_url || "");
  const [caption, setCaption] = useState<string>(initialEpisode?.caption || "");
  const [contextNotes, setContextNotes] = useState<string>(initialEpisode?.context_notes || "");
  const [transcriptText, setTranscriptText] = useState<string>(initialEpisode?.transcript_text || "");
  const [summary, setSummary] = useState<string>(initialEpisode?.summary || "");
  const [takeaways, setTakeaways] = useState<string[]>(initialEpisode?.takeaways || []);
  const [takeawayInput, setTakeawayInput] = useState<string>("");
  const [status, setStatus] = useState<EpisodeStatus>(initialEpisode?.status || "draft");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialEpisode?.tags?.map((t) => t.id) || []
  );

  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; message?: string }>({
    isValid: true,
  });
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Validate Instagram URL on change
  const handleUrlChange = (val: string) => {
    setInstagramUrl(val);
    if (!val) {
      setUrlValidation({ isValid: true });
      return;
    }
    const res = validateAndCleanInstagramUrl(val);
    if (res.isValid) {
      setUrlValidation({ isValid: true });
    } else {
      setUrlValidation({ isValid: false, message: res.errorMessage });
    }
  };

  const handleApplyAISummary = (genSummary: string, genTakeaways: string[]) => {
    setSummary(genSummary);
    setTakeaways(genTakeaways);
    setFeedback({ type: "success", text: "AI Summary & takeaways applied to form." });
  };

  const handleAddTakeaway = () => {
    if (!takeawayInput.trim()) return;
    setTakeaways([...takeaways, takeawayInput.trim()]);
    setTakeawayInput("");
  };

  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSave = async (targetStatus: EpisodeStatus) => {
    if (!dayNumber || isNaN(dayNumber) || dayNumber <= 0) {
      setFeedback({ type: "error", text: "A valid positive Day Number is required." });
      return;
    }

    if (!title.trim()) {
      setFeedback({ type: "error", text: "Episode title is required." });
      return;
    }

    if (instagramUrl) {
      const v = validateAndCleanInstagramUrl(instagramUrl);
      if (!v.isValid) {
        setFeedback({ type: "error", text: v.errorMessage || "Invalid Instagram URL." });
        return;
      }
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      day_number: Number(dayNumber),
      title: title.trim(),
      slug: slug.trim() || undefined,
      instagram_url: instagramUrl.trim(),
      caption: caption.trim(),
      context_notes: contextNotes.trim(),
      transcript_text: transcriptText.trim(),
      summary: summary.trim(),
      takeaways,
      status: targetStatus,
      tags: availableTags.filter((t) => selectedTagIds.includes(t.id)),
    };

    try {
      const endpoint = initialEpisode
        ? `/api/episodes/${initialEpisode.id}`
        : "/api/episodes";
      const method = initialEpisode ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save episode.");
      }

      setFeedback({
        type: "success",
        text: `Episode Day ${dayNumber} successfully saved as ${targetStatus.toUpperCase()}.`,
      });

      if (!initialEpisode) {
        setTimeout(() => router.push(`/admin/episodes`), 1200);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const slugPath = `/episodes/${initialEpisode?.slug || `day-${String(dayNumber).padStart(3, "0")}`}`;
  const permalinkUrl = origin ? `${origin}${slugPath}` : slugPath;

  const copyPermalink = () => {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${slugPath}` : permalinkUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <BackButton fallbackUrl="/admin/episodes" label="← Back to Admin Episodes" />
            <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
              {initialEpisode ? "EDIT EPISODE" : "NEW DAILY VLOG"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Day {dayNumber}: {title || "Untitled Episode"}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-slate-200 border border-navy-700 rounded-xl text-xs font-semibold"
          >
            <Eye className="w-4 h-4 text-brand-sky" />
            <span>{previewMode ? "Edit Form" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600 rounded-xl text-xs font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

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

      {/* Permanent URL Indicator */}
      {initialEpisode && (
        <div className="bg-navy-950 border border-navy-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-400 truncate mr-2">
            <span className="font-semibold text-slate-300">Public URL:</span>
            <span className="text-brand-sky truncate" suppressHydrationWarning>{permalinkUrl}</span>
          </div>
          <button
            type="button"
            onClick={copyPermalink}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-navy-900 hover:bg-navy-800 text-slate-300 rounded border border-navy-700 text-[11px] shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Copied!" : "Copy URL"}</span>
          </button>
        </div>
      )}

      {/* Mode 1: Live Preview */}
      {previewMode ? (
        <div className="bg-navy-950 border border-navy-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-xs text-brand-gold uppercase tracking-wider font-bold">
            Live Preview (Day {dayNumber})
          </div>
          <h2 className="text-3xl font-extrabold text-white">{title || "Untitled Episode"}</h2>
          {instagramUrl && (
            <InstagramEmbed url={instagramUrl} dayNumber={dayNumber} title={title} />
          )}
          <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="font-bold text-teal-400 block mb-2 uppercase tracking-wider text-xs">Summary</span>
            {summary || "No summary provided yet."}
          </div>
          {takeaways.length > 0 && (
            <div className="bg-navy-900 p-6 rounded-2xl border border-navy-800 text-xs">
              <span className="font-bold text-white block mb-2 uppercase tracking-wider">Key Takeaways</span>
              <ul className="space-y-2">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Full Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Day Number and Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Day Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(parseInt(e.target.value, 10))}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-sm text-white font-bold focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Episode Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Building the Core Delivery Engine"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-sm text-white focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
                  required
                />
              </div>
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instagram Reel / Post URL *
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.instagram.com/reel/C7z2bcdeFGH/"
                className={`w-full bg-navy-950 border rounded-xl p-3 text-sm text-white focus:outline-none ${
                  urlValidation.isValid
                    ? "border-navy-700 focus:border-brand-sky"
                    : "border-red-500 text-red-200"
                }`}
              />
              {!urlValidation.isValid && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urlValidation.message}</span>
                </p>
              )}
            </div>

            {/* Spoken Transcript / Source Material */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Transcript / Spoken Text (Required for robust AI generation)
              </label>
              <textarea
                rows={4}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste the spoken transcript or voice notes from the vlog..."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-white focus:border-brand-sky resize-none"
              />
            </div>

            {/* Caption & Admin Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Instagram Caption
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Original post caption..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-white focus:border-brand-sky resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Internal Context Notes
                </label>
                <textarea
                  rows={3}
                  value={contextNotes}
                  onChange={(e) => setContextNotes(e.target.value)}
                  placeholder="Financial context, client names, background details..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3 text-xs text-white focus:border-brand-sky resize-none"
                />
              </div>
            </div>

            {/* AI Summary Assistant Widget */}
            <AISummaryEditor
              dayNumber={dayNumber}
              episodeTitle={title}
              transcriptText={transcriptText}
              captionText={caption}
              contextNotes={contextNotes}
              currentSummary={summary}
              currentTakeaways={takeaways}
              onApplySummary={handleApplyAISummary}
            />

            {/* Human-Approved Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Episode Summary (Publicly displayed) *
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Final editorial summary reviewed and approved by human editor..."
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:border-brand-sky resize-none"
                required
              />
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Key Strategic Takeaways (3–5 bullet points)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={takeawayInput}
                  onChange={(e) => setTakeawayInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTakeaway();
                    }
                  }}
                  placeholder="Enter takeaway point and press Add..."
                  className="flex-1 bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:border-brand-sky"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {takeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-navy-950 p-2.5 rounded-lg border border-navy-800 text-xs text-slate-300"
                  >
                    <span>{takeaway}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="text-red-400 hover:text-red-300 text-xs ml-2 font-bold"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Settings */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 space-y-4 shadow-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Publication State
              </h3>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EpisodeStatus)}
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:border-brand-sky"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-xs text-white focus:border-brand-sky"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Preserved across title edits unless edited here.
                </span>
              </div>
            </div>

            {/* Tags / Taxonomy Multi-select */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 space-y-3 shadow-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Topic Taxonomy
              </h3>
              <p className="text-[11px] text-slate-400">
                Select relevant topics for archive filtering:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableTags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                        selected
                          ? "bg-brand-sky/20 border-brand-sky text-brand-sky font-semibold"
                          : "bg-navy-950 border-navy-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      #{tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
