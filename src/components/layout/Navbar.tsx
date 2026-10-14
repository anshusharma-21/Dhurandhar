"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Tv, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  Home,
  TrendingUp,
  Compass,
  Sparkles,
  Users
} from "lucide-react";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface SessionUser {
  id: string;
  email?: string;
  displayName: string;
  role: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navLinks = [
    { 
      label: "Home", 
      href: "/", 
      icon: Home,
      description: "Mission overview, live revenue & latest vlog"
    },
    { 
      label: "Episodes", 
      href: "/episodes", 
      icon: Tv,
      description: "Daily vlogs, lessons & raw execution logs"
    },
    { 
      label: "Revenue Progress", 
      href: "/revenue", 
      icon: TrendingUp,
      description: "Transparent road to ₹30 Crore financial ledger"
    },
    { 
      label: "About the Journey", 
      href: "/about", 
      icon: Compass,
      description: "Dr. Ajay Kumar, founder story & AI Automation Labs"
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      return;
    }

    let isMounted = true;

    const loadUserProfile = async (user: any) => {
      if (!isMounted) return;
      if (!user) {
        setSessionUser(null);
        setUserDropdownOpen(false);
        return;
      }

      const fallbackName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Member";

      setSessionUser({
        id: user.id,
        email: user.email,
        displayName: fallbackName,
        role: "Member",
      });

      try {
        const { data, error } = await client
          .from("profiles")
          .select("display_name, role")
          .eq("id", user.id)
          .maybeSingle();

        if (isMounted && data && !error) {
          setSessionUser((prev) =>
            prev
              ? {
                  ...prev,
                  displayName: data.display_name || prev.displayName,
                  role: data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : "Member",
                }
              : null
          );
        }
      } catch {
        // Keep fallback
      }
    };

    // 1. Initial user check
    client.auth.getUser().then(({ data: { user } }) => {
      loadUserProfile(user);
    });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      loadUserProfile(session?.user);
    });

    // 3. Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // 4. Close menus on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 5. Close mobile drawer on desktop resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/10 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo - Responsive sizing */}
          <a
            href="/"
            className="flex items-center group py-1.5 shrink-0"
            aria-label="Project Dhurandhar Home"
          >
            <DhurandharWordmark size="sm" className="sm:hidden" />
            <DhurandharWordmark size="md" className="hidden sm:inline-flex" />
          </a>

          {/* Desktop Navigation (>= 1024px) */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-slate-200/80 dark:bg-white/10 text-amber-700 dark:text-amber-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Action Controls (>= 1024px) */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Watch Latest CTA */}
            <a
              href="/episodes"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all shrink-0"
            >
              <Tv className="w-3.5 h-3.5 text-slate-950" />
              <span>Watch Latest</span>
            </a>

            {/* Admin Console Link */}
            <a
              href="/admin"
              className="inline-flex items-center space-x-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-300/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </a>

            {/* Account / Session Control - Compact Avatar Icon Button */}
            {sessionUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/25 hover:from-amber-500/25 hover:to-amber-600/35 border border-amber-500/30 hover:border-amber-400 text-amber-700 dark:text-amber-300 font-black text-xs uppercase shadow-sm transition-all cursor-pointer hover:scale-105 shrink-0"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  title={`${sessionUser.displayName} (${sessionUser.role})`}
                  aria-label="User Account Menu"
                >
                  <span>{sessionUser.displayName.charAt(0)}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#07090e] rounded-full" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 text-xs backdrop-blur-xl">
                    {/* User Identity Header */}
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/5 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-amber-500/30">
                        {sessionUser.displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {sessionUser.displayName}
                          </p>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-1 py-0.2 rounded">
                            {sessionUser.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {sessionUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      {(sessionUser.role.toLowerCase() === "admin" || sessionUser.role.toLowerCase() === "editor") && (
                        <a
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-cyan-600 dark:text-cyan-400 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                          <span>Executive Control Center</span>
                        </a>
                      )}

                      <a
                        href="/episodes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        Browse Episodes
                      </a>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-3.5 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/sign-in"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors border border-slate-300/80 dark:border-white/10"
                title="Sign in / Community Account"
              >
                <User className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Quick Watch button on tablet / medium screens */}
            <a
              href="/episodes"
              className="hidden sm:inline-flex items-center space-x-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-xl uppercase tracking-wider transition-colors shrink-0"
            >
              <Tv className="w-3.5 h-3.5 text-slate-950" />
              <span>Watch</span>
            </a>

            {/* User Avatar if signed in */}
            {sessionUser && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase shrink-0"
                title={`${sessionUser.displayName} (${sessionUser.role})`}
                aria-label="User Account"
              >
                <span>{sessionUser.displayName.charAt(0)}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
              </button>
            )}

            {/* =========================================================================
                STYLIZED LUXURY HAMBURGER BUTTON (Unmistakable, High-Contrast & Prominent)
               ========================================================================= */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm shrink-0 ${
                mobileMenuOpen
                  ? "bg-amber-500 text-slate-950 shadow-amber-500/30 border border-amber-400 scale-102"
                  : "bg-slate-100 hover:bg-slate-200/90 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-slate-800 dark:text-slate-100 border border-slate-300/90 dark:border-white/20 hover:border-amber-500/60"
              }`}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="font-extrabold uppercase tracking-wider text-[11px]">Close</span>
                </>
              ) : (
                <>
                  {/* Distinctive 3-Bar Hamburger Icon */}
                  <div className="w-4 h-3.5 flex flex-col justify-between py-0.5 shrink-0" aria-hidden="true">
                    <span className="block h-0.5 w-full bg-current rounded-full" />
                    <span className="block h-0.5 w-full bg-current rounded-full" />
                    <span className="block h-0.5 w-full bg-current rounded-full" />
                  </div>
                  <span className="font-extrabold uppercase tracking-wider text-[11px]">Menu</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          HIGH-END ACCESSIBLE MOBILE & TABLET DRAWER (Visible across all screens < 1024px)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-[#0b0e15]/98 backdrop-blur-2xl border-b border-slate-200/90 dark:border-white/10 shadow-2xl transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            
            {/* Drawer Subheader Banner */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>NAVIGATION & DIRECTORY</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400">
                PROJECT DHURANDHAR • ROAD TO ₹30CR
              </span>
            </div>

            {/* Primary Nav Links Grid (Home, Episodes, Revenue Progress, About) */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="Mobile Navigation Drawer">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 ${
                      active
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold shadow-xs"
                        : "bg-slate-50 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        active 
                          ? "bg-amber-500 text-slate-950 font-bold shadow-xs" 
                          : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold flex items-center space-x-2">
                          <span className="truncate">{link.label}</span>
                          {active && (
                            <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-amber-600 dark:text-amber-400 translate-x-0.5" : "text-slate-400"}`} />
                  </a>
                );
              })}
            </nav>

            {/* Quick Action Buttons */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="/episodes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <Tv className="w-4 h-4 text-slate-950" />
                <span>Watch Latest Episode</span>
              </a>

              <a
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Executive Admin Portal</span>
              </a>
            </div>

            {/* Secondary Public Directory Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick:</span>
              <a
                href="/people"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:text-amber-500 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>People & Partners</span>
              </a>
              <a
                href="/community-guidelines"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:text-amber-500 transition-colors"
              >
                <span>Guidelines</span>
              </a>
              <a
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:text-amber-500 transition-colors"
              >
                <span>Privacy</span>
              </a>
            </div>

            {/* User Session & Account Card inside Drawer */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/5">
              {sessionUser ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                      {sessionUser.displayName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {sessionUser.displayName}
                        </p>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 px-1.5 py-0.5 rounded shrink-0">
                          {sessionUser.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {sessionUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="ml-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-900/50 transition-colors shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Join community discussions & comment</span>
                  </div>
                  <a
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xs transition-colors shrink-0"
                  >
                    <span>Sign In</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
