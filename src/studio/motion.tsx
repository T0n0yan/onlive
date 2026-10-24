import Lenis from "lenis";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Fragment, useEffect, useRef, type ReactNode } from "react";

let lenis: Lenis | null = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth scrolling for the whole studio page; skipped for reduced motion and touch devices. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis = instance;
    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

/** Text that rises in letter by letter, word by word. */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.025,
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  let letterIndex = 0;
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
    : { animate: "show" };
  return (
    <motion.span className={`split ${className ?? ""}`} initial={reduce ? "show" : "hidden"} {...trigger} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={w}>
        <span className="split__word" aria-hidden="true">
          {Array.from(word).map((ch) => {
            const i = letterIndex++;
            return (
              <motion.span
                key={i}
                className="split__char"
                variants={{
                  hidden: { y: "110%", rotate: 8, opacity: 0 },
                  show: { y: "0%", rotate: 0, opacity: 1 },
                }}
                transition={{ type: "spring", stiffness: 160, damping: 18, delay: delay + i * stagger }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
        {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}

/** A whole line rising from a mask; used where per-letter spans would break a gradient fill. */
export function RevealLine({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="reveal-line">
      <motion.span
        className={className}
        initial={reduce ? false : { y: "110%", rotate: 4 }}
        whileInView={{ y: "0%", rotate: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 14, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Custom cursor: a dot plus a lagging ring that grows and shows a label over [data-cursor]. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const label = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, input, label");
      const text = target?.getAttribute("data-cursor") ?? "";
      ring.current?.classList.toggle("is-hover", Boolean(target));
      ring.current?.classList.toggle("is-label", Boolean(text));
      if (label.current) label.current.textContent = text;
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    // Demo shops live in iframes, which swallow pointer events: park the cursor while over one.
    const over = (e: PointerEvent) => {
      if ((e.target as Element | null)?.tagName === "IFRAME") leave();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div className="cursor-ring" ref={ring} style={{ x: ringX, y: ringY }}>
        <span ref={label} />
      </motion.div>
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  );
}

/** Counts from 0 to `to` once the element scrolls into view. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = `${Math.round(to * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
