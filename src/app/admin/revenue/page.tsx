import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { RevenueManagerClient } from "@/components/admin/RevenueManagerClient";

export const revalidate = 0;

export default async function AdminRevenuePage() {
  const settings = await dbRepository.getRevenueSettings();
  const months = await dbRepository.getRevenueMonths(true); // include private

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            FINANCIAL GOVERNANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Revenue Dashboard & Ledger Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure goal definitions, record monthly verified actuals, and govern public visibility.
          </p>
        </div>
      </div>

      <RevenueManagerClient initialSettings={settings} initialMonths={months} />
    </div>
  );
}
