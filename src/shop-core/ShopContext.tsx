import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { readableOn } from "../art/color.ts";
import { cartReducer, restoreCart, type CartAction } from "./cart.ts";
import { readJSON, writeJSON } from "./storage.ts";
import type { CartLine, FeatureId, Product, ShopState, Theme, VerticalConfig } from "./types.ts";

export type Panel =
  | { type: "none" }
  | { type: "product"; id: string }
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "done"; number: string; total: number; paid: boolean };

interface ShopContextValue {
  config: VerticalConfig;
  theme: Theme;
  name: string;
  has: (feature: FeatureId) => boolean;
  product: (id: string) => Product | undefined;
  cart: CartLine[];
  dispatch: (action: CartAction) => void;
  favorites: ReadonlySet<string>;
  toggleFavorite: (id: string) => void;
  panel: Panel;
  setPanel: (panel: Panel) => void;
  toast: string | null;
  notify: (message: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (on: boolean) => void;
  /** With the "stock" feature off the shop does not track stock, so everything is orderable. */
  stockOf: (product: Product) => Product["stock"];
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside <ShopProvider>");
  return value;
}

/**
 * Remount per vertical (key={vertical}) so the cart and favourites of one shop never leak into
 * another: initial state is read from storage once, and every change is written back.
 */
export function ShopProvider({
  config,
  state,
  children,
}: {
  config: VerticalConfig;
  state: ShopState;
  children: ReactNode;
}) {
  const cartKey = `kayq:cart:${config.id}`;
  const favKey = `kayq:fav:${config.id}`;
  const [cart, dispatch] = useReducer(cartReducer, undefined, () => restoreCart(readJSON(cartKey), config.products));
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(() => {
    const raw = readJSON(favKey);
    return new Set(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : []);
  });
  const [panel, setPanel] = useState<Panel>({ type: "none" });
  const [toast, setToast] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => writeJSON(cartKey, cart), [cartKey, cart]);
  useEffect(() => writeJSON(favKey, [...favorites]), [favKey, favorites]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const features = useMemo(() => new Set(state.features), [state.features]);
  const has = useCallback((f: FeatureId) => features.has(f), [features]);

  const theme = useMemo<Theme>(() => {
    if (!state.accent) return config.theme;
    return { ...config.theme, accent: state.accent, accentText: readableOn(state.accent) };
  }, [config.theme, state.accent]);

  const byId = useMemo(() => new Map(config.products.map((p) => [p.id, p])), [config.products]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value: ShopContextValue = {
    config,
    theme,
    name: state.name || config.defaultName,
    has,
    product: (id) => byId.get(id),
    cart,
    dispatch,
    favorites,
    toggleFavorite,
    panel,
    setPanel,
    toast,
    notify,
    favoritesOnly: favoritesOnly && features.has("favorites"),
    setFavoritesOnly,
    stockOf: (p) => (features.has("stock") ? p.stock : "in"),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
