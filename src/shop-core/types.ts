// Shared storefront model. Every vertical (perfume, cakes, flowers…) is only data that fits
// these types; all behaviour lives in shop-core, so a new shop type never needs new logic.

export type VerticalId = "perfume" | "cake" | "flowers" | "fashion" | "grocery";

export type FeatureId =
  | "slider"
  | "catalog"
  | "categories"
  | "search"
  | "stock"
  | "promo"
  | "favorites"
  | "custom"
  | "cart"
  | "checkout"
  | "payment"
  | "delivery"
  | "services"
  | "reviews"
  | "contacts"
  | "chat";

/** in: available, low: few left, out: sold out, preorder: made to order. */
export type StockStatus = "in" | "low" | "out" | "preorder";

export interface Choice {
  id: string;
  label: string;
  /** Added to the product's base price when picked. */
  priceDelta?: number;
  /** CSS colour shown as a swatch instead of a text chip. */
  swatch?: string;
}

interface OptionBase {
  id: string;
  label: string;
  /** Personal options (engraving, cake inscription, date) only show with the "custom" feature. */
  personal?: boolean;
}

export type OptionGroup =
  | (OptionBase & { kind: "choice"; choices: Choice[] })
  | (OptionBase & { kind: "text"; placeholder?: string; maxLength?: number; priceDelta?: number })
  | (OptionBase & { kind: "date" });

/** Selected value per option group id: a choice id, free text or an ISO date. */
export type Selections = Record<string, string>;

export type ArtSpec =
  | {
      kind: "perfume";
      shape: "round" | "square" | "tall" | "flask";
      liquid: string;
      cap: "gold" | "black" | "silver" | "wood";
    }
  | {
      kind: "cake";
      tiers: 1 | 2 | 3;
      cream: string;
      accent: string;
      topping: "berries" | "candles" | "flowers" | "drip" | "macarons";
    }
  | { kind: "flowers"; flower: "rose" | "tulip" | "daisy" | "peony"; colors: string[]; wrap: string }
  | {
      kind: "fashion";
      garment: "tee" | "dress" | "hoodie" | "jacket" | "pants" | "bag";
      color: string;
      accent?: string;
    }
  | {
      kind: "grocery";
      item: "apple" | "bread" | "milk" | "cheese" | "honey" | "coffee" | "tomato" | "lemon";
    };

export interface Product {
  id: string;
  name: string;
  category: string;
  /** Base price in AMD. */
  price: number;
  /** Crossed-out price, shown only with the "promo" feature. */
  oldPrice?: number;
  stock: StockStatus;
  short: string;
  description?: string;
  badge?: string;
  /** Background tint behind the illustration. */
  tint: string;
  art: ArtSpec;
  options?: OptionGroup[];
  unit?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface Slide {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  /** Product ids drawn in the slide. */
  products: string[];
  background: string;
}

export type IconName =
  | "gift"
  | "truck"
  | "sparkle"
  | "chat"
  | "clock"
  | "heart"
  | "star"
  | "shield"
  | "brush"
  | "calendar"
  | "leaf"
  | "scissors"
  | "box"
  | "card";

export interface Service {
  icon: IconName;
  title: string;
  text: string;
  price?: string;
}

export interface Review {
  name: string;
  text: string;
  rating: number;
}

export interface DeliveryInfo {
  fee: number;
  /** Subtotal from which delivery is free. */
  freeFrom?: number;
  time: string;
  zones: string[];
  pickup: string;
  /** Ask for a delivery date at checkout (cakes, flowers). */
  needsDate?: boolean;
}

export interface Theme {
  dark: boolean;
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  accentText: string;
  radius: number;
  fontDisplay: string;
  fontBody: string;
  /** Uppercase + tracking for headings (editorial look). */
  displayCaps?: boolean;
}

/** Vertical-specific wording; everything else in the UI is shared. */
export interface ShopCopy {
  catalogTitle: string;
  catalogText: string;
  addToCart: string;
  personalTitle: string;
  promoBanner: string;
  servicesTitle: string;
  emptyCart: string;
}

export interface VerticalConfig {
  id: VerticalId;
  label: string;
  emoji: string;
  defaultName: string;
  tagline: string;
  theme: Theme;
  /** Accent colours offered in the generator. */
  accents: string[];
  categories: Category[];
  products: Product[];
  slides: Slide[];
  services: Service[];
  reviews: Review[];
  delivery: DeliveryInfo;
  contacts: { address: string; hours: string; phone: string };
  copy: ShopCopy;
  defaultFeatures: FeatureId[];
}

/** What the generator controls; serialised into the demo URL. */
export interface ShopState {
  vertical: VerticalId;
  features: FeatureId[];
  name?: string;
  accent?: string;
}

export interface CartLine {
  key: string;
  productId: string;
  qty: number;
  selections: Selections;
  unitPrice: number;
}
