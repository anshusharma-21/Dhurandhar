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
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input (AC-08) */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by "Day 2", hiring, sales, automation...'
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end text-xs">
            <span className="text-slate-400 shrink-0">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-brand-sky focus:outline-none"
            >
              <option value="newest">Latest Published First</option>
              <option value="oldest">Earliest First</option>
              <option value="day_desc">Day Number (Descending)</option>
            </select>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="pt-2 border-t border-navy-800/80">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-slate-400 font-medium">Filter by Topic:</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-brand-sky hover:underline text-xs flex items-center space-x-1"
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
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedTag === null
                  ? "bg-brand-sky text-slate-950 font-bold border-brand-sky"
                  : "bg-navy-950 text-slate-400 border-navy-800 hover:text-white hover:bg-navy-850"
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
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-brand-sky text-slate-950 font-bold border-brand-sky"
                      : "bg-navy-950 text-slate-400 border-navy-800 hover:text-white hover:bg-navy-850"
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
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
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
