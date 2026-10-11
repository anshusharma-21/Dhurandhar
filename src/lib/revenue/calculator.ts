import { RevenueMonth, RevenueSettings, RevenueCalculations } from "../types/revenue";
import { formatMonthLabel } from "../utils/formatters";

/**
 * Authoritative Revenue Calculator
 * Computes progress, percentages, gaps, variances, and monthly trends.
 * Complies with Section 9.3, 9.4, and AC-14.
 */
export function calculateRevenueMetrics(
  settings: RevenueSettings,
  months: RevenueMonth[]
): RevenueCalculations {
  const targetAmount = Number(settings.target_amount) || 300000000;

  // Filter months that are flagged public or relevant
  const validMonths = months.filter((m) => m && m.month_start);

  // Sort chronological
  validMonths.sort((a, b) => a.month_start.localeCompare(b.month_start));

  let totalActual = 0;
  const monthlyTrend: RevenueCalculations["monthlyTrend"] = [];

  for (const m of validMonths) {
    const actual = Number(m.actual_amount) || 0;
    const target = Number(m.target_amount) || 0;
    
    // Only accumulate if record has data
    totalActual += actual;

    const variance = actual - target;
    const variancePct = target > 0 ? (variance / target) * 100 : 0;

    monthlyTrend.push({
      month: formatMonthLabel(m.month_start),
      monthStart: m.month_start,
      actual,
      target,
      variance,
      variancePct: Math.round(variancePct * 10) / 10,
      hasData: m.actual_amount !== null && m.actual_amount !== undefined,
      note: m.note,
    });
  }

  const isTargetExceeded = totalActual > targetAmount;
  const remainingAmount = Math.max(0, targetAmount - totalActual);
  const rawPercentage = targetAmount > 0 ? (totalActual / targetAmount) * 100 : 0;
  const percentage = Math.round(rawPercentage * 10) / 10;

  return {
    targetAmount,
    totalActual,
    remainingAmount,
    percentage,
    isTargetExceeded,
    monthsCount: validMonths.length,
    lastUpdated: settings.updated_at || new Date().toISOString(),
    monthlyTrend,
  };
}
