import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#07090e] border-t border-slate-200/90 dark:border-white/10 text-slate-600 dark:text-slate-400 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <a href="/" className="inline-block group py-1">
              <DhurandharWordmark size="sm" />
            </a>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              The daily documentary chronicling Dr. Ajay Kumar and AI Automation Labs LLP as we execute the journey to ₹30 Crore revenue with radical transparency.
            </p>
            <div className="flex items-center space-x-3 text-xs text-amber-600 dark:text-amber-400 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Vlogs</span>
              </a>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <a
                href="https://automationlabs.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                <span>AI Automation Labs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-slate-200 mb-4">
              The Journey
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="/episodes" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Episode Archive
                </a>
              </li>
              <li>
                <a href="/revenue" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Revenue Dashboard
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  About Dr. Ajay Kumar
                </a>
              </li>
              <li>
                <a href="/people" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  People & Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-slate-200 mb-4">
              Community & Trust
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="/community-guidelines" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  <span>Admin Console</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Revenue & Compliance Disclaimer */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-amber-700 dark:text-amber-400 mb-4">
              Revenue Disclosure
            </h4>
            <div className="bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                All financial figures and milestones presented on this website represent operational progress numbers self-reported by AI Automation Labs LLP.
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500">
                These disclosures do not constitute an audited financial statement or an offer of investment or securities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Automation Labs LLP. All rights reserved.</p>
          <p className="text-[11px]">
            Production Host: <code className="text-slate-700 dark:text-slate-300 font-mono">projectdhurandhar.automationlabs.online</code>
          </p>
        </div>
      </div>
    </footer>
  );
}
