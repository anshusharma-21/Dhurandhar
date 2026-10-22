"use client";

import React, { useState, useRef, useEffect } from "react";
import { Episode } from "@/lib/types/episode";
import { formatDate } from "@/lib/utils/formatters";
import { 
  Calendar as CalendarIcon, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Tv,
  Target,
  Clock,
  Radio
} from "lucide-react";

interface PostingCalendarProps {
  episodes: Episode[];
  totalDays?: number;
}

export function PostingCalendar({ episodes, totalDays = 365 }: PostingCalendarProps) {
  // Map published episodes by day_number
  const publishedMap = new Map<number, Episode>();
  episodes.forEach((ep) => {
    if (ep.status === "published") {
      publishedMap.set(ep.day_number, ep);
    }
  });

  const publishedCount = publishedMap.size;
  const currentStreak = publishedCount; // currently 2
  const todayDayNumber = publishedCount + 1; // Day 3

  // 12 Months of the 365-Day Journey (Oct 2026 to Sep 2027)
  const journeyMonths = [
    { id: "oct", name: "October 2026", short: "Oct", days: 31, startDay: 1, endDay: 31, startWeek: 0, endWeek: 4, milestone: "Foundation & Setup" },
    { id: "nov", name: "November 2026", short: "Nov", days: 30, startDay: 32, endDay: 61, startWeek: 4, endWeek: 8, milestone: "First Enterprise Retainers" },
    { id: "dec", name: "December 2026", short: "Dec", days: 31, startDay: 62, endDay: 92, startWeek: 8, endWeek: 13, milestone: "Q1 ₹2.5 Cr Sprint" },
    { id: "jan", name: "January 2027", short: "Jan", days: 31, startDay: 93, endDay: 123, startWeek: 13, endWeek: 17, milestone: "Agent System Deployment" },
    { id: "feb", name: "February 2027", short: "Feb", days: 28, startDay: 124, endDay: 151, startWeek: 17, endWeek: 21, milestone: "Delivery Margin Optimisation" },
    { id: "mar", name: "March 2027", short: "Mar", days: 31, startDay: 152, endDay: 182, startWeek: 21, endWeek: 26, milestone: "Crossed ₹10 Crore Run-rate" },
    { id: "apr", name: "April 2027", short: "Apr", days: 30, startDay: 183, endDay: 212, startWeek: 26, endWeek: 30, milestone: "US Healthcare Expansion" },
    { id: "may", name: "May 2027", short: "May", days: 31, startDay: 213, endDay: 243, startWeek: 30, endWeek: 34, milestone: "Team Leverage & Hiring" },
    { id: "jun", name: "June 2027", short: "Jun", days: 30, startDay: 244, endDay: 273, startWeek: 34, endWeek: 39, milestone: "Autonomous Agent Clusters" },
    { id: "jul", name: "July 2027", short: "Jul", days: 31, startDay: 274, endDay: 304, startWeek: 39, endWeek: 43, milestone: "Mid-Year Revenue Audit" },
    { id: "aug", name: "August 2027", short: "Aug", days: 31, startDay: 305, endDay: 335, startWeek: 43, endWeek: 47, milestone: "₹25 Crore Threshold" },
    { id: "sep", name: "September 2027", short: "Sep", days: 30, startDay: 336, endDay: 365, startWeek: 47, endWeek: 52, milestone: "₹30 Crore Summit Finish" },
  ];

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0); // October 2026 default
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(publishedCount > 0 ? publishedCount : 1);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);

  // Close month picker popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMonth = journeyMonths[selectedMonthIdx];
  const activeDayNumber = hoveredDay || selectedDay;
  const activeEpisode = publishedMap.get(activeDayNumber);

  // Generate full 52-week grid (GitHub contribution style: 7 rows x 52 columns)
  const totalWeeks = Math.ceil(totalDays / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, weekIdx) => {
    return Array.from({ length: 7 }, (_, dayOfWeek) => {
      const dayNum = weekIdx * 7 + dayOfWeek + 1;
      return dayNum <= totalDays ? dayNum : null;
    });
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20" aria-labelledby="publishing-cadence-heading">
      <div className="bg-white/95 dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-colors">
        
        {/* Ambient Warm Golden Backlight Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* 1. Header: Title, Description & Top Metrics */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-white/5">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>GITHUB-STYLE CONSISTENCY MATRIX • 365-DAY CHALLENGE</span>
            </div>
            
            <h2 id="publishing-cadence-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              365 Days of Relentless Execution
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Every day documented live on our road to ₹30 Crore. Track our consistency across all 12 months with daily vlog logs, streaks, and milestone markers.
            </p>
          </div>

          {/* Quick Metrics Badges Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 text-xs">
            {/* Live Today Badge */}
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="whitespace-nowrap">Day {todayDayNumber} In Production</span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-slate-900 dark:text-white">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="whitespace-nowrap">{currentStreak} Day Active Streak</span>
            </div>

            {/* Cadence */}
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="whitespace-nowrap">{publishedCount} / 365 Days</span>
            </div>
          </div>
        </div>

        {/* 2. Month Selector Toolbar: Clean Calendar Dropdown & Stepper (No clutter) */}
        <div className="relative z-20 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Calendar-Style Month Picker */}
          <div className="flex items-center space-x-2" ref={pickerRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPickerOpen(!pickerOpen)}
                className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                title="Click to select month"
              >
                <CalendarIcon className="w-4 h-4 text-slate-950" />
                <span>{currentMonth.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${pickerOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Month Picker Popup (Clean 3x4 Grid) */}
              {pickerOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#111723] border border-slate-200 dark:border-white/15 rounded-2xl p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span>Select Journey Month</span>
                    <span className="text-amber-500 font-mono">2026 – 2027</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {journeyMonths.map((m, idx) => {
                      const isSelected = selectedMonthIdx === idx;
                      const hasVlogs = idx === 0;

                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedMonthIdx(idx);
                            setSelectedDay(m.startDay);
                            setPickerOpen(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                              : hasVlogs
                              ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                              : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span>{m.short}</span>
                          <span className="text-[9px] font-mono opacity-70">
                            {idx < 3 ? "2026" : "2027"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Arrows */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                disabled={selectedMonthIdx === 0}
                onClick={() => {
                  const newIdx = Math.max(0, selectedMonthIdx - 1);
                  setSelectedMonthIdx(newIdx);
                  setSelectedDay(journeyMonths[newIdx].startDay);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                type="button"
                disabled={selectedMonthIdx === journeyMonths.length - 1}
                onClick={() => {
                  const newIdx = Math.min(journeyMonths.length - 1, selectedMonthIdx + 1);
                  setSelectedMonthIdx(newIdx);
                  setSelectedDay(journeyMonths[newIdx].startDay);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </div>

            {/* Active Sprint Milestone Label */}
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 pl-2">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Sprint Focus: <strong className="text-slate-900 dark:text-white">{currentMonth.milestone}</strong></span>
            </div>
          </div>

          {/* Quick Date Range Tag */}
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono">
              Days {currentMonth.startDay} to {currentMonth.endDay} of 365
            </span>
          </div>
        </div>

        {/* 3. FULL-WIDTH GITHUB CONTRIBUTION GRAPH MATRIX (All 52 Weeks, Zero Empty White Space) */}
        <div className="relative z-10 mt-2 bg-slate-50/80 dark:bg-[#070a10]/80 border border-slate-200/80 dark:border-white/5 rounded-2xl p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[820px] space-y-2 select-none">
            
            {/* Top Month Labels (Evenly Aligned Across the 52 Weeks) */}
            <div className="flex text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-8 justify-between pr-2">
              {journeyMonths.map((m, idx) => {
                const isSelected = selectedMonthIdx === idx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMonthIdx(idx);
                      setSelectedDay(m.startDay);
                    }}
                    className={`uppercase tracking-wider transition-colors cursor-pointer ${
                      isSelected 
                        ? "text-amber-600 dark:text-amber-400 font-extrabold underline underline-offset-4" 
                        : "hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {m.short}
                  </button>
                );
              })}
            </div>

            {/* Matrix Body: Weekday Labels (Mon, Wed, Fri, Sun) + 52 Week Columns */}
            <div className="flex gap-2 items-start pt-1">
              {/* Day Labels Column */}
              <div className="flex flex-col justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 h-[126px] py-0.5 select-none w-6 shrink-0 text-right pr-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>

              {/* 52-Week Columns Grid */}
              <div className="flex gap-1.5 flex-1 justify-between">
                {weeks.map((week, wIdx) => {
                  const isMonthWeek = wIdx >= currentMonth.startWeek && wIdx <= currentMonth.endWeek;

                  return (
                    <div 
                      key={wIdx} 
                      className={`flex flex-col gap-1.5 p-0.5 rounded-sm transition-all duration-200 ${
                        isMonthWeek 
                          ? "bg-amber-500/10 dark:bg-amber-500/10 ring-1 ring-amber-500/30" 
                          : ""
                      }`}
                    >
                      {week.map((dayNum, dIdx) => {
                        if (!dayNum) {
                          return <div key={`empty-${dIdx}`} className="w-3.5 h-3.5 opacity-0" />;
                        }

                        const ep = publishedMap.get(dayNum);
                        const isPublished = !!ep;
                        const isToday = dayNum === todayDayNumber;
                        const isSelected = selectedDay === dayNum;

                        let tileClass = "bg-slate-200/70 dark:bg-white/[0.05] border-transparent hover:border-slate-400 dark:hover:border-white/30";

                        if (isPublished) {
                          tileClass = isSelected
                            ? "bg-amber-500 dark:bg-amber-400 border-2 border-white dark:border-amber-100 shadow-[0_0_10px_rgba(245,158,11,1)] scale-125 z-20"
                            : "bg-amber-500 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.6)] border border-amber-600/40 hover:scale-125 z-10";
                        } else if (isToday) {
                          tileClass = "border-2 border-amber-500 bg-amber-500/20 animate-pulse hover:scale-125 hover:bg-amber-500/40 z-10";
                        }

                        return (
                          <button
                            type="button"
                            key={`tile-${dayNum}`}
                            onClick={() => setSelectedDay(dayNum)}
                            onMouseEnter={() => setHoveredDay(dayNum)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-3.5 h-3.5 rounded-xs border transition-all duration-150 cursor-pointer ${tileClass}`}
                            title={`Day ${dayNum}${isPublished ? `: ${ep?.title}` : isToday ? " (Today — In Production)" : " (Upcoming Day)"}`}
                            aria-label={`Day ${dayNum}`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>


        {/* 5. GITHUB CONTRIBUTION LEGEND & FOOTER */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-4">
          
          {/* Exact GitHub Contribution Legend: Less  □ ▨ ■ █  More */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Cadence:</span>
            <div className="flex items-center space-x-1.5 ml-1">
              <span>Less</span>
              <span className="w-3.5 h-3.5 rounded-xs bg-slate-200/60 dark:bg-white/[0.05] border border-slate-300/40 dark:border-white/10" title="No activity" />
              <span className="w-3.5 h-3.5 rounded-xs border-2 border-amber-500 bg-amber-500/20" title="In production today" />
              <span className="w-3.5 h-3.5 rounded-xs bg-amber-500/60" title="Published" />
              <span className="w-3.5 h-3.5 rounded-xs bg-amber-500 shadow-xs" title="Published Vlog" />
              <span>More</span>
            </div>
          </div>

          <a
            href="/episodes"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            <span>Explore All 365 Episode Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
