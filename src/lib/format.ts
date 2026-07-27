let currentCurrency = "USD";
const listeners = new Set<() => void>();

export function setAppCurrency(c: string) {
  currentCurrency = c;
  listeners.forEach((l) => l());
}
export function getAppCurrency() {
  return currentCurrency;
}
export function subscribeCurrency(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function formatCurrency(value: number, currency = currentCurrency): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Rent & Utilities",
  "Groceries",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Subscriptions",
  "Travel",
  "Other",
] as const;

export const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Gift",
  "Other",
] as const;

export const INVESTMENT_TYPES = [
  "Stocks",
  "Mutual Funds",
  "ETF",
  "Crypto",
  "Real Estate",
  "Bonds",
  "Gold",
  "Fixed Deposit",
  "Other",
] as const;

export const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "CNY", label: "Chinese Yuan (¥)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "BRL", label: "Brazilian Real (R$)" },
] as const;
