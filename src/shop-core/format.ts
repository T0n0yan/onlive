/** 12500 → "12 500 ֏" (narrow no-break spaces, independent of the browser's Intl data). */
export function formatAMD(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "−" : "";
  const grouped = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${grouped} ֏`;
}

/** Percentage saved, rounded down, e.g. 20 for 10 000 → 8 000. */
export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.floor(((oldPrice - price) / oldPrice) * 100);
}
