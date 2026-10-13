"use client";

import React, { useState } from "react";
import { FounderProfile } from "@/lib/types/people";
import { 
  Building2, 
  ExternalLink, 
  Edit3, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  X, 
  Camera,
  CheckCircle2
} from "lucide-react";

interface AboutFounderSectionProps {
  initialProfile: FounderProfile;
}

export function AboutFounderSection({ initialProfile }: AboutFounderSectionProps) {
  const [profile, setProfile] = useState<FounderProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Edit form state
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    company_name: profile.company_name,
    company_url: profile.company_url,
    bio: profile.bio,
    photo_url: profile.photo_url || "",
  });

  const handleOpenEdit = () => {
    setFormData({
      name: profile.name,
      title: profile.title,
      company_name: profile.company_name,
      company_url: profile.company_url,
      bio: profile.bio,
      photo_url: profile.photo_url || "",
    });
    setErrorMessage("");
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update founder details.");
      }

      setProfile(data.profile);
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const principles = [
    {
      icon: Target,
      title: "Radical Accountability",
      tagline: "Total Public Audit",
      description:
        "Every single milestone, metric, customer win, and operational setback is recorded publicly. No vanity ARR numbers, inflated pipeline, or paper valuations.",
    },
    {
      icon: Building2,
      title: "Enterprise Delivery",
      tagline: "High-Margin Automation",
      description:
        "Engineering autonomous AI workflows and agentic pipelines that deliver measurable financial ROI to enterprise clients with protected gross margins.",
    },
    {
      icon: ShieldCheck,
      title: "Human + AI Synergy",
      tagline: "Operational Leverage",
      description:
        "Deploying artificial intelligence to multiply human bandwidth 10x, while keeping human strategic discernment and editorial judgment firmly in control.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          1. FOUNDER PROFILE CARD: CIRCLE HALF-OVERLAPPING SQUARE/CARD
         ========================================================================= */}
      <div className="relative pt-16 sm:pt-20">
        {/* The Rounded Square / Details Container */}
        <div className="relative bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 border-t-2 border-t-amber-500/50 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
          
          {/* Subtle Ambient Gold Glow inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Half-Overlapping Circular Avatar */}
          <div className="absolute -top-16 sm:-top-20 left-6 sm:left-10 z-20">
            <div className="relative group/avatar">
              {/* Outer Golden Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 rounded-full blur-md opacity-70 group-hover/avatar:opacity-100 transition-opacity duration-300" />
              
              {/* Circle Avatar Frame (Half outside, half inside) */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-amber-500 dark:border-amber-400 overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image URL fails to load
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : null}

                {/* Initials Fallback if no photo or photo hidden */}
                <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-[#101726] to-[#070a10] flex flex-col items-center justify-center text-amber-400 ${profile.photo_url ? "-z-10 absolute inset-0" : ""}`}>
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    {profile.initials || "AK"}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mt-1">
                    Founder
                  </span>
                </div>

                {/* Edit Photo Indicator on hover */}
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  title="Click to edit founder photo & details"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold transition-opacity duration-200"
                >
                  <Camera className="w-5 h-5 mb-1 text-amber-400" />
                  <span>Update Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Top Row: Edit Profile Button / Admin Trigger */}
          <div className="flex justify-end mb-6 sm:mb-4">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Edit Founder Story</span>
            </button>
          </div>

          {/* Details Content (Positioned with top margin to accommodate overlapping circle) */}
          <div className="pt-8 sm:pt-4 space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Profile</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 block mt-1">
                {profile.title}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {profile.bio}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-bold">
              <a
                href={profile.company_url || "https://automationlabs.online"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all"
              >
                <span>{profile.company_name} Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href="/revenue"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 transition-all"
              >
                <span>View ₹30CR Financial Progress</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. THE 3 CORE OPERATING PRINCIPLES BOXES (HOVER: POPUP & ZOOM INTERACTION)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em] block mb-1">
              THE EXECUTION DNA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Core Operating Principles
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Hover over each principle to explore the operational philosophy driving Project Dhurandhar.
          </p>
        </div>

        {/* 3 Interactive Cards with Popup & Zoom-Out Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#141b29] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/70 dark:hover:border-amber-400/70 rounded-2xl p-7 shadow-sm dark:shadow-card hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.25)] transition-all duration-300 ease-out cursor-default flex flex-col justify-between"
              >
                {/* Golden top accent bar on hover */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Ambient corner radial glow on hover */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161c28] group-hover:bg-amber-500/15 border border-slate-200 dark:border-white/10 group-hover:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 bg-slate-100 dark:bg-white/5 group-hover:bg-amber-500/10 px-2.5 py-1 rounded-full transition-colors">
                      {item.tagline}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400/80 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  <span>Operating Standard #{idx + 1}</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. EDIT PROFILE MODAL (FULL EDIT & UPDATE FUNCTIONALITY)
         ========================================================================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0e131d] border border-slate-200 dark:border-white/10 border-t-4 border-t-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Edit Founder Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={formData.company_url}
                  onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Profile Photo URL (Circle Avatar)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Paste any public image link. Leave empty to use default initials badge.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Executive Bio & Mission Story
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
