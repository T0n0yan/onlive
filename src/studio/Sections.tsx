import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BRAND } from "../brand.ts";
import { Icon, type IconId } from "../ui/Icon.tsx";
import { MARQUEE, PROCESS, SERVICES, STATS, WHY } from "./content.ts";
import { CountUp, Magnetic, prefersReducedMotion, RevealLine, scrollToId, SplitText } from "./motion.tsx";

/* ---------- preloader ---------- */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setCount(Math.round((1 - (1 - t) ** 3) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        window.setTimeout(onDone, 350);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="preloader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="preloader__brand"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {BRAND.name}
          </motion.span>
          <span className="preloader__count">{count}</span>
          <i className="preloader__bar" style={{ transform: `scaleX(${count / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- nav ---------- */

const NAV = [
  { id: "work", label: "Աշխատանքներ" },
  { id: "services", label: "Ծառայություններ" },
  { id: "builder", label: "Կոնստրուկտոր" },
  { id: "process", label: "Ընթացք" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setSolid(y > 40);
  });
  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      className={`nav ${solid ? "is-solid" : ""} ${open ? "is-open" : ""}`}
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <div className="nav__inner">
        <button className="nav__brand" onClick={() => go("top")}>
          <span className="nav__logo">O</span>
          {BRAND.name}
        </button>
        <nav className="nav__links">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button className="btn btn--small" onClick={() => go("contact")}>
          Կապ <Icon name="arrowUpRight" size={16} />
        </button>
        <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="Մենյու" aria-expanded={open}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {[...NAV, { id: "contact", label: "Կապ" }].map((n, i) => (
              <motion.button
                key={n.id}
                onClick={() => go(n.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                {n.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

/* ---------- marquee ---------- */

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(useTransform(velocity, [-2000, 0, 2000], [8, 0, -8]), { stiffness: 200, damping: 40 });
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <motion.div className={`marquee__row ${reverse ? "is-reverse" : ""}`} style={{ skewX: skew }}>
      <div className="marquee__track">
        {items.map((t, i) => (
          <span key={i} aria-hidden={i >= MARQUEE.length}>
            {t}
            <Icon name="sparkle" size={28} />
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Marquee() {
  return (
    <section className="marquee" aria-label="Ում համար ենք աշխատում">
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
}

/* ---------- stats ---------- */

export function Stats() {
  return (
    <section className="stats container">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          className="stat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 16 }}
        >
          <b>
            <CountUp to={s.value} suffix={s.suffix} />
          </b>
          <span>{s.label}</span>
        </motion.div>
      ))}
    </section>
  );
}

/* ---------- services ---------- */

function spotlight(e: ReactPointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
}

function MiniCart() {
  const rows = [
    { name: "Velours Rose · 50 մլ", price: "51 000 ֏", c: "#e8a1b5" },
    { name: "Ելակային երազանք · 2 կգ", price: "36 000 ֏", c: "#e2445f" },
    { name: "Պիոնների փունջ", price: "32 000 ֏", c: "#f2a7b8" },
  ];
  return (
    <div className="minicart" aria-hidden="true">
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          className="minicart__row"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 120, damping: 16 }}
        >
          <i style={{ background: r.c }} />
          <span>{r.name}</span>
          <b>{r.price}</b>
        </motion.div>
      ))}
      <motion.div
        className="minicart__pay"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.85 }}
      >
        <span>
          <Icon name="shield" size={16} /> Վճարել
        </span>
        <b>119 000 ֏</b>
      </motion.div>
    </div>
  );
}

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ծառայություններ</span>
          <h2 className="section-title">
            <SplitText text="Ամեն ինչ՝ գաղափարից" inView />
            <br />
            <span className="muted">
              <SplitText text="մինչև առաջին պատվերը" inView delay={0.2} />
            </span>
          </h2>
        </div>
        <div className="bento">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.title}
              className={`bento__card ${"wide" in s && s.wide ? "is-wide" : ""}`}
              onPointerMove={spotlight}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, type: "spring", stiffness: 90, damping: 16 }}
            >
              <span className="bento__icon">
                <Icon name={s.icon as IconId} size={24} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {i === 0 && <MiniCart />}
              {i === SERVICES.length - 1 && (
                <div className="bento__chart" aria-hidden="true">
                  {[38, 52, 46, 64, 58, 76, 70, 92].map((h, k) => (
                    <motion.i
                      key={k}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.06, type: "spring", stiffness: 120, damping: 14 }}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- why a website ---------- */

export function Why() {
  return (
    <section className="why">
      <div className="container why__inner">
        <div className="why__head">
          <span className="eyebrow">Ինչու կայք</span>
          <h2 className="section-title">
            <SplitText text="Instagram-ը ցուցափեղկ է." inView />
            <br />
            <RevealLine text="Կայքը՝ խանութ։" className="gradient-text" delay={0.25} />
          </h2>
        </div>
        <ol className="why__list">
          {WHY.map((w, i) => (
            <motion.li
              key={w.title}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 90, damping: 16 }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- process ---------- */

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section className="process" id="process">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ընթացք</span>
          <h2 className="section-title">
            <SplitText text="Չորս քայլ" inView />{" "}
            <span className="muted">
              <SplitText text="մինչև թողարկում" inView delay={0.15} />
            </span>
          </h2>
        </div>
        <div className="steps" ref={ref}>
          <div className="steps__line">
            <motion.i style={{ scaleY: line }} />
          </div>
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.title}
              className="step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
            >
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

function contactLinks() {
  const c = BRAND.contacts;
  return [
    c.telegram && { icon: "telegram" as const, label: "Telegram", href: `https://t.me/${c.telegram.replace(/^@/, "")}` },
    c.whatsapp && { icon: "whatsapp" as const, label: "WhatsApp", href: `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` },
    c.phone && { icon: "phone" as const, label: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    c.email && { icon: "mail" as const, label: c.email, href: `mailto:${c.email}` },
  ].filter((x): x is { icon: "telegram" | "whatsapp" | "phone" | "mail"; label: string; href: string } => Boolean(x));
}

export function Contact() {
  const links = contactLinks();
  const primary = links[0];
  return (
    <section className="contact" id="contact">
      <div className="contact__aurora" aria-hidden="true" />
      <div className="container contact__inner">
        <span className="eyebrow">Կապ</span>
        <h2 className="contact__title">
          <SplitText text="Եկեք ձեր խանութը" inView stagger={0.02} />
          <br />
          <RevealLine text="տանենք օնլայն" className="gradient-text" delay={0.3} />
        </h2>
        <p>Գրեք մեզ, և նույն օրը ցույց կտանք ձեր կայքի դեմոն՝ ձեր անունով ու գույներով։</p>
        <div className="contact__actions">
          <Magnetic strength={0.4}>
            {primary ? (
              <a className="orb" href={primary.href} target="_blank" rel="noopener" data-cursor="Գրել">
                <Icon name={primary.icon} size={28} />
                <span>Գրել մեզ</span>
              </a>
            ) : (
              <button className="orb" onClick={() => scrollToId("builder")} data-cursor="Սկսել">
                <Icon name="wand" size={28} />
                <span>Կառուցել դեմո</span>
              </button>
            )}
          </Magnetic>
          {links.length > 0 && (
            <ul className="contact__links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener">
                    <Icon name={l.icon} size={20} /> {l.label}
                    <Icon name="arrowUpRight" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">{BRAND.name}</span>
        <span>
          Կայքեր ու առցանց խանութներ · {BRAND.city} · {new Date().getFullYear()}
        </span>
        <button onClick={() => scrollToId("top")}>
          Վերև <Icon name="arrowUpRight" size={16} />
        </button>
      </div>
      <div className="footer__giant" aria-hidden="true">
        {BRAND.short}
      </div>
    </footer>
  );
}
