import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { formatINR, formatDate } from "@/lib/utils/formatters";
import { AdminNextSection } from "@/components/admin/AdminNextSection";
import { 
  Tv, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2, 
  Clock
} from "lucide-react";

export const revalidate = 0; // Dynamic admin data

export default async function AdminDashboardPage() {
  const episodes = await dbRepository.getAllEpisodesAdmin();
  const publishedEpisodes = episodes.filter((e) => e.status === "published");
  const draftEpisodes = episodes.filter((e) => e.status === "draft" || e.status === "pending_review");
  const latestPublishedDay = publishedEpisodes.length > 0 ? publishedEpisodes[0].day_number : 0;

  const moderationQueue = await dbRepository.getModerationQueue();
  const pendingComments = moderationQueue.filter((c) => c.status === "pending");

  const revenueSettings = await dbRepository.getRevenueSettings();
  const revenueMonths = await dbRepository.getRevenueMonths(true);
  const revenueMetrics = calculateRevenueMetrics(revenueSettings, revenueMonths);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            EXECUTIVE CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Project Dhurandhar Overview
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time status of daily vlog publishing, AI synthesis jobs, community comments, and revenue progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/episodes/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Create Day {latestPublishedDay + 1} Vlog</span>
          </a>
        </div>
      </div>

      {/* 4 Core Quick Tiles with Interactive Hover Effect */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Latest Day */}
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-5 shadow-sm dark:shadow-card hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_35px_-8px_rgba(245,158,11,0.22)] transition-all duration-300 ease-out cursor-default">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 uppercase tracking-wider transition-colors">
              Latest Published
            </span>
            <Tv className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Day {latestPublishedDay}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
            {publishedEpisodes.length} total live episodes
          </span>
        </div>

        {/* Drafts in Progress */}
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-slate-200/90 dark:border-white/10 hover:border-sky-500/60 rounded-2xl p-5 shadow-sm dark:shadow-card hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_35px_-8px_rgba(56,189,248,0.22)] transition-all duration-300 ease-out cursor-default">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 uppercase tracking-wider transition-colors">
              Drafts / In Review
            </span>
            <Clock className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-400">
            {draftEpisodes.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Awaiting final approval
          </span>
        </div>

        {/* Pending Comments Queue */}
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-amber-500/30 dark:border-amber-800/40 hover:border-amber-500/70 rounded-2xl p-5 shadow-sm dark:shadow-card hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_35px_-8px_rgba(245,158,11,0.22)] transition-all duration-300 ease-out cursor-default">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pending Moderation
            </span>
            <MessageSquare className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300">
            {pendingComments.length}
          </div>
          <span className="text-[11px] text-amber-600/90 dark:text-amber-400/80 mt-1 block font-mono">
            First-time comments to review
          </span>
        </div>

        {/* Current Revenue */}
        <div className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-teal-500/30 dark:border-teal-800/40 hover:border-teal-500/70 rounded-2xl p-5 shadow-sm dark:shadow-card hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_35px_-8px_rgba(20,184,166,0.22)] transition-all duration-300 ease-out cursor-default">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              Revenue Achieved
            </span>
            <TrendingUp className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300">
            {formatINR(revenueMetrics.totalActual, true)}
          </div>
          <span className="text-[11px] text-teal-600/90 dark:text-teal-400/80 mt-1 block font-mono">
            {revenueMetrics.percentage}% of ₹30Cr Target
          </span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Episodes Manager */}
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Tv className="w-4 h-4 text-amber-500" />
              <span>Recent Episodes</span>
            </h2>
            <a href="/admin/episodes" className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline">
              View all ({episodes.length})
            </a>
          </div>

          <div className="space-y-3">
            {episodes.slice(0, 5).map((ep) => (
              <div
                key={ep.id}
                className="bg-slate-50 dark:bg-[#070b12] p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-black text-amber-700 dark:text-amber-400">Day {ep.day_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.status === "published"
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                    }`}>
                      {ep.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{ep.title}</span>
                </div>

                <a
                  href={`/admin/episodes/${ep.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 rounded-lg font-bold border border-slate-300 dark:border-white/10 shrink-0 transition-colors"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Moderation Quick Actions */}
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Moderation Action Queue</span>
            </h2>
            <a href="/admin/comments" className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline">
              Open Queue ({pendingComments.length})
            </a>
          </div>

          {pendingComments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-teal-500/70 mx-auto mb-2" />
              <span>All comments are moderated. Zero pending items in queue.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingComments.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-slate-50 dark:bg-[#070b12] p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5 text-xs space-y-2 transition-colors">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">{c.author?.display_name}</span>
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2 italic">"{c.body}"</p>
                  <div className="flex justify-end space-x-2 pt-1">
                    <a
                      href="/admin/comments"
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px] transition-colors"
                    >
                      Review & Approve
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next Step Section */}
      <AdminNextSection
        nextHref="/admin/episodes"
        nextTitle="Daily Episodes Archive"
        nextDescription="Create new episodes, update video links, and review community logs"
      />
    </div>
  );
}
