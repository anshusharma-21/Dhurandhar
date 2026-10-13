"use client";

import React, { useState, useTransition } from "react";
import { Episode, Tag } from "@/lib/types/episode";
import { EpisodeCard } from "./EpisodeCard";
import { Search, Filter, X, Tv, Calendar } from "lucide-react";

interface EpisodeArchiveClientProps {
  initialEpisodes: Episode[];
  availableTags: Tag[];
}

export function EpisodeArchiveClient({
  initialEpisodes,
  availableTags,
}: EpisodeArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "day_desc">("newest");
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [isPending, startTransition] = useTransition();

  // Client-side filtering / searching (instant responsive experience satisfying AC-08)
  const filteredEpisodes = episodes.filter((ep) => {
    // Tag filter
    if (selectedTag && !ep.tags?.some((t) => t.slug === selectedTag)) {
      return false;
    }

    // Search query filter (matches Day N, title, summary, tag) (AC-08)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchDay = `day ${ep.day_number}`.toLowerCase().includes(q);
      const matchTitle = ep.title.toLowerCase().includes(q);
      const matchSummary = ep.summary.toLowerCase().includes(q);
      const matchTag = ep.tags?.some((t) => t.label.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));

      if (!matchDay && !matchTitle && !matchSummary && !matchTag) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedEpisodes = [...filteredEpisodes].sort((a, b) => {
    if (sortOrder === "newest") {
      const timeA = new Date(a.published_at || a.created_at).getTime();
      const timeB = new Date(b.published_at || b.created_at).getTime();
      return timeB !== timeA ? timeB - timeA : b.day_number - a.day_number;
    }
    if (sortOrder === "oldest") {
      const timeA = new Date(a.published_at || a.created_at).getTime();
      const timeB = new Date(b.published_at || b.created_at).getTime();
      return timeA !== timeB ? timeA - timeB : a.day_number - b.day_number;
    }
    return b.day_number - a.day_number;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSortOrder("newest");
  };

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedTag || sortOrder !== "newest");

  return (
    <div className="space-y-8">
      {/* Search Bar & Controls Header */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 border-t-2 border-t-amber-500/40 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input (AC-08) */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by "Day 2", hiring, sales, automation...'
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end text-xs">
            <span className="text-slate-600 dark:text-slate-400 shrink-0 font-medium">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="newest">Latest Published First</option>
              <option value="oldest">Earliest First</option>
              <option value="day_desc">Day Number (Descending)</option>
            </select>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">Filter by Topic:</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-amber-700 dark:text-amber-400 hover:underline text-xs font-semibold flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                selectedTag === null
                  ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm"
                  : "bg-slate-100 dark:bg-[#070b12] text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
              }`}
            >
              All Topics
            </button>
            {availableTags.map((tag) => {
              const isSelected = selectedTag === tag.slug;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTag(isSelected ? null : tag.slug)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm"
                      : "bg-slate-100 dark:bg-[#070b12] text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
                  }`}
                >
                  #{tag.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 font-medium">
        <span>
          Showing <strong>{sortedEpisodes.length}</strong> of {episodes.length} episodes
        </span>
        {selectedTag && (
          <span className="text-brand-gold font-medium">
            Filtering by #{availableTags.find((t) => t.slug === selectedTag)?.label}
          </span>
        )}
      </div>

      {sortedEpisodes.length === 0 ? (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-3">
          <Tv className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No matching episodes found.</p>
          <p className="max-w-md mx-auto text-slate-400">
            No published episodes matched your query. Try resetting filters or using a broader search term.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 px-4 py-2 bg-navy-800 text-brand-sky rounded-lg font-semibold hover:bg-navy-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEpisodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </div>
  );
}
