import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "../../ui/Icon.tsx";
import { cartTotals } from "../cart.ts";
import { formatAMD } from "../format.ts";
import {
  emptyCheckout,
  orderNumber,
  PAYMENT_METHODS,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutForm,
} from "../order.ts";
import { useShop } from "../ShopContext.tsx";
import { Sheet } from "./common.tsx";

const PAY_COLORS: Record<string, string> = {
  card: "linear-gradient(135deg, #1e3c72, #2a5298)",
  idram: "linear-gradient(135deg, #f7971e, #ffb347)",
  telcell: "linear-gradient(135deg, #e52d27, #b31217)",
  cash: "linear-gradient(135deg, #3a7d44, #5fa868)",
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className={`s-field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.em initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.em>
        )}
      </AnimatePresence>
    </label>
  );
}

export function Checkout() {
  const { config, cart, dispatch, has, setPanel } = useShop();
  const [form, setForm] = useState<CheckoutForm>(() => ({
    ...emptyCheckout(),
    payment: has("payment") ? "card" : "cash",
  }));
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  const payTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(payTimer.current), []);
  const delivery = has("delivery");
  const method = delivery ? form.method : "pickup";
  const totals = cartTotals(cart, config.delivery, method);
  const needsDate = Boolean(config.delivery.needsDate);
  const online = has("payment") && form.payment !== "cash";

  const update = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (tried) setErrors(validateCheckout({ ...next, method }, { needsDate }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const found = validateCheckout({ ...form, method }, { needsDate });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const finish = () => {
      dispatch({ type: "clear" });
      setPanel({ type: "done", number: orderNumber(new Date()), total: totals.total, paid: online });
    };
    if (online) {
      setPaying(true);
      payTimer.current = window.setTimeout(finish, 1800);
    } else {
      finish();
    }
  };

  return (
    <Sheet label="Պատվերի ձևակերպում" onClose={() => setPanel({ type: "cart" })}>
      <form className="s-checkout" onSubmit={submit} noValidate>
        <h2>Պատվերի ձևակերպում</h2>
        <div className="s-checkout__grid">
          <div className="s-checkout__fields">
            <Field label="Անուն" error={errors.name}>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" placeholder="Անի" />
            </Field>
            <Field label="Հեռախոս" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="091 23 45 67"
              />
            </Field>
            {delivery && (
              <div className="s-segment" role="radiogroup" aria-label="Ստացման եղանակ">
                {(["delivery", "pickup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={form.method === m}
                    className={form.method === m ? "is-on" : ""}
                    onClick={() => update("method", m)}
                  >
                    {form.method === m && <motion.i layoutId="s-seg" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span>
                      <Icon name={m === "delivery" ? "truck" : "pin"} size={16} />
                      {m === "delivery" ? "Առաքում" : "Կվերցնեմ ինքս"}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {method === "delivery" ? (
              <Field label="Հասցե" error={errors.address}>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  autoComplete="street-address"
                  placeholder="Փողոց, շենք, բնակարան"
                />
              </Field>
            ) : (
              <p className="s-hint">
                <Icon name="pin" size={16} /> Խանութ՝ {config.delivery.pickup}, {config.contacts.hours}
              </p>
            )}
            {needsDate && (
              <Field label={method === "delivery" ? "Առաքման օր" : "Վերցնելու օր"} error={errors.date}>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </Field>
            )}
            <Field label="Մեկնաբանություն">
              <textarea
                rows={2}
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                placeholder="Օր.՝ զանգել 10 րոպե առաջ"
              />
            </Field>
          </div>
          <div className="s-checkout__side">
            {has("payment") ? (
              <div className="s-pay" role="radiogroup" aria-label="Վճարման եղանակ">
                <span className="s-label">Վճարում</span>
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={form.payment === m.id}
                    className={form.payment === m.id ? "is-on" : ""}
                    onClick={() => update("payment", m.id)}
                  >
                    <i style={{ background: PAY_COLORS[m.id] }}>
                      <Icon name={m.id === "cash" ? "box" : "card"} size={16} />
                    </i>
                    <span>
                      <b>{m.label}</b>
                      <small>{m.hint}</small>
                    </span>
                    <span className="s-radio" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="s-hint">
                <Icon name="card" size={16} /> Վճարումը՝ ստանալիս, կանխիկ կամ քարտով
              </p>
            )}
            <dl className="s-checkout__sum">
              <div>
                <dt>Ապրանքներ ({totals.count})</dt>
                <dd>{formatAMD(totals.subtotal)}</dd>
              </div>
              {delivery && (
                <div>
                  <dt>Առաքում</dt>
                  <dd>{totals.delivery ? formatAMD(totals.delivery) : "Անվճար"}</dd>
                </div>
              )}
              <div className="s-total">
                <dt>Ընդամենը</dt>
                <dd>{formatAMD(totals.total)}</dd>
              </div>
            </dl>
            <button className="s-btn s-btn--wide" type="submit" disabled={paying || cart.length === 0}>
              {online ? (
                <>
                  <Icon name="shield" size={18} /> Վճարել {formatAMD(totals.total)}
                </>
              ) : (
                <>
                  <Icon name="check" size={18} /> Հաստատել պատվերը
                </>
              )}
            </button>
            {online && <p className="s-secure">Վճարումը կատարվում է բանկի անվտանգ էջում</p>}
          </div>
        </div>
        <AnimatePresence>
          {paying && (
            <motion.div className="s-paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="s-spinner" />
              <p>Միացում բանկի անվտանգ էջին…</p>
              <small>Դեմո ռեժիմ՝ գումար չի գանձվում</small>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Sheet>
  );
}

export function OrderDone({ number, total, paid }: { number: string; total: number; paid: boolean }) {
  const { setPanel, config } = useShop();
  return (
    <Sheet label="Պատվերն ընդունված է" onClose={() => setPanel({ type: "none" })}>
      <div className="s-done">
        <svg viewBox="0 0 80 80" className="s-done__check" aria-hidden="true">
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M24 41 L35 52 L57 29"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </svg>
        <h2>Շնորհակալություն</h2>
        <p>
          Պատվեր <b>{number}</b>
          <br />
          {paid ? "Վճարված է" : "Վճարումը՝ ստանալիս"} · {formatAMD(total)}
        </p>
        <p className="s-muted">Մենք կզանգահարենք 15 րոպեի ընթացքում՝ հաստատելու համար։ Հարցերի դեպքում՝ {config.contacts.phone}</p>
        <p className="s-demo-note">Դեմո ռեժիմ՝ պատվերն իրականում չի ուղարկվել, վճարում չի կատարվել։</p>
        <button className="s-btn" onClick={() => setPanel({ type: "none" })}>
          Վերադառնալ խանութ
        </button>
      </div>
    </Sheet>
  );
}
