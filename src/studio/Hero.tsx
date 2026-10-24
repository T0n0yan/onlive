import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ShopState } from "../shop-core/types.ts";
import { Icon } from "../ui/Icon.tsx";
import { VERTICALS } from "../verticals/index.ts";
import { ROTATING } from "./content.ts";
import { Magnetic, scrollToId, SplitText } from "./motion.tsx";
import { DeviceFrame, deviceSize } from "./ShopFrame.tsx";

const CYCLE_MS = 4600;

const NOTES = [
  { icon: "cart", title: "Նոր պատվեր", text: "2 ապրանք · 36 000 ֏" },
  { icon: "check", title: "Վճարված է", text: "Idram · հենց հիմա" },
  { icon: "truck", title: "Առաքում", text: "Ճանապարհին է · 25 րոպե" },
] as const;

function usePhoneScale() {
  const [scale, setScale] = useState(0.74);
  useLayoutEffect(() => {
    const update = () => {
      const { h, w } = deviceSize("phone");
      const byHeight = (window.innerHeight * 0.78) / h;
      const byWidth = (Math.min(window.innerWidth, 1400) * (window.innerWidth < 900 ? 0.72 : 0.3)) / w;
      setScale(Math.max(0.5, Math.min(0.82, byHeight, byWidth)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

export function Hero({ ready }: { ready: boolean }) {
  const [index, setIndex] = useState(0);
  const [scrollTarget, setScrollTarget] = useState("top");
  const scale = usePhoneScale();
  const rotating = ROTATING[index]!;

  useEffect(() => {
    if (!ready) return;
    setScrollTarget("top");
    const toCatalog = window.setTimeout(() => setScrollTarget("catalog"), 2000);
    const next = window.setTimeout(() => setIndex((i) => (i + 1) % ROTATING.length), CYCLE_MS);
    return () => {
      window.clearTimeout(toCatalog);
      window.clearTimeout(next);
    };
  }, [index, ready]);

  const state = useMemo<ShopState>(
    () => ({ vertical: rotating.vertical, features: VERTICALS[rotating.vertical].defaultFeatures }),
    [rotating.vertical],
  );

  // Phone tilts toward the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const section = useRef<HTMLElement>(null);

  return (
    <section
      className="hero"
      id="top"
      ref={section}
      onPointerMove={(e) => {
        const r = section.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
        section.current?.style.setProperty("--mx", `${e.clientX - r.left}px`);
        section.current?.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div className="hero__aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__spot" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__text">
          <motion.span
            className="pill"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <i className="pulse" /> Ընդունում ենք նոր պատվերներ
          </motion.span>
          <h1 className="hero__title">
            {ready && (
              <>
                <SplitText text="Կայքեր, որոնք" delay={0.15} />
                <br />
                <SplitText text="վաճառում են" delay={0.45} />
                <br />
              </>
            )}
            <span className="hero__rotator">
              <AnimatePresence mode="wait">
                {ready && (
                  <motion.span
                    key={rotating.word}
                    className="gradient-text"
                    initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: index === 0 ? 0.8 : 0 }}
                  >
                    {rotating.word}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </h1>
          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, type: "spring", stiffness: 100, damping: 18 }}
          >
            Առցանց խանութ՝ կատալոգով, զամբյուղով, պատվերով ու վճարումով։ Ձեր խանութի դեմոն ցույց կտանք հենց
            առաջին հանդիպմանը։
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.15, type: "spring", stiffness: 100, damping: 18 }}
          >
            <Magnetic>
              <button className="btn btn--primary" onClick={() => scrollToId("builder")} data-cursor="Սկսել">
                <Icon name="wand" size={18} /> Կառուցել դեմո
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn--ghost" onClick={() => scrollToId("work")}>
                Աշխատանքներ <Icon name="arrowRight" size={18} />
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="hero__device"
          initial={{ opacity: 0, y: 80, rotate: 6 }}
          animate={ready ? { opacity: 1, y: 0, rotate: 0 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 16 }}
          style={{ rotateX: rotX, rotateY: rotY }}
        >
          <div className="hero__glow" style={{ background: VERTICALS[rotating.vertical].theme.accent }} />
          <button
            className="hero__phone"
            onClick={() => scrollToId("builder")}
            data-cursor="Փորձել"
            aria-label="Բացել կոնստրուկտորը"
          >
            <DeviceFrame device="phone" state={state} scale={scale} interactive={false} eager scrollTarget={scrollTarget} />
          </button>
          {NOTES.map((n, i) => (
            <motion.div
              key={n.title}
              className={`note note--${i}`}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 1.3 + i * 0.25, type: "spring", stiffness: 180, damping: 14 }}
            >
              <span className="note__icon">
                <Icon name={n.icon} size={16} />
              </span>
              <span>
                <b>{n.title}</b>
                <small>{n.text}</small>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.button
        className="hero__scroll"
        onClick={() => scrollToId("work")}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
        aria-label="Ներքև"
      >
        <span />
      </motion.button>
    </section>
  );
}
