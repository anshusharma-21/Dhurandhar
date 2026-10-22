"use client";

import React, { useState, useRef } from "react";
import { FounderProfile } from "@/lib/types/people";
import { 
  Sparkles, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Building2, 
  Globe, 
  FolderOpen,
  Camera,
  Trash2,
  UploadCloud,
  FileText,
  Loader2
} from "lucide-react";

interface AdminFounderEditorProps {
  initialProfile: FounderProfile;
}

export function AdminFounderEditor({ initialProfile }: AdminFounderEditorProps) {
  const [profile, setProfile] = useState<FounderProfile>(initialProfile);
  const [formData, setFormData] = useState({
    name: initialProfile.name || "Dr. Ajay Kumar",
    title: initialProfile.title || "Founder & Managing Partner • AI Automation Labs LLP",
    company_name: initialProfile.company_name || "AI Automation Labs LLP",
    company_url: initialProfile.company_url || "https://automationlabs.online",
    bio: initialProfile.bio || "",
    photo_url: initialProfile.photo_url || "",
  });

  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setErrorMessage("");

    // Immediate local preview for responsive UX
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, photo_url: localPreviewUrl }));

    // Upload to server
    setIsUploadingPhoto(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/admin/upload-founder-photo", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      // Update with uploaded public URL
      setFormData((prev) => ({ ...prev, photo_url: data.url }));
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload image file from computer.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo_url: "" }));
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);

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
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.name
    ? formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AK";

  return (
    <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-card transition-colors">
      {/* Header with Public View Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sole Founder Authority</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Founder Profile & Public Story
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            This information is exclusively editable here in Admin and displays live on the public <span className="font-mono text-amber-600 dark:text-amber-400">/about</span> page.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all shrink-0 hover:border-amber-500/40"
        >
          <span>View Public Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Status Feedback Banners */}
      {errorMessage && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs rounded-xl flex items-center space-x-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Founder profile updated successfully! The live public page has been synced.</span>
        </div>
      )}

      {/* Main Grid: Live Preview Card on Left/Top, Edit Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left: Live Card Preview */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Live Preview
          </span>
          <div className="bg-slate-50 dark:bg-[#070b12] border border-slate-200/80 dark:border-white/5 rounded-2xl p-5 text-center relative overflow-hidden group">
            {/* Ambient gold glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
            
            <div className="w-28 h-28 mx-auto rounded-full border-4 border-amber-500 dark:border-amber-400 overflow-hidden bg-slate-900 shadow-xl flex items-center justify-center my-3 relative">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-[#101726] to-[#070a10] flex flex-col items-center justify-center text-amber-400 ${formData.photo_url ? "-z-10 absolute inset-0" : ""}`}>
                <span className="text-2xl font-black">{initials}</span>
                <span className="text-[8px] font-mono tracking-widest uppercase text-slate-400">Founder</span>
              </div>
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
              {formData.name || "Founder Name"}
            </h3>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
              {formData.title || "Designation"}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed text-left bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
              {formData.bio || "No biography provided yet."}
            </p>
          </div>
        </div>

        {/* Right: Edit Form Fields */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Dr. Ajay Kumar"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Designation / Role Title</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Founder & Managing Partner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Company Name</span>
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="AI Automation Labs LLP"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Official Website URL</span>
              </label>
              <input
                type="url"
                value={formData.company_url}
                onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="https://automationlabs.online"
              />
            </div>
          </div>

          {/* =========================================================================
              DIRECT IMAGE SELECTOR FROM COMPUTER / FOLDER (NO URL NEEDED)
             ========================================================================= */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span>Founder Profile Photo</span>
            </label>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="bg-slate-50 dark:bg-[#131824] border-2 border-dashed border-slate-300 dark:border-white/15 hover:border-amber-500/60 rounded-2xl p-4 sm:p-5 transition-all">
              {formData.photo_url ? (
                /* State when photo is currently loaded */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shrink-0 bg-slate-900">
                      <img
                        src={formData.photo_url}
                        alt="Selected founder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        {selectedFileName || "Custom Founder Photo Active"}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to display on public site</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-bold transition-all shadow-sm"
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span>Change Photo</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Remove custom photo and use default initials badge"
                      className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* State when NO photo is selected */
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        Select Photo from Computer / Files
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Supports JPG, PNG, or WEBP (Max 8MB). No URL required.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wide shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-4 h-4" />
                        <span>Browse Folder / Files</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Executive Bio & Mission Story</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {formData.bio.length}/2000 chars
              </span>
            </div>
            <textarea
              rows={5}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#131824] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans transition-colors"
              placeholder="Write the founder mission story..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Founder Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
