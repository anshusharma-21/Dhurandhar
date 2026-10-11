"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Tv, 
  User, 
  Menu, 
  X, 
  ShieldCheck
} from "lucide-react";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf7]/90 dark:bg-[#07090e]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark (Exact DHURANDHAR Identity) */}
          <a
            href="/"
            className="flex items-center group py-2"
            aria-label="DHURANDHAR Home"
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

            {/* Account / Sign In */}
            <a
              href="/sign-in"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors border border-slate-300/80 dark:border-white/10"
              title="Sign in / Community Account"
            >
              <User className="w-4 h-4" />
            </a>
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
        <div className="md:hidden bg-[#fcfbf7] dark:bg-[#0c1017] border-b border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-xl">
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

          <div className="pt-4 mt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
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
        </div>
      )}
    </header>
  );
}
