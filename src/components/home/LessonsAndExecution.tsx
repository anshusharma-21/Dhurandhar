import React from "react";
import { 
  Users, 
  Sliders, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Receipt
} from "lucide-react";

export function LessonsAndExecution() {
  const pillars = [
    {
      icon: TrendingUp,
      title: "Enterprise Revenue & Deals",
      tagline: "High-Ticket Contracts",
      description: "Closing enterprise AI contracts, defining high-margin retainers, and negotiating multi-month automation deliverables.",
    },
    {
      icon: Cpu,
      title: "Autonomous Agent Engineering",
      tagline: "Production Reliability",
      description: "Developing robust LLM agent orchestration, deterministic state machines, and real corporate automation systems.",
    },
    {
      icon: Sliders,
      title: "Delivery Systems & Margins",
      tagline: "Operational Leverage",
      description: "Protecting 65%+ gross delivery margins, strictly combating scope creep, and standardising production SOPs.",
    },
    {
      icon: Users,
      title: "Talent & High-Performance Team",
      tagline: "Engineering Density",
      description: "Recruiting elite developers, aligning compensation models, building high accountability, and scaling leverage.",
    },
    {
      icon: AlertTriangle,
      title: "Unvarnished Failure Post-Mortems",
      tagline: "Honest Diagnostics",
      description: "Documenting broke builds, stalled deals, or operational roadblocks so the entire Indian builder ecosystem learns.",
    },
    {
      icon: Receipt,
      title: "Financial Governance",
      tagline: "P&L Discipline",
      description: "Cash collections, working capital management, GST compliance, and transparent accounting without vanity figures.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="execution-pillars-heading">
      <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>LESSONS & OPERATING DISCIPLINE</span>
        </div>
        <h2 id="execution-pillars-heading" className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Learning Through Real Execution
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          The core operational pillars tackled across daily episodes to scale AI Automation Labs LLP to <span className="whitespace-nowrap">₹30 Crore</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden bg-white/90 dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131824] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-amber-400/60 rounded-2xl p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-6px_rgba(245,158,11,0.22)] flex flex-col justify-between shadow-sm dark:shadow-card cursor-default"
            >
              {/* Golden top accent bar on hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Corner ambient gold glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161c28] group-hover:bg-amber-500/10 border border-slate-200 dark:border-white/10 group-hover:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 group-hover:text-amber-500 bg-slate-100 dark:bg-white/5 group-hover:bg-amber-500/10 px-2.5 py-1 rounded-full transition-colors">
                    {pillar.tagline}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
