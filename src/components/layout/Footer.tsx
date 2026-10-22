import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";

export function Footer() {
  return (
    <footer className="relative bg-[#0c1017] dark:bg-[#05070c] text-slate-400 border-t border-slate-800/90 dark:border-white/10 transition-colors duration-200 overflow-hidden">
      {/* Golden Apex Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />
      {/* Subtle Ambient Golden Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-32 bg-amber-500/[0.03] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-start">
          {/* Column 1: Brand & Socials (4 cols) */}
          <div className="space-y-3.5 md:col-span-4">
            <a href="/" className="inline-block group py-1" aria-label="Project Dhurandhar Home">
              <DhurandharWordmark size="md" inverted={true} />
            </a>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Documenting Dr. Ajay Kumar and AI Automation Labs LLP executing the journey to ₹30 Crore revenue with radical transparency.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 font-medium transition-all shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-amber-500" />
                <span>Instagram Vlogs</span>
              </a>
              <a
                href="https://automationlabs.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 font-medium transition-all shadow-xs"
              >
                <span>AI Automation Labs</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Column 2: The Journey Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white">
              The Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/episodes" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Episode Archive
                </a>
              </li>
              <li>
                <a href="/revenue" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Revenue Dashboard
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-400 hover:text-amber-400 transition-colors">
                  About Dr. Ajay Kumar
                </a>
              </li>
              <li>
                <a href="/people" className="text-slate-400 hover:text-amber-400 transition-colors">
                  People & Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white">
              Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/community-guidelines" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Community Rules
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-400 hover:text-amber-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center space-x-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  <span>Admin Console</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Revenue & Compliance Disclosure Card (4 cols) */}
          <div className="md:col-span-4">
            <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 shadow-lg space-y-2 backdrop-blur-md">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Revenue Disclosure</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                All financial figures and milestones presented represent operational progress numbers self-reported by AI Automation Labs LLP under recognised revenue accounting.
              </p>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                Disclosures do not constitute an audited financial statement or an offer of securities.
              </p>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="pt-5 border-t border-white/10 flex items-center justify-center text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AI Automation Labs LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
