"use client";

import React, { useState, useTransition } from "react";
import { Episode, Tag } from "@/lib/types/episode";
import { EpisodeCard } from "./EpisodeCard";
import { Search, Filter, X, Tv, Calendar, ChevronDown } from "lucide-react";

interface EpisodeArchiveClientProps {
  initialEpisodes: Episode[];
  availableTags: Tag[];
}

export function EpisodeArchiveClient({
  initialEpisodes,
  availableTags,
}: EpisodeArchiveClientProps) {
  const PAGE_SIZE = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const episodes = initialEpisodes;
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(PAGE_SIZE);
  };

  const handleTagToggle = (slug: string | null) => {
    setSelectedTag((prev) => (prev === slug ? null : slug));
    setVisibleCount(PAGE_SIZE);
  };

  const handleSortChange = (order: "newest" | "oldest") => {
    setSortOrder(order);
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSortOrder("newest");
    setVisibleCount(PAGE_SIZE);
  };

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
      return b.day_number - a.day_number;
    }
    if (sortOrder === "oldest") {
      return a.day_number - b.day_number;
    }
    return b.day_number - a.day_number;
  });

  const displayedEpisodes = sortedEpisodes.slice(0, visibleCount);

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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder='Search by "Day 2", hiring, sales, automation...'
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
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
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="newest">Latest Published First</option>
              <option value="oldest">Earliest First</option>
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
              onClick={() => handleTagToggle(null)}
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
                  onClick={() => handleTagToggle(tag.slug)}
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
          Showing <strong>{Math.min(displayedEpisodes.length, sortedEpisodes.length)}</strong> of {sortedEpisodes.length} episodes
        </span>
        {selectedTag && (
          <span className="text-amber-500 font-medium">
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
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            {displayedEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>

          {/* Load More Videos button */}
          {visibleCount < sortedEpisodes.length && (
            <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="group inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Load More Videos</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <span className="text-[11px] text-slate-500 font-medium">
                {sortedEpisodes.length - visibleCount} more episode{sortedEpisodes.length - visibleCount === 1 ? "" : "s"} remaining
              </span>
            </div>
          )}

          {visibleCount >= sortedEpisodes.length && sortedEpisodes.length > PAGE_SIZE && (
            <div className="text-center py-6 border-t border-slate-700/40">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                You have reached the beginning of the chronicles
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
