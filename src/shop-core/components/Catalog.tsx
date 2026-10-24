import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ProductArt } from "../../art/ProductArt.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { defaultSelections, visibleOptions } from "../cart.ts";
import { discountPercent } from "../format.ts";
import { useShop } from "../ShopContext.tsx";
import type { Product } from "../types.ts";
import { Price, StockBadge } from "./common.tsx";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { has, favorites, toggleFavorite, setPanel, dispatch, notify, stockOf } = useShop();
  const stock = stockOf(product);
  const out = stock === "out";
  const promo = has("promo");
  const sale = promo ? discountPercent(product.price, product.oldPrice) : 0;
  const isFav = favorites.has(product.id);
  const open = () => setPanel({ type: "product", id: product.id });

  const quickAdd = () => {
    if (visibleOptions(product, has("custom")).length > 0) return open();
    dispatch({ type: "add", product: { ...product, stock }, selections: defaultSelections(product, false) });
    notify(`«${product.name}»՝ զամբյուղում`);
  };

  return (
    <motion.article
      layout
      className={`s-card ${out ? "is-out" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: Math.min(index, 8) * 0.04 }}
    >
      <button className="s-card__media" style={{ background: product.tint }} onClick={open} aria-label={product.name}>
        <span className="s-card__art">
          <ProductArt art={product.art} />
        </span>
        <span className="s-card__badges">
          {product.badge && <span className="s-badge">{product.badge}</span>}
          {sale > 0 && <span className="s-badge s-badge--sale">−{sale}%</span>}
        </span>
        {has("stock") && <StockBadge stock={stock} />}
      </button>
      {has("favorites") && (
        <motion.button
          className={`s-fav ${isFav ? "is-on" : ""}`}
          aria-label="Ընտրյալներում"
          aria-pressed={isFav}
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleFavorite(product.id)}
        >
          <Icon name="heart" size={18} />
        </motion.button>
      )}
      <div className="s-card__body">
        <h3>
          <button onClick={open}>{product.name}</button>
        </h3>
        <p className="s-card__short">{product.short}</p>
        <div className="s-card__foot">
          <Price value={product.price} old={promo ? product.oldPrice : undefined} unit={product.unit} />
          {has("cart") && (
            <motion.button
              className="s-add"
              onClick={quickAdd}
              disabled={out}
              whileTap={{ scale: 0.88 }}
              aria-label={out ? "Հասանելի չէ" : "Ավելացնել զամբյուղ"}
            >
              {out ? <Icon name="close" size={18} /> : <Icon name="plus" size={18} />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Catalog() {
  const { config, has, favorites, favoritesOnly, setFavoritesOnly } = useShop();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return config.products.filter(
      (p) =>
        (!has("categories") || category === "all" || p.category === category) &&
        (!has("search") || !q || `${p.name} ${p.short}`.toLowerCase().includes(q)) &&
        (!favoritesOnly || favorites.has(p.id)),
    );
  }, [config.products, category, query, favoritesOnly, favorites, has]);

  const tabs = [{ id: "all", label: "Բոլորը" }, ...config.categories];

  return (
    <section className="s-section" id="catalog">
      <div className="s-container">
        <div className="s-section__head">
          <h2>{config.copy.catalogTitle}</h2>
          <p>{config.copy.catalogText}</p>
        </div>
        {(has("categories") || has("search")) && (
          <div className="s-toolbar">
            {has("categories") && (
              <div className="s-tabs" role="tablist">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={category === t.id}
                    className={category === t.id ? "is-on" : ""}
                    onClick={() => setCategory(t.id)}
                  >
                    {category === t.id && <motion.i layoutId="s-tab-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
            {has("search") && (
              <label className="s-search">
                <Icon name="search" size={18} />
                <input
                  id="s-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Որոնել…"
                  autoComplete="off"
                />
              </label>
            )}
          </div>
        )}
        {favoritesOnly && (
          <div className="s-note">
            <Icon name="heart" size={16} /> Միայն ընտրյալները
            <button onClick={() => setFavoritesOnly(false)}>Ցույց տալ բոլորը</button>
          </div>
        )}
        <motion.div layout className="s-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
        {visible.length === 0 && (
          <p className="s-empty">{favoritesOnly ? "Դեռ ընտրյալներ չունեք՝ սեղմեք ♡ ապրանքի վրա" : "Ոչինչ չգտնվեց"}</p>
        )}
      </div>
    </section>
  );
}
