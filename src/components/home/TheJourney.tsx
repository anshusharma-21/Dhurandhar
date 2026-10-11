import { BookOpen, Compass } from "lucide-react";

export function TheJourney() {
  const principles = [
    {
      num: "01",
      title: "Radical Public Transparency",
      desc: "No vanity ARR metrics or inflated pipeline numbers. We report actual invoiced delivery, recognised collections, and real unit economics.",
    },
    {
      num: "02",
      title: "Daily Architectural Logs",
      desc: "Every day Dr. Ajay Kumar documents operational choices, agentic software pipelines, and engineering trade-offs made in the field.",
    },
    {
      num: "03",
      title: "Unvarnished Setbacks",
      desc: "When client deals stall, prompts drift, or delivery timelines hit friction, we do not edit out the struggle. We dissect it openly.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="the-journey-heading">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Editorial Manifesto Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>THE PURPOSE & MANIFESTO</span>
          </div>

          <h2 id="the-journey-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Why document an enterprise journey in public?
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Most business growth stories are told in retrospect, polished and sanitised with survivorship bias.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white font-semibold">Project Dhurandhar</strong> flips the script. We are recording our path to ₹30 Crore in annual revenue as it unfolds in real time—before knowing the ultimate ending.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-l-2 border-amber-500/50 pl-4 py-1 italic">
              “Building a high-margin technology enterprise in India requires relentless operational discipline, not overnight hype. This journal is our public contract of accountability.”
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/about"
              className="inline-flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 uppercase tracking-wider transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read the Full Founding Story</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right 3 Core Operating Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-5">
          {principles.map((item) => (
            <div
              key={item.num}
              className="bg-white/90 dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-card hover:border-amber-500/40 transition-all duration-200"
            >
              <div className="flex items-start space-x-5">
                <span className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400/80 shrink-0">
                  {item.num}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
