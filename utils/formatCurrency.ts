export function formatPHP(
  amount: number | string,
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
) {
  const {
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) return "—";

  return new Intl.NumberFormat("en-PH", {
    style: showSymbol ? "currency" : "decimal",
    currency: "PHP",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
