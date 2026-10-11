import React from "react";
import { MessageSquare, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";

export function CommunityCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-sky/10 border border-brand-sky/30 text-brand-sky text-xs font-semibold mb-4">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Join the Dhurandhar Community</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Follow the journey, debate the decisions, and share lessons.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed mb-8">
            Create an account to join the discussion on daily episodes. First-time submissions are reviewed by our team to maintain constructive, spam-free dialogue.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle transition-all"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>Create Free Account to Comment</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-navy-950 hover:bg-navy-900 text-slate-200 hover:text-white border border-navy-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
