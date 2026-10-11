"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import { 
  Flame, 
  Tv, 
  TrendingUp, 
  Info, 
  User, 
  Menu, 
  X, 
  ShieldCheck,
  ExternalLink 
} from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-navy-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-sky via-cyan-500 to-amber-500 p-0.5 flex items-center justify-center shadow-subtle group-hover:shadow-goldGlow transition-all">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold block">
                ROAD TO ₹30CR
              </span>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-brand-sky transition-colors">
                PROJECT DHURANDHAR
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-navy-800 text-brand-cyan border border-navy-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-navy-900"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="/episodes"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-subtle hover:shadow-cyan-500/20 transition-all"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>Watch Latest</span>
            </a>

            <a
              href="/admin"
              className="inline-flex items-center space-x-1 text-slate-400 hover:text-white px-2.5 py-2 rounded-lg text-xs font-medium border border-navy-700 hover:bg-navy-900 transition-colors"
              title="Admin Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Admin</span>
            </a>

            <a
              href="/sign-in"
              className="p-2 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              title="Sign in / Account"
            >
              <User className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href="/episodes"
              className="text-xs bg-brand-sky text-slate-950 font-bold px-3 py-1.5 rounded-md"
            >
              Latest Day
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-navy-700 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? "bg-navy-800 text-brand-cyan font-semibold"
                  : "text-slate-300 hover:bg-navy-800 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-navy-800 flex items-center justify-between">
            <a
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center space-x-2 text-sm text-slate-300 hover:text-white"
            >
              <User className="w-4 h-4" />
              <span>Account / Sign In</span>
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-brand-cyan bg-navy-800 px-3 py-1.5 rounded-md border border-navy-700"
            >
              Admin Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
