import { AnimatePresence, motion } from "motion/react";
import { ProductArt } from "../../art/ProductArt.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { cartTotals, describeSelections } from "../cart.ts";
import { formatAMD } from "../format.ts";
import { useShop } from "../ShopContext.tsx";
import { QtyStepper, Sheet } from "./common.tsx";

export function CartDrawer() {
  const { config, cart, dispatch, product, has, setPanel } = useShop();
  const totals = cartTotals(cart, config.delivery, "delivery");
  const close = () => setPanel({ type: "none" });
  const freeFrom = config.delivery.freeFrom;
  const progress = freeFrom ? Math.min(1, totals.subtotal / freeFrom) : 0;

  return (
    <Sheet label="Զամբյուղ" side="right" onClose={close}>
      <div className="s-cart">
        <h2>
          Զամբյուղ <span>{totals.count}</span>
        </h2>
        {cart.length === 0 ? (
          <div className="s-cart__empty">
            <div className="s-cart__emptyicon">
              <Icon name="cart" size={34} />
            </div>
            <p>{config.copy.emptyCart}</p>
            <button
              className="s-btn"
              onClick={() => {
                close();
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Դիտել տեսականին
            </button>
          </div>
        ) : (
          <>
            <ul className="s-cart__lines">
              <AnimatePresence initial={false}>
                {cart.map((line) => {
                  const p = product(line.productId);
                  if (!p) return null;
                  return (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                    >
                      <div className="s-cart__thumb" style={{ background: p.tint }}>
                        <ProductArt art={p.art} />
                      </div>
                      <div className="s-cart__info">
                        <strong>{p.name}</strong>
                        <small>{describeSelections(p, line.selections) || p.short}</small>
                        <div className="s-cart__row">
                          <QtyStepper value={line.qty} onChange={(qty) => dispatch({ type: "setQty", key: line.key, qty })} />
                          <b>{formatAMD(line.qty * line.unitPrice)}</b>
                        </div>
                      </div>
                      <button
                        className="s-iconbtn s-cart__remove"
                        aria-label="Հեռացնել"
                        onClick={() => dispatch({ type: "remove", key: line.key })}
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <div className="s-cart__summary">
              {has("delivery") && freeFrom !== undefined && (
                <div className="s-freebar">
                  <span>
                    {totals.untilFree > 0 ? (
                      <>
                        Մինչև անվճար առաքում՝ <b>{formatAMD(totals.untilFree)}</b>
                      </>
                    ) : (
                      <>
                        <Icon name="truck" size={16} /> Առաքումն անվճար է
                      </>
                    )}
                  </span>
                  <i>
                    <motion.b initial={false} animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                  </i>
                </div>
              )}
              <dl>
                <div>
                  <dt>Ապրանքներ</dt>
                  <dd>{formatAMD(totals.subtotal)}</dd>
                </div>
                {has("delivery") && (
                  <div>
                    <dt>Առաքում</dt>
                    <dd>{totals.delivery ? formatAMD(totals.delivery) : "Անվճար"}</dd>
                  </div>
                )}
                <div className="s-total">
                  <dt>Ընդամենը</dt>
                  <dd>{formatAMD(has("delivery") ? totals.total : totals.subtotal)}</dd>
                </div>
              </dl>
              {has("checkout") ? (
                <button className="s-btn s-btn--wide" onClick={() => setPanel({ type: "checkout" })}>
                  Ձևակերպել պատվերը <Icon name="arrowRight" size={18} />
                </button>
              ) : (
                <a className="s-btn s-btn--wide" href={`tel:${config.contacts.phone.replace(/\s/g, "")}`}>
                  <Icon name="phone" size={18} /> Պատվիրել զանգով
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
