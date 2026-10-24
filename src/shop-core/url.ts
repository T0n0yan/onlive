import { isFeatureId, normalizeFeatures } from "./features.ts";
import type { FeatureId, ShopState, VerticalId } from "./types.ts";

const HEX = /^[0-9a-f]{6}$/i;
const MAX_NAME = 40;

/** ShopState → "v=cake&f=slider,catalog&name=…&accent=ff6b4a" (no leading "?"). */
export function encodeShopState(state: ShopState): string {
  const params = new URLSearchParams();
  params.set("v", state.vertical);
  params.set("f", normalizeFeatures(state.features).join(","));
  const name = state.name?.trim();
  if (name) params.set("name", name.slice(0, MAX_NAME));
  const accent = state.accent?.replace("#", "");
  if (accent && HEX.test(accent)) params.set("accent", accent.toLowerCase());
  return params.toString();
}

/**
 * Parses a demo URL. Unknown verticals fall back to the first one, a missing feature list uses the
 * vertical's defaults, and bad values are dropped rather than trusted.
 */
export function decodeShopState(
  search: string,
  verticals: readonly VerticalId[],
  defaultsFor: (v: VerticalId) => FeatureId[],
): ShopState {
  const params = new URLSearchParams(search);
  const rawVertical = params.get("v") ?? "";
  const vertical = (verticals as readonly string[]).includes(rawVertical)
    ? (rawVertical as VerticalId)
    : verticals[0]!;
  const rawFeatures = params.get("f");
  const features =
    rawFeatures === null
      ? defaultsFor(vertical)
      : normalizeFeatures(rawFeatures.split(",").filter(isFeatureId));
  const name = params.get("name")?.trim().slice(0, MAX_NAME) || undefined;
  const accent = params.get("accent") ?? "";
  return { vertical, features, name, accent: HEX.test(accent) ? `#${accent.toLowerCase()}` : undefined };
}
