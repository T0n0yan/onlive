import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BRAND } from "../../brand.ts";
import { Icon } from "../../ui/Icon.tsx";
import { formatAMD } from "../format.ts";
import { useShop } from "../ShopContext.tsx";
import { Stars } from "./common.tsx";

const STUDIO_URL = import.meta.env.BASE_URL;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 110, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}

export function PromoStrip() {
  const { config } = useShop();
  const items = Array.from({ length: 6 }, () => config.copy.promoBanner);
  return (
    <div className="s-promo" aria-label={config.copy.promoBanner}>
      <div className="s-promo__track">
        {[...items, ...items].map((text, i) => (
          <span key={i} aria-hidden={i > 0}>
            <Icon name="sparkle" size={16} /> {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  const { config } = useShop();
  return (
    <section className="s-section s-section--alt" id="services">
      <div className="s-container">
        <div className="s-section__head">
          <h2>{config.copy.servicesTitle}</h2>
        </div>
        <div className="s-services">
          {config.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="s-service">
              <span className="s-service__icon">
                <Icon name={s.icon} size={22} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.price && <b>{s.price}</b>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Delivery() {
  const { config } = useShop();
  const d = config.delivery;
  return (
    <section className="s-section" id="delivery">
      <div className="s-container">
        <div className="s-section__head">
          <h2>Առաքում</h2>
          <p>{d.time}</p>
        </div>
        <div className="s-delivery">
          <Reveal className="s-delivery__card">
            <Icon name="truck" size={26} />
            <b>{formatAMD(d.fee)}</b>
            <span>{d.freeFrom ? `Անվճար՝ ${formatAMD(d.freeFrom)}-ից` : "Առաքման արժեք"}</span>
          </Reveal>
          <Reveal className="s-delivery__card" delay={0.06}>
            <Icon name="clock" size={26} />
            <b>{d.time.split("՝")[1]?.trim() ?? d.time}</b>
            <span>{d.time.split("՝")[0]}</span>
          </Reveal>
          <Reveal className="s-delivery__card" delay={0.12}>
            <Icon name="pin" size={26} />
            <b>Ինքնասպասարկում</b>
            <span>{d.pickup}</span>
          </Reveal>
        </div>
        <div className="s-zones">
          {d.zones.map((z) => (
            <span key={z}>{z}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const { config } = useShop();
  return (
    <section className="s-section s-section--alt" id="reviews">
      <div className="s-container">
        <div className="s-section__head">
          <h2>Կարծիքներ</h2>
          <p>Օրինակներ՝ դեմո տարբերակի համար</p>
        </div>
        <div className="s-reviews">
          {config.reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08} className="s-review">
              <Stars value={r.rating} />
              <p>«{r.text}»</p>
              <span>{r.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contacts() {
  const { config, name } = useShop();
  const c = config.contacts;
  return (
    <section className="s-section" id="contacts">
      <div className="s-container s-contacts">
        <Reveal className="s-contacts__info">
          <h2>Կապ</h2>
          <ul>
            <li>
              <Icon name="pin" /> {c.address}
            </li>
            <li>
              <Icon name="clock" /> {c.hours}
            </li>
            <li>
              <Icon name="phone" /> <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
            </li>
          </ul>
          <div className="s-socials">
            <a href="#contacts" aria-label="Telegram">
              <Icon name="telegram" />
            </a>
            <a href="#contacts" aria-label="WhatsApp">
              <Icon name="whatsapp" />
            </a>
            <a href="#contacts" aria-label="Email">
              <Icon name="mail" />
            </a>
          </div>
        </Reveal>
        <Reveal className="s-map" delay={0.1}>
          <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="400" height="260" className="s-map__bg" />
            <g className="s-map__blocks">
              {Array.from({ length: 24 }, (_, i) => (
                <rect key={i} x={(i % 6) * 70 - 10} y={Math.floor(i / 6) * 70 - 14} width="56" height="54" rx="6" />
              ))}
            </g>
            <path d="M-20 200 Q120 150 200 130 T420 60" className="s-map__road" />
            <path d="M150 -10 L190 280" className="s-map__road s-map__road--thin" />
            <circle cx="200" cy="130" r="26" className="s-map__pulse" />
          </svg>
          <div className="s-map__pin">
            <Icon name="pin" size={28} />
            <span>{name}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { name, config } = useShop();
  return (
    <footer className="s-footer">
      <div className="s-container s-footer__row">
        <div>
          <b className="s-logo">{name}</b>
          <p>{config.tagline}</p>
        </div>
        <p className="s-footer__credit">
          Դեմո կայք՝ պատրաստված{" "}
          <a href={STUDIO_URL} target="_top">
            {BRAND.name}
          </a>
          -ի կողմից։ Ապրանքներն ու կարծիքները ցուցադրական են։
        </p>
      </div>
    </footer>
  );
}

export function ChatButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="s-chat">
      <AnimatePresence>
        {open && (
          <motion.div
            className="s-chat__menu"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
          >
            <a href="#contacts" className="tg" onClick={() => setOpen(false)}>
              <Icon name="telegram" size={18} /> Telegram
            </a>
            <a href="#contacts" className="wa" onClick={() => setOpen(false)}>
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="s-chat__btn"
        aria-label="Գրել մեզ"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }}>
          <Icon name={open ? "close" : "chat"} size={24} />
        </motion.span>
      </motion.button>
    </div>
  );
}

export function Toast() {
  const { toast, has, setPanel } = useShop();
  return (
    <div className="s-toast-wrap" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            className="s-toast"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Icon name="check" size={18} />
            <span>{toast}</span>
            {has("cart") && toast.includes("զամբյուղ") && (
              <button onClick={() => setPanel({ type: "cart" })}>Բացել</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DemoPill() {
  return (
    <a className="s-demo-pill" href={STUDIO_URL} target="_top" title="Սա դեմո տարբերակ է">
      ԴԵՄՈ
    </a>
  );
}
