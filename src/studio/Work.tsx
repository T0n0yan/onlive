import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "../ui/Icon.tsx";
import { PROJECTS, type Project } from "./content.ts";
import { SplitText } from "./motion.tsx";

const MSHOTS = "https://s.wordpress.com/mshots/v1/";
const MAX_TRIES = 6;

/**
 * Live screenshot via WordPress mShots. The first request for a site returns a small placeholder
 * while the shot is generated, so we retry a few times and only show a real, full-size image.
 */
function Screenshot({ project }: { project: Project }) {
  const [tries, setTries] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const local = project.image ? `${import.meta.env.BASE_URL}${project.image}` : null;
  const src = local ?? `${MSHOTS}${encodeURIComponent(project.url)}?w=1280&h=960${tries ? `&try=${tries}` : ""}`;
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <img
      className={`shot ${loaded ? "is-loaded" : ""}`}
      src={src}
      alt={`${project.name} կայքի էկրանը`}
      loading="lazy"
      decoding="async"
      onLoad={(e) => {
        if (local || e.currentTarget.naturalWidth >= 1000) return setLoaded(true);
        if (tries < MAX_TRIES) timer.current = window.setTimeout(() => setTries((t) => t + 1), 3500);
      }}
      onError={() => {
        if (!local && tries < MAX_TRIES) timer.current = window.setTimeout(() => setTries((t) => t + 1), 3500);
      }}
    />
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const host = project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <motion.a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project"
      data-cursor="Բացել ↗"
      style={{ "--c1": project.colors[0], "--c2": project.colors[1] } as CSSProperties}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 70, damping: 16 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ref.current?.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`);
        ref.current?.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
    >
      <div className="project__frame">
        <div className="project__bar">
          <i />
          <i />
          <i />
          <span>{host}</span>
        </div>
        <div className="project__screen">
          <div className="project__cover" aria-hidden="true">
            <span>{project.name}</span>
          </div>
          <Screenshot project={project} />
        </div>
      </div>
      <div className="project__meta">
        <span className="project__num">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>
            {project.name} <Icon name="arrowUpRight" size={22} />
          </h3>
          <p className="project__kind">{project.kind}</p>
          <p>{project.text}</p>
          <ul>
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.a>
  );
}

/** On wide screens the projects slide sideways while the page scrolls down (pinned section). */
function useHorizontal() {
  const [wide, setWide] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

function HorizontalTrack() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progress = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="work__pin" ref={section} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="work__sticky">
        <motion.div className="work__track" ref={track} style={{ x }}>
          <div className="work__intro">
            <span className="eyebrow">Աշխատանքներ</span>
            <h2 className="section-title">
              <SplitText text="Իրական նախագծեր," inView />
              <br />
              <span className="muted">
                <SplitText text="իրական օգտատերեր" inView delay={0.2} />
              </span>
            </h2>
            <p>Կորպորատիվ կայքեր, պրոդուկտներ, պորտալներ և Telegram Mini App։ Սեղմեք ցանկացածի վրա՝ կայքը բացելու համար։</p>
            <span className="work__hint">
              Թերթեք ներքև <Icon name="arrowRight" size={18} />
            </span>
          </div>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </motion.div>
        <div className="work__progress">
          <motion.i style={{ width: progress }} />
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const wide = useHorizontal();
  return (
    <section className="work" id="work">
      {wide ? (
        <HorizontalTrack />
      ) : (
        <div className="container work__list">
          <div className="work__intro">
            <span className="eyebrow">Աշխատանքներ</span>
            <h2 className="section-title">
              <SplitText text="Իրական նախագծեր," inView />
              <br />
              <span className="muted">
                <SplitText text="իրական օգտատերեր" inView delay={0.2} />
              </span>
            </h2>
            <p>Կորպորատիվ կայքեր, պրոդուկտներ, պորտալներ և Telegram Mini App։</p>
          </div>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
