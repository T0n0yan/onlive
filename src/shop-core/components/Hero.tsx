import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProductArt } from "../../art/ProductArt.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useShop } from "../ShopContext.tsx";

const SLIDE_MS = 5200;

/** Where up to three products sit in the hero composition (percent of the art box). */
const SPOTS = [
  [
    { left: 22, top: 8, size: 62, rotate: 0, z: 3 },
  ],
  [
    { left: 6, top: 18, size: 54, rotate: -6, z: 2 },
    { left: 40, top: 4, size: 58, rotate: 5, z: 3 },
  ],
  [
    { left: 26, top: 2, size: 56, rotate: 0, z: 3 },
    { left: 0, top: 30, size: 44, rotate: -8, z: 2 },
    { left: 56, top: 32, size: 42, rotate: 8, z: 2 },
  ],
];

const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

function HeroArt({ ids }: { ids: string[] }) {
  const { product } = useShop();
  const items = ids.map(product).filter((p) => p !== undefined).slice(0, 3);
  const spots = SPOTS[items.length - 1] ?? [];
  return (
    <div className="s-hero__art">
      {items.map((p, i) => {
        const spot = spots[i]!;
        return (
          <motion.div
            key={p.id}
            className="s-hero__item"
            style={{ left: `${spot.left}%`, top: `${spot.top}%`, width: `${spot.size}%`, zIndex: spot.z }}
            initial={{ opacity: 0, y: 60, rotate: spot.rotate - 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, rotate: spot.rotate, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.12 + i * 0.1 }}
          >
            <div className="s-float" style={{ animationDelay: `${i * -1.3}s` }}>
              <ProductArt art={p.art} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function HeroSlider() {
  const { config } = useShop();
  const slides = config.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index % slides.length]!;

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, slides.length]);

  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <section
      className="s-hero"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="s-hero__bg"
          style={{ background: slide.background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>
      <div className="s-container s-hero__inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="s-hero__text"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
            }}
          >
            {[
              <span className="s-eyebrow" key="e">{slide.eyebrow}</span>,
              <h1 key="t">{slide.title}</h1>,
              <p key="p">{slide.text}</p>,
              <button key="c" className="s-btn" onClick={scrollToCatalog}>
                {slide.cta}
                <Icon name="arrowRight" size={18} />
              </button>,
            ].map((node) => (
              <motion.div
                key={node.key}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              >
                {node}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <HeroArt key={index} ids={slide.products} />
        </AnimatePresence>
      </div>
      {slides.length > 1 && (
        <div className="s-container s-hero__controls">
          <div className="s-hero__dots">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} aria-label={`Սլայդ ${i + 1}`} className={i === index ? "is-on" : ""}>
                {i === index && (
                  <motion.i
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0.5 : 1 }}
                    transition={{ duration: paused ? 0.3 : SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="s-hero__arrows">
            <button className="s-iconbtn" onClick={() => go(-1)} aria-label="Նախորդը">
              <Icon name="arrowLeft" />
            </button>
            <button className="s-iconbtn" onClick={() => go(1)} aria-label="Հաջորդը">
              <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Without the slider feature: one calm intro block. */
export function StaticHero() {
  const { config, name, has } = useShop();
  const first = config.slides[0];
  return (
    <section className="s-hero s-hero--static" id="top">
      <div className="s-hero__bg" style={{ background: first?.background }} />
      <div className="s-container s-hero__inner">
        <motion.div
          className="s-hero__text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <span className="s-eyebrow">{config.tagline}</span>
          <h1>{name}</h1>
          <p>{first?.text}</p>
          {has("catalog") && (
            <button className="s-btn" onClick={scrollToCatalog}>
              {config.copy.catalogTitle}
              <Icon name="arrowRight" size={18} />
            </button>
          )}
        </motion.div>
        {first && <HeroArt ids={first.products} />}
      </div>
    </section>
  );
}
