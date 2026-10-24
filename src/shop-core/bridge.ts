import type { ShopState } from "./types.ts";

// The studio page drives demo shops inside iframes with postMessage, so switching the business
// type or a checkbox updates the preview instantly instead of reloading the frame.

export type StudioToShop =
  | { source: "kayq-studio"; type: "shop-state"; state: ShopState }
  /** Smoothly scrolls the demo to a section id (or "top"); used by the hero's auto tour. */
  | { source: "kayq-studio"; type: "scroll-to"; target: string };

export interface ShopToStudio {
  source: "kayq-shop";
  type: "ready";
}

export function isStudioMessage(data: unknown): data is StudioToShop {
  if (typeof data !== "object" || data === null) return false;
  const msg = data as Partial<Record<"source" | "type" | "state" | "target", unknown>>;
  if (msg.source !== "kayq-studio") return false;
  if (msg.type === "shop-state") return typeof msg.state === "object" && msg.state !== null;
  return msg.type === "scroll-to" && typeof msg.target === "string";
}

export const isShopReady = (data: unknown): data is ShopToStudio =>
  typeof data === "object" && data !== null && (data as ShopToStudio).source === "kayq-shop";
