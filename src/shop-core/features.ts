import type { FeatureId } from "./types.ts";

export interface FeatureInfo {
  id: FeatureId;
  label: string;
  hint: string;
  group: "showcase" | "sales" | "info";
  /** Features that must be on for this one to work (cart needs a catalog, etc.). */
  requires?: FeatureId[];
}

export const FEATURES: FeatureInfo[] = [
  { id: "slider", group: "showcase", label: "Սլայդշոու", hint: "Գլխավոր էջի մեծ բաններներ" },
  { id: "catalog", group: "showcase", label: "Ապրանքների տեսականի", hint: "Քարտեր՝ գնով ու նկարով" },
  { id: "categories", group: "showcase", label: "Կատեգորիաներ", hint: "Ֆիլտր ըստ տեսակի", requires: ["catalog"] },
  { id: "search", group: "showcase", label: "Որոնում", hint: "Արագ գտնել ապրանքը", requires: ["catalog"] },
  { id: "stock", group: "showcase", label: "Հասանելի է / Հասանելի չէ", hint: "Առկայության նշում", requires: ["catalog"] },
  { id: "promo", group: "showcase", label: "Ակցիաներ ու զեղչեր", hint: "Հին գին, զեղչի բաններ", requires: ["catalog"] },
  { id: "favorites", group: "showcase", label: "Ընտրյալներ", hint: "Սրտիկով պահել", requires: ["catalog"] },
  { id: "custom", group: "sales", label: "Անհատական պատվեր", hint: "Մակագրություն, ամսաթիվ, չափս", requires: ["catalog"] },
  { id: "cart", group: "sales", label: "Զամբյուղ", hint: "Ավելացնել, փոխել քանակը", requires: ["catalog"] },
  { id: "checkout", group: "sales", label: "Պատվերի ձևակերպում", hint: "Անուն, հեռախոս, հասցե", requires: ["cart"] },
  { id: "payment", group: "sales", label: "Առցանց վճարում", hint: "Քարտ, Idram, Telcell", requires: ["checkout"] },
  { id: "delivery", group: "info", label: "Առաքում", hint: "Գոտիներ, ժամկետ, արժեք" },
  { id: "services", group: "info", label: "Ծառայություններ", hint: "Ինչ եք առաջարկում" },
  { id: "reviews", group: "info", label: "Կարծիքներ", hint: "Հաճախորդների գնահատականներ" },
  { id: "contacts", group: "info", label: "Կոնտակտներ ու քարտեզ", hint: "Հասցե, ժամեր, հեռախոս" },
  { id: "chat", group: "info", label: "Telegram / WhatsApp կոճակ", hint: "Գրել մեկ սեղմումով" },
];

const BY_ID = new Map(FEATURES.map((f) => [f.id, f]));
const ORDER = new Map(FEATURES.map((f, i) => [f.id, i]));

export const ALL_FEATURES: FeatureId[] = FEATURES.map((f) => f.id);

export function isFeatureId(value: string): value is FeatureId {
  return BY_ID.has(value as FeatureId);
}

/** Deduplicates, sorts and drops every feature whose requirements are missing (transitively). */
export function normalizeFeatures(list: readonly FeatureId[]): FeatureId[] {
  const on = new Set(list.filter(isFeatureId));
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of on) {
      if (BY_ID.get(id)?.requires?.some((r) => !on.has(r))) {
        on.delete(id);
        changed = true;
      }
    }
  }
  return [...on].sort((a, b) => ORDER.get(a)! - ORDER.get(b)!);
}

/** Turning a feature on also turns on what it needs; turning it off also turns off what needs it. */
export function toggleFeature(list: readonly FeatureId[], id: FeatureId): FeatureId[] {
  const on = new Set(list);
  if (on.has(id)) {
    on.delete(id);
    return normalizeFeatures([...on]);
  }
  const stack: FeatureId[] = [id];
  while (stack.length) {
    const next = stack.pop()!;
    if (on.has(next) && next !== id) continue;
    on.add(next);
    stack.push(...(BY_ID.get(next)?.requires ?? []));
  }
  return normalizeFeatures([...on]);
}
