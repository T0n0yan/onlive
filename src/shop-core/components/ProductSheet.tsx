import { motion } from "motion/react";
import { useState } from "react";
import { ProductArt } from "../../art/ProductArt.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { defaultSelections, unitPrice, visibleOptions } from "../cart.ts";
import { formatAMD } from "../format.ts";
import { useShop } from "../ShopContext.tsx";
import type { OptionGroup, Product, Selections } from "../types.ts";
import { Price, QtyStepper, Sheet, StockBadge } from "./common.tsx";

const today = () => new Date().toISOString().slice(0, 10);

function OptionField({
  option,
  value,
  onChange,
}: {
  option: OptionGroup;
  value: string;
  onChange: (value: string) => void;
}) {
  if (option.kind === "choice") {
    const swatches = option.choices.some((c) => c.swatch);
    return (
      <fieldset className="s-option">
        <legend>
          {option.label}
          {swatches && <em>{option.choices.find((c) => c.id === value)?.label}</em>}
        </legend>
        <div className={swatches ? "s-swatches" : "s-chips"}>
          {option.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={value === c.id}
              className={value === c.id ? "is-on" : ""}
              onClick={() => onChange(c.id)}
              style={c.swatch ? { background: c.swatch } : undefined}
              aria-label={c.swatch ? c.label : undefined}
              title={c.swatch ? c.label : undefined}
            >
              {!c.swatch && (
                <>
                  {c.label}
                  {c.priceDelta ? <small>+{formatAMD(c.priceDelta)}</small> : null}
                </>
              )}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }
  if (option.kind === "text") {
    return (
      <label className="s-field">
        <span>
          {option.label}
          {option.priceDelta ? <small> · +{formatAMD(option.priceDelta)}</small> : null}
        </span>
        <input
          value={value}
          maxLength={option.maxLength}
          placeholder={option.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {option.maxLength && (
          <small className="s-field__count">
            {value.length}/{option.maxLength}
          </small>
        )}
      </label>
    );
  }
  return (
    <label className="s-field">
      <span>{option.label}</span>
      <input type="date" min={today()} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ProductBody({ product }: { product: Product }) {
  const { config, has, dispatch, setPanel, notify, stockOf } = useShop();
  const personal = has("custom");
  const options = visibleOptions(product, personal);
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(product, personal));
  const [qty, setQty] = useState(1);
  const stock = stockOf(product);
  const out = stock === "out";
  const price = unitPrice(product, selections);
  const base = options.filter((o) => !o.personal);
  const extra = options.filter((o) => o.personal);
  const category = config.categories.find((c) => c.id === product.category)?.label;

  const set = (id: string, value: string) => setSelections((s) => ({ ...s, [id]: value }));
  const add = () => {
    dispatch({ type: "add", product: { ...product, stock }, selections, qty });
    notify(`«${product.name}»՝ զամբյուղում`);
    setPanel({ type: "none" });
  };

  return (
    <div className="s-product">
      <motion.div
        className="s-product__media"
        style={{ background: product.tint }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <div className="s-float">
          <ProductArt art={product.art} />
        </div>
      </motion.div>
      <div className="s-product__info">
        {category && <span className="s-eyebrow">{category}</span>}
        <h2>{product.name}</h2>
        <div className="s-product__meta">
          <Price value={product.price} old={has("promo") ? product.oldPrice : undefined} unit={product.unit} />
          {has("stock") && <StockBadge stock={stock} />}
        </div>
        <p className="s-product__desc">{product.description ?? product.short}</p>
        {base.map((o) => (
          <OptionField key={o.id} option={o} value={selections[o.id] ?? ""} onChange={(v) => set(o.id, v)} />
        ))}
        {extra.length > 0 && (
          <div className="s-personal">
            <h3>
              <Icon name="sparkle" size={18} /> {config.copy.personalTitle}
            </h3>
            {extra.map((o) => (
              <OptionField key={o.id} option={o} value={selections[o.id] ?? ""} onChange={(v) => set(o.id, v)} />
            ))}
          </div>
        )}
        <div className="s-product__buy">
          {out ? (
            <button className="s-btn s-btn--ghost s-btn--wide" onClick={() => notify("Կտեղեկացնենք, երբ հասանելի լինի")}>
              <Icon name="clock" size={18} /> Տեղեկացնել, երբ լինի
            </button>
          ) : has("cart") ? (
            <>
              <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} />
              <button className="s-btn s-btn--wide" onClick={add}>
                {config.copy.addToCart} · {formatAMD(price * qty)}
              </button>
            </>
          ) : (
            <>
              <a className="s-btn s-btn--wide" href={`tel:${config.contacts.phone.replace(/\s/g, "")}`}>
                <Icon name="phone" size={18} /> Պատվիրել զանգով
              </a>
              <a className="s-btn s-btn--ghost s-btn--wide" href="#contacts" onClick={() => setPanel({ type: "none" })}>
                <Icon name="telegram" size={18} /> Գրել մեզ
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductSheet({ id }: { id: string }) {
  const { product, setPanel } = useShop();
  const p = product(id);
  if (!p) return null;
  return (
    <Sheet label={p.name} onClose={() => setPanel({ type: "none" })}>
      <ProductBody product={p} />
    </Sheet>
  );
}
