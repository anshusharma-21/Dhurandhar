/**
 * Formats a number to Indian Currency notation:
 * - >= 10,000,000 (1 Crore): ₹X.XX Cr
 * - >= 100,000 (1 Lakh): ₹X.XX L
 * - Otherwise: ₹XX,XXX
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0";
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (compact) {
    if (abs >= 10000000) {
      const cr = abs / 10000000;
      const formattedCr = cr % 1 === 0 ? cr.toString() : cr.toFixed(2).replace(/\.?0+$/, "");
      return `${sign}₹${formattedCr} Cr`;
    }
    if (abs >= 100000) {
      const lakh = abs / 100000;
      const formattedLakh = lakh % 1 === 0 ? lakh.toString() : lakh.toFixed(2).replace(/\.?0+$/, "");
      return `${sign}₹${formattedLakh} L`;
    }
  }

  // Format with Indian comma grouping: 30,00,00,000
  const parts = abs.toFixed(2).split(".");
  let intPart = parts[0];
  const decPart = parts[1];

  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return decPart === "00" 
    ? `${sign}₹${formattedInt}` 
    : `${sign}₹${formattedInt}.${decPart}`;
}

/**
 * Format date in Asia/Kolkata timezone by default
 */
export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return "N/A";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return "Invalid date";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-IN", defaultOptions).format(date);
}

/**
 * Format month label (e.g. 2026-04-01 -> "Apr 2026")
 */
export function formatMonthLabel(monthStartString: string): string {
  if (!monthStartString) return "";
  const parts = monthStartString.split("-");
  if (parts.length < 2) return monthStartString;
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[monthNum - 1]} ${year}`;
}
