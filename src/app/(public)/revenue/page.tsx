import React from "react";
import { Metadata } from "next";
import { dbRepository } from "@/lib/db/repository";
import { calculateRevenueMetrics } from "@/lib/revenue/calculator";
import { RevenueDashboardView } from "@/components/revenue/RevenueDashboardView";
import { TrendingUp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Revenue Progress Dashboard | Project Dhurandhar",
  description:
    "Transparent financial accountability dashboard tracking AI Automation Labs LLP on the road to ₹30 Crore revenue.",
};

export const revalidate = 60;

export default async function RevenuePage() {
  const settings = await dbRepository.getRevenueSettings();
  const months = await dbRepository.getRevenueMonths(false);
  const milestones = await dbRepository.getMilestones();

  const metrics = settings.visibility !== "private"
    ? calculateRevenueMetrics(settings, months)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4 text-brand-gold" />
          <span>Financial Accountability</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Road to ₹30 Crore Revenue
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Real enterprise progress documented monthly. No vanity valuations, no exaggerated projections—only self-reported recognised client revenues and operational milestones.
        </p>
      </div>

      <RevenueDashboardView
        settings={settings}
        metrics={metrics}
        milestones={milestones}
        visibility={settings.visibility}
      />
    </div>
  );
}
