import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { formatINR, formatDate } from "@/lib/utils/formatters";
import { 
  Tv, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            EXECUTIVE CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Project Dhurandhar Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of daily vlog publishing, AI synthesis jobs, community comments, and revenue progress.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/admin/episodes/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Create Day {latestPublishedDay + 1} Vlog</span>
          </a>
        </div>
      </div>

      {/* 4 Core Quick Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Latest Day */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Latest Published
            </span>
            <Tv className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            Day {latestPublishedDay}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {publishedEpisodes.length} total live episodes
          </span>
        </div>

        {/* Drafts in Progress */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Drafts / In Review
            </span>
            <Clock className="w-4 h-4 text-brand-sky" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">
            {draftEpisodes.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Awaiting final approval
          </span>
        </div>

        {/* Pending Comments Queue */}
        <div className="bg-navy-900 border border-amber-900/40 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Pending Moderation
            </span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
            {pendingComments.length}
          </div>
          <span className="text-[11px] text-amber-500/80 mt-1 block">
            First-time comments to review
          </span>
        </div>

        {/* Current Revenue */}
        <div className="bg-navy-900 border border-teal-900/40 rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Revenue Achieved
            </span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
            {formatINR(revenueMetrics.totalActual, true)}
          </div>
          <span className="text-[11px] text-teal-500/80 mt-1 block">
            {revenueMetrics.percentage}% of ₹30Cr Target
          </span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Episodes Manager */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Tv className="w-4 h-4 text-brand-sky" />
              <span>Recent Episodes</span>
            </h2>
            <a href="/admin/episodes" className="text-xs text-brand-sky hover:underline">
              View all ({episodes.length})
            </a>
          </div>

          <div className="space-y-3">
            {episodes.slice(0, 5).map((ep) => (
              <div
                key={ep.id}
                className="bg-navy-950 p-3.5 rounded-xl border border-navy-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-brand-gold">Day {ep.day_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.status === "published"
                        ? "bg-teal-950 text-teal-400 border border-teal-800/40"
                        : "bg-amber-950 text-amber-400 border border-amber-800/40"
                    }`}>
                      {ep.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium line-clamp-1">{ep.title}</span>
                </div>

                <a
                  href={`/admin/episodes/${ep.id}`}
                  className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-lg font-semibold shrink-0"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Moderation Quick Actions */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Moderation Action Queue</span>
            </h2>
            <a href="/admin/comments" className="text-xs text-brand-sky hover:underline">
              Open Queue ({pendingComments.length})
            </a>
          </div>

          {pendingComments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-teal-500/40 mx-auto mb-2" />
              <span>All comments are moderated. Zero pending items in queue.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingComments.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-navy-950 p-3.5 rounded-xl border border-navy-800 text-xs space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-bold text-white">{c.author?.display_name}</span>
                    <span>{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-slate-300 line-clamp-2 italic">"{c.body}"</p>
                  <div className="flex justify-end space-x-2 pt-1">
                    <a
                      href="/admin/comments"
                      className="px-3 py-1 bg-brand-sky text-slate-950 font-bold rounded text-[11px]"
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
    </div>
  );
}
