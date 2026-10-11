import React from "react";
import { Flame, ShieldCheck, ExternalLink } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center">
                <Flame className="w-4 h-4 text-brand-gold" />
              </div>
              <span className="font-bold text-white tracking-tight text-sm">
                PROJECT DHURANDHAR
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The unfiltered, daily documentary chronicling Dr. Ajay Kumar and AI Automation Labs LLP as we execute our road to ₹30 Crore revenue.
            </p>
            <div className="flex items-center space-x-3 text-xs text-brand-cyan">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Vlogs</span>
              </a>
              <span>•</span>
              <a
                href="https://automationlabs.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>AI Automation Labs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-4">
              The Journey
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/episodes" className="hover:text-white transition-colors">
                  Episode Archive
                </a>
              </li>
              <li>
                <a href="/revenue" className="hover:text-white transition-colors">
                  Revenue Dashboard
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Dr. Ajay Kumar
                </a>
              </li>
              <li>
                <a href="/people" className="hover:text-white transition-colors">
                  People & Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-4">
              Community & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/community-guidelines" className="hover:text-white transition-colors">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition-colors inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-brand-cyan" />
                  <span>Admin Console</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Revenue & Compliance Disclaimer */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-gold mb-4">
              Revenue Disclosure
            </h4>
            <div className="bg-navy-900/80 p-3.5 rounded-xl border border-navy-800 text-[11px] leading-relaxed text-slate-400 space-y-2">
              <p>
                All financial figures and milestones presented on this website are self-reported operational progress numbers by AI Automation Labs LLP.
              </p>
              <p className="text-[10px] text-slate-500">
                These disclosures do not constitute an audited financial statement or an offer of investment or securities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Automation Labs LLP. All rights reserved.</p>
          <p className="text-[11px]">
            Production Host: <code className="text-slate-400">projectdhurandhar.automationlabs.online</code>
          </p>
        </div>
      </div>
    </footer>
  );
}
