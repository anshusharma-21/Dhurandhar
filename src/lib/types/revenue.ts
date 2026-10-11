export type RevenueBasis = "cumulative" | "financial_year";
export type RevenueDefinition = "recognised" | "invoiced" | "cash_collected";
export type GSTTreatment = "included" | "excluded";
export type RevenueVisibility = "public_detailed" | "public_summary" | "private";

export interface RevenueSettings {
  id: number;
  goal_label: string;
  target_amount: number;
  target_start: string;
  target_end: string;
  target_basis: RevenueBasis;
  revenue_definition: RevenueDefinition;
  gst_treatment: GSTTreatment;
  visibility: RevenueVisibility;
  public_summary_mode: string;
  notes?: string;
  updated_by?: string;
  updated_at: string;
}

export interface RevenueMonth {
  id: string;
  month_start: string; // ISO format: YYYY-MM-01
  actual_amount: number;
  target_amount: number;
  note?: string;
  public_visibility: boolean;
  updated_by?: string;
  updated_at: string;
}

export interface RevenueMilestone {
  id: string;
  title: string;
  description?: string;
  milestone_date: string;
  visibility: boolean;
  sort_order: number;
  created_at: string;
}

export interface RevenueCalculations {
  targetAmount: number;
  totalActual: number;
  remainingAmount: number;
  percentage: number;
  isTargetExceeded: boolean;
  monthsCount: number;
  lastUpdated: string;
  monthlyTrend: {
    month: string; // e.g. "Apr 2026"
    monthStart: string;
    actual: number;
    target: number;
    variance: number;
    variancePct: number;
    hasData: boolean;
    note?: string;
  }[];
}
