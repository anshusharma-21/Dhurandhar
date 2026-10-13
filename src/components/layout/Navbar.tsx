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
  ChevronDown
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
    { label: "Home", href: "/" },
    { label: "Episodes", href: "/episodes" },
    { label: "Revenue Progress", href: "/revenue" },
    { label: "About the Journey", href: "/about" },
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

    // 1. Initial user check
    client.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) return;
      if (user) {
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

        // Fetch user's profile role from public.profiles
        client
          .from("profiles")
          .select("display_name, role")
          .eq("id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (isMounted && data) {
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
          });
      } else {
        setSessionUser(null);
      }
    });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const fallbackName =
          session.user.user_metadata?.display_name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Member";

        setSessionUser({
          id: session.user.id,
          email: session.user.email,
          displayName: fallbackName,
          role: "Member",
        });
      } else {
        setSessionUser(null);
        setUserDropdownOpen(false);
      }
    });

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setUserDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/10 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <a
            href="/"
            className="flex items-center group py-1.5"
            aria-label="Project Dhurandhar Home"
          >
            <DhurandharWordmark size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
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

          {/* Desktop Action Controls & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Watch Latest CTA */}
            <a
              href="/episodes"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
            >
              <Tv className="w-3.5 h-3.5 text-slate-950" />
              <span>Watch Latest</span>
            </a>

            {/* Admin Console Link */}
            <a
              href="/admin"
              className="inline-flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-2 rounded-xl text-xs font-medium border border-slate-300/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </a>

            {/* Account / Session Control */}
            {sessionUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs border border-slate-300/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[11px] uppercase">
                    {sessionUser.displayName.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {sessionUser.displayName}
                  </span>
                  <span className="text-[10px] bg-slate-200/80 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    {sessionUser.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0e131d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-white/5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {sessionUser.displayName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {sessionUser.email}
                      </p>
                    </div>

                    {(sessionUser.role.toLowerCase() === "admin" || sessionUser.role.toLowerCase() === "editor") && (
                      <a
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3.5 py-2 text-cyan-500 dark:text-cyan-400 font-semibold hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Executive Control Center</span>
                      </a>
                    )}

                    <a
                      href="/episodes"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Browse Episodes
                    </a>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
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

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <a
              href="/episodes"
              className="text-xs bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide"
            >
              Latest
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0c1017] border-b border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-slate-200/80 dark:bg-white/10 text-amber-700 dark:text-amber-400 font-semibold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="pt-4 mt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
            {sessionUser ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {sessionUser.displayName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {sessionUser.role} • {sessionUser.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <a
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 hover:text-amber-500"
                >
                  <User className="w-4 h-4" />
                  <span>Account / Sign In</span>
                </a>
                <a
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center space-x-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
