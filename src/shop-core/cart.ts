import type { CartLine, DeliveryInfo, OptionGroup, Product, Selections } from "./types.ts";

export const MAX_QTY = 99;

/** Options that count for this shop: personal ones only when the "custom" feature is on. */
export function visibleOptions(product: Product, personal: boolean): OptionGroup[] {
  return (product.options ?? []).filter((o) => personal || !o.personal);
}

/** First choice of every choice group, so a product can go to the cart in one tap. */
export function defaultSelections(product: Product, personal: boolean): Selections {
  const out: Selections = {};
  for (const option of visibleOptions(product, personal)) {
    if (option.kind === "choice" && option.choices[0]) out[option.id] = option.choices[0].id;
  }
  return out;
}

export function unitPrice(product: Product, selections: Selections): number {
  let price = product.price;
  for (const option of product.options ?? []) {
    const value = selections[option.id];
    if (!value) continue;
    if (option.kind === "choice") price += option.choices.find((c) => c.id === value)?.priceDelta ?? 0;
    if (option.kind === "text" && value.trim()) price += option.priceDelta ?? 0;
  }
  return price;
}

/** Human-readable summary of the picked options, e.g. "50 մլ · Նվերի տուփ". */
export function describeSelections(product: Product, selections: Selections): string {
  const parts: string[] = [];
  for (const option of product.options ?? []) {
    const value = selections[option.id]?.trim();
    if (!value) continue;
    if (option.kind === "choice") {
      const label = option.choices.find((c) => c.id === value)?.label;
      if (label) parts.push(label);
    } else if (option.kind === "text") {
      parts.push(`«${value}»`);
    } else {
      parts.push(value);
    }
  }
  return parts.join(" · ");
}

/** Same product with the same options is one line; different options are separate lines. */
export function lineKey(productId: string, selections: Selections): string {
  const sorted = Object.keys(selections)
    .filter((k) => selections[k]?.trim())
    .sort()
    .map((k) => `${k}=${selections[k]!.trim()}`);
  return [productId, ...sorted].join("|");
}

export type CartAction =
  | { type: "add"; product: Product; selections: Selections; qty?: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "replace"; lines: CartLine[] };

const clampQty = (qty: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      if (action.product.stock === "out") return lines;
      const key = lineKey(action.product.id, action.selections);
      const qty = clampQty(action.qty ?? 1);
      if (qty === 0) return lines;
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + qty) } : l));
      }
      return [
        ...lines,
        {
          key,
          productId: action.product.id,
          qty,
          selections: { ...action.selections },
          unitPrice: unitPrice(action.product, action.selections),
        },
      ];
    }
    case "setQty": {
      const qty = clampQty(action.qty);
      if (qty === 0) return lines.filter((l) => l.key !== action.key);
      return lines.map((l) => (l.key === action.key ? { ...l, qty } : l));
    }
    case "remove":
      return lines.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    case "replace":
      return action.lines;
  }
}

export type FulfilmentMethod = "delivery" | "pickup";

export interface CartTotals {
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  /** How much more to spend for free delivery; 0 when already free or not offered. */
  untilFree: number;
}

export function cartTotals(
  lines: readonly CartLine[],
  delivery: DeliveryInfo,
  method: FulfilmentMethod,
): CartTotals {
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const free = delivery.freeFrom !== undefined && subtotal >= delivery.freeFrom;
  const fee = method === "pickup" || count === 0 || free ? 0 : delivery.fee;
  const untilFree =
    method === "delivery" && delivery.freeFrom !== undefined && !free && count > 0
      ? delivery.freeFrom - subtotal
      : 0;
  return { count, subtotal, delivery: fee, total: subtotal + fee, untilFree };
}

/** Restores a saved cart, dropping anything malformed or no longer in the catalogue. */
export function restoreCart(raw: unknown, products: readonly Product[]): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const byId = new Map(products.map((p) => [p.id, p]));
  const out: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { productId, qty, selections } = item as Partial<CartLine>;
    const product = typeof productId === "string" ? byId.get(productId) : undefined;
    if (!product || product.stock === "out" || typeof qty !== "number") continue;
    const safeSelections: Selections = {};
    if (selections && typeof selections === "object") {
      for (const [k, v] of Object.entries(selections)) if (typeof v === "string") safeSelections[k] = v;
    }
    const restored = cartReducer(out, { type: "add", product, selections: safeSelections, qty });
    out.splice(0, out.length, ...restored);
  }
  return out;
}
