import React from "react";
import { 
  Bot, 
  Briefcase, 
  Users, 
  Sliders, 
  AlertTriangle, 
  Lightbulb, 
  HeartHandshake, 
  TrendingUp 
} from "lucide-react";

export function JourneyTopics() {
  const topics = [
    {
      icon: TrendingUp,
      title: "Enterprise Sales & Pipelines",
      description: "Closing multi-lakh and crore enterprise automation contracts, negotiating scopes, and structuring retainers.",
    },
    {
      icon: Bot,
      title: "Autonomous AI & Agent Workflows",
      description: "Engineering real agentic solutions, prompt orchestration, and autonomous operational systems for corporate clients.",
    },
    {
      icon: Sliders,
      title: "Delivery Systems & Margins",
      description: "Protecting 65%+ gross delivery margins, preventing scope creep, and standardizing operational SOPs.",
    },
    {
      icon: Users,
      title: "Hiring & High-Performance Team",
      description: "Recruiting elite AI engineers, compensation plans, culture building, and scaling human leverage.",
    },
    {
      icon: AlertTriangle,
      title: "Setbacks, Bottlenecks & Mistakes",
      description: "Candid post-mortems when code breaks, deals stall, or operational surprises test the mission.",
    },
    {
      icon: Lightbulb,
      title: "Founder Lessons & Operating Principles",
      description: "Raw reflections from Dr. Ajay Kumar on leadership, mental stamina, capital allocation, and focus.",
    },
    {
      icon: HeartHandshake,
      title: "Customer Impact & ROI",
      description: "Actual measured efficiency improvements, cost savings, and transformations inside client organizations.",
    },
    {
      icon: Briefcase,
      title: "Financial Governance",
      description: "Radically transparent cash flow management, GST treatments, working capital, and unit economics.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" aria-labelledby="topics-heading">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em] block mb-2">
          Curriculum of Execution
        </span>
        <h2 id="topics-heading" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          What This Journey Covers
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          Every episode tackles one of the eight core pillars needed to scale an AI enterprise to ₹30 Crore.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0e131d] hover:bg-slate-50 dark:hover:bg-[#131926] border border-slate-200/90 dark:border-white/10 hover:border-amber-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-sm dark:shadow-card"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
