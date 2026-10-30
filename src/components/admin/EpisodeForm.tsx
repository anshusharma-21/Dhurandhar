"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Episode, Tag, EpisodeStatus, AISummaryStatus } from "@/lib/types/episode";
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
  Calendar,
  Sparkles,
  Upload,
  Loader2,
  Wand2,
  FileAudio
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
  const [summaryStatus, setSummaryStatus] = useState<AISummaryStatus>(initialEpisode?.summary_status || "not_generated");
  const [summarySource, setSummarySource] = useState<string>(initialEpisode?.summary_source || "none");
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

  // AI Auto-Fill states
  const [autoFilling, setAutoFilling] = useState<boolean>(false);
  const [autoFillStage, setAutoFillStage] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  const handleAutoGenerate = async (mode: "link" | "file" | "text", fileToUpload?: File) => {
    if (mode === "link" && !instagramUrl.trim()) {
      setFeedback({ type: "error", text: "Please enter a valid Instagram Reel URL first." });
      return;
    }

    const file = fileToUpload;
    if (mode === "file" && !file) {
      fileInputRef.current?.click();
      return;
    }

    setAutoFilling(true);
    setAutoFillStage(
      file
        ? `Listening to "${file.name}" & extracting spoken dialogue with Gemini AI...`
        : mode === "link"
        ? "Extracting Reel data & generating complete episode details with Gemini AI..."
        : "Analyzing provided text & synthesizing episode content with Gemini AI..."
    );
    setFeedback(null);

    try {
      let res: Response;
      if (file) {
        const formData = new FormData();
        formData.append("mediaFile", file);
        formData.append("dayNumber", String(dayNumber));
        if (title) formData.append("episodeTitle", title);
        if (instagramUrl) formData.append("instagramUrl", instagramUrl.trim());
        if (caption) formData.append("captionText", caption);
        if (transcriptText) formData.append("transcriptText", transcriptText);
        if (contextNotes) formData.append("contextNotes", contextNotes);
        formData.append("availableTags", JSON.stringify(availableTags));

        res = await fetch("/api/ai/auto-fill", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai/auto-fill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayNumber,
            episodeTitle: title || undefined,
            instagramUrl: mode === "link" ? instagramUrl.trim() : undefined,
            captionText: caption || undefined,
            transcriptText: transcriptText || undefined,
            contextNotes: contextNotes || undefined,
            availableTags,
          }),
        });
      }

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          responseText.length > 0 && responseText.length < 200
            ? responseText
            : "Server request timed out or returned an invalid response. Please try again."
        );
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to auto-generate episode content.");
      }

      // Auto-populate all form fields
      if (data.title) {
        setTitle(data.title);
      }
      if (data.transcript) {
        setTranscriptText(data.transcript);
      }
      if (data.caption) {
        setCaption(data.caption);
      }
      if (data.summary) {
        setSummary(data.summary);
        setSummaryStatus("approved");
        setSummarySource(data.sourceType || "transcription");
      }
      if (Array.isArray(data.takeaways) && data.takeaways.length > 0) {
        setTakeaways(data.takeaways);
      }
      if (Array.isArray(data.suggestedTagIds) && data.suggestedTagIds.length > 0) {
        setSelectedTagIds(data.suggestedTagIds);
      }

      setFeedback({
        type: "success",
        text: `✨ Successfully generated Title, Transcript, Caption, Summary, Key Takeaways & Topic Tags (via ${data.model})! Review any fields below before publishing.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to generate content. You can upload the Reel audio/video file directly below as a backup.",
      });
    } finally {
      setAutoFilling(false);
      setAutoFillStage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyAISummary = (genSummary: string, genTakeaways: string[]) => {
    setSummary(genSummary);
    setTakeaways(genTakeaways);
    setSummaryStatus("approved");
    setSummarySource("transcription");
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

  const isEditMode = Boolean(initialEpisode && initialEpisode.id);

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

    const finalSummaryStatus: AISummaryStatus =
      summary.trim().length >= 25
        ? (summaryStatus === "not_generated" ? "approved" : summaryStatus)
        : "not_generated";

    const finalSummarySource =
      summarySource !== "none"
        ? summarySource
        : (summary.trim().length >= 25 ? "transcription" : "none");

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
      summary_status: finalSummaryStatus,
      summary_source: finalSummarySource,
      tags: availableTags.filter((t) => selectedTagIds.includes(t.id)),
    };

    try {
      const endpoint = isEditMode
        ? `/api/episodes/${initialEpisode!.id}`
        : "/api/episodes";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      const responseText = await res.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { error: responseText };
        }
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to save episode (Status: ${res.status}).`);
      }

      setFeedback({
        type: "success",
        text: `Episode Day ${dayNumber} successfully saved as ${targetStatus.toUpperCase()}.`,
      });

      if (!isEditMode) {
        setTimeout(() => router.push(`/admin/episodes`), 1200);
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const slugPath = `/episodes/${isEditMode && initialEpisode?.slug ? initialEpisode.slug : `day-${String(dayNumber).padStart(3, "0")}`}`;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-xs uppercase font-black text-amber-700 dark:text-amber-400 tracking-wider">
              {isEditMode ? "EDIT EPISODE" : "NEW DAILY VLOG"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Day {dayNumber}: {title || "Untitled Episode"}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-bold transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>{previewMode ? "Edit Form" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 rounded-xl text-xs font-bold transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="inline-flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
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
      {isEditMode && (
        <div className="bg-slate-100 dark:bg-[#0e131d] border border-slate-200 dark:border-white/10 rounded-xl p-3.5 flex items-center justify-between text-xs transition-colors">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 truncate mr-2">
            <span className="font-semibold text-slate-900 dark:text-slate-200">Public URL:</span>
            <span className="text-amber-600 dark:text-amber-400 truncate" suppressHydrationWarning>{permalinkUrl}</span>
          </div>
          <button
            type="button"
            onClick={copyPermalink}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-white/10 text-[11px] shrink-0 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Copied!" : "Copy URL"}</span>
          </button>
        </div>
      )}

      {/* Mode 1: Live Preview */}
      {previewMode ? (
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-card transition-colors">
          <div className="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider font-bold">
            Live Preview (Day {dayNumber})
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{title || "Untitled Episode"}</h2>
          {instagramUrl && (
            <InstagramEmbed url={instagramUrl} dayNumber={dayNumber} title={title} />
          )}
          <div className="bg-slate-50 dark:bg-[#070b12] p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed transition-colors">
            <span className="font-bold text-teal-600 dark:text-teal-400 block mb-2 uppercase tracking-wider text-xs">Summary</span>
            {summary || "No summary provided yet."}
          </div>
          {takeaways.length > 0 && (
            <div className="bg-slate-50 dark:bg-[#070b12] p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-xs transition-colors">
              <span className="font-bold text-slate-900 dark:text-white block mb-2 uppercase tracking-wider">Key Takeaways</span>
              <ul className="space-y-2">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Day Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Episode Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Building the Core Delivery Engine"
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Instagram Reel / Post URL *
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.instagram.com/reel/C7z2bcdeFGH/"
                className={`w-full bg-slate-50 dark:bg-[#070b12] border rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors ${
                  urlValidation.isValid
                    ? "border-slate-300 dark:border-white/10 focus:border-amber-500"
                    : "border-red-500 text-red-600 dark:text-red-300"
                }`}
              />
              {!urlValidation.isValid && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urlValidation.message}</span>
                </p>
              )}
            </div>

            {/* ⚡ Sleek AI Auto-Fill Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-500/5 via-slate-50 to-transparent dark:from-amber-500/10 dark:via-[#0e131d] dark:to-transparent border-l-2 border-l-amber-500 pl-3.5 rounded-r-xl">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/*,audio/mp3,audio/wav,audio/m4a,audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAutoGenerate("file", file);
                  }
                }}
              />

              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  1-Click AI Auto-Fill
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={autoFilling || !instagramUrl || !urlValidation.isValid}
                  onClick={() => handleAutoGenerate("link")}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  title={!instagramUrl ? "Paste an Instagram Reel URL first" : "Fetch and auto-fill from Reel URL"}
                >
                  {autoFilling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>{autoFilling ? "Processing..." : "Auto-Fill From Link"}</span>
                </button>

                <button
                  type="button"
                  disabled={autoFilling}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Upload Reel directly"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-500" />
                  <span>Upload Reel</span>
                </button>
              </div>
            </div>

            {/* Spoken Transcript / Source Material */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Transcript / Spoken Text (Required for robust AI generation)
              </label>
              <textarea
                rows={4}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste the spoken transcript or voice notes from the vlog..."
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none transition-colors"
              />
            </div>

            {/* Caption & Admin Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Instagram Caption
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Original post caption..."
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Internal Context Notes
                </label>
                <textarea
                  rows={3}
                  value={contextNotes}
                  onChange={(e) => setContextNotes(e.target.value)}
                  placeholder="Financial context, client names, background details..."
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none transition-colors"
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Episode Summary (Publicly displayed) *
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Final editorial summary reviewed and approved by human editor..."
                className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none transition-colors"
                required
              />
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  className="flex-1 bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {takeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 dark:bg-[#070b12] p-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-300 transition-colors"
                  >
                    <span>{takeaway}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs ml-2 font-bold"
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
            <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-card transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Publication State
              </h3>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EpisodeStatus)}
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Preserved across title edits unless edited here.
                </span>
              </div>
            </div>

            {/* Tags / Taxonomy Multi-select */}
            <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 space-y-3 shadow-sm dark:shadow-card transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Topic Taxonomy
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
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
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-[#070b12] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
