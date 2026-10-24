import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { FEATURES, normalizeFeatures, toggleFeature } from "../shop-core/features.ts";
import type { FeatureId, ShopState, VerticalId } from "../shop-core/types.ts";
import { Icon } from "../ui/Icon.tsx";
import { VERTICAL_IDS, VERTICALS } from "../verticals/index.ts";
import { SplitText } from "./motion.tsx";
import { DeviceFrame, deviceSize, DEVICES, shopUrl, type DeviceId } from "./ShopFrame.tsx";

type View = DeviceId | "all";

const VIEWS: { id: View; label: string; icon: "phoneDevice" | "tablet" | "desktop" | "devices" }[] = [
  { id: "phone", label: "Հեռախոս", icon: "phoneDevice" },
  { id: "tablet", label: "Պլանշետ", icon: "tablet" },
  { id: "desktop", label: "Համակարգիչ", icon: "desktop" },
  { id: "all", label: "Բոլորը", icon: "devices" },
];

const GROUPS = [
  { id: "showcase", title: "Ցուցափեղկ" },
  { id: "sales", title: "Վաճառք" },
  { id: "info", title: "Տեղեկատվություն" },
] as const;

const MINIMAL: FeatureId[] = ["catalog", "stock", "contacts", "chat"];

function useStageSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 640 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

const fit = (device: DeviceId, w: number, h: number) => {
  const s = deviceSize(device);
  return Math.min(w / s.w, h / s.h, 1);
};

function Stage({ view, state }: { view: View; state: ShopState }) {
  const [ref, size] = useStageSize();
  const w = size.w;
  const h = size.h;

  // One stable element carries the ResizeObserver; only its content changes with the view.
  return (
    <div className={`stage ${view === "all" ? "stage--all" : ""}`} ref={ref}>
      <AnimatePresence mode="wait">
        {view === "all" ? (
          <motion.div
            key="all"
            className="stage__all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DeviceFrame device="desktop" state={state} scale={fit("desktop", w * 0.86, h * 0.8)} className="all-desktop" eager />
            <DeviceFrame device="tablet" state={state} scale={fit("tablet", w * 0.3, h * 0.72)} className="all-tablet" eager />
            <DeviceFrame device="phone" state={state} scale={fit("phone", w * 0.17, h * 0.6)} className="all-phone" eager />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <DeviceFrame device={view} state={state} scale={fit(view, w, h)} eager />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Generator() {
  const [vertical, setVertical] = useState<VerticalId>("perfume");
  const [features, setFeatures] = useState<FeatureId[]>(VERTICALS.perfume.defaultFeatures);
  const [name, setName] = useState("");
  const [accent, setAccent] = useState<string | undefined>(undefined);
  const [view, setView] = useState<View>("phone");
  const [copied, setCopied] = useState(false);
  const config = VERTICALS[vertical];

  const state = useMemo<ShopState>(
    () => ({ vertical, features: normalizeFeatures(features), name: name.trim() || undefined, accent }),
    [vertical, features, name, accent],
  );
  const link = useMemo(() => new URL(shopUrl(state), window.location.href).href, [state]);

  const pickVertical = (id: VerticalId) => {
    setVertical(id);
    setFeatures(VERTICALS[id].defaultFeatures);
    setAccent(undefined);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Պատճենեք հղումը", link);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareText = `${state.name ?? config.defaultName}՝ ձեր առցանց խանութի դեմոն`;

  return (
    <section className="builder" id="builder">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Դեմո-կոնստրուկտոր</span>
          <h2 className="section-title">
            <SplitText text="Ընտրեք բիզնեսը." inView />
            <br />
            <span className="muted">
              <SplitText text="Ստացեք կայքը։" inView delay={0.2} />
            </span>
          </h2>
          <p>
            Նշեք, թե ինչ է պետք խանութին, և անմիջապես տեսեք կայքը հեռախոսում, պլանշետում ու համակարգչում։ Բոլոր
            կոճակները աշխատում են՝ զամբյուղ, պատվեր, վճարում։
          </p>
        </div>

        <div className="builder__layout">
          <aside className="panel">
            <div className="panel__block">
              <span className="panel__label">1 · Բիզնեսի տեսակ</span>
              <div className="verticals">
                {VERTICAL_IDS.map((id) => (
                  <button
                    key={id}
                    className={id === vertical ? "is-on" : ""}
                    onClick={() => pickVertical(id)}
                    aria-pressed={id === vertical}
                  >
                    {id === vertical && <motion.i layoutId="vertical-pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <span className="verticals__emoji">{VERTICALS[id].emoji}</span>
                    <span>{VERTICALS[id].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel__block panel__row">
              <label className="panel__field">
                <span className="panel__label">2 · Խանութի անունը</span>
                <input
                  value={name}
                  maxLength={40}
                  placeholder={config.defaultName}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <div className="panel__field">
                <span className="panel__label">3 · Գույն</span>
                <div className="swatches">
                  {config.accents.map((c, i) => {
                    const on = (accent ?? config.theme.accent) === c || (!accent && i === 0);
                    return (
                      <button
                        key={c}
                        style={{ background: c }}
                        className={on ? "is-on" : ""}
                        aria-label={`Գույն ${c}`}
                        aria-pressed={on}
                        onClick={() => setAccent(i === 0 ? undefined : c)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="panel__block">
              <div className="panel__head">
                <span className="panel__label">4 · Ինչ է պետք</span>
                <span className="presets">
                  <button onClick={() => setFeatures(FEATURES.map((f) => f.id))}>Բոլորը</button>
                  <button onClick={() => setFeatures(MINIMAL)}>Մինիմալ</button>
                </span>
              </div>
              {GROUPS.map((g) => (
                <div key={g.id} className="features">
                  <small>{g.title}</small>
                  <div>
                    {FEATURES.filter((f) => f.group === g.id).map((f) => {
                      const on = state.features.includes(f.id);
                      return (
                        <motion.button
                          key={f.id}
                          className={`feature ${on ? "is-on" : ""}`}
                          onClick={() => setFeatures((list) => toggleFeature(normalizeFeatures(list), f.id))}
                          aria-pressed={on}
                          title={f.hint}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="feature__box">
                            <AnimatePresence>
                              {on && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Icon name="check" size={13} strokeWidth={3} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                          {f.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="panel__note">
                Վճարումը միացնելիս ինքնաբերաբար միանում են զամբյուղն ու պատվերը։ Միացված է՝{" "}
                <b>
                  {state.features.length}/{FEATURES.length}
                </b>
              </p>
            </div>

            <div className="panel__actions">
              <a className="btn btn--primary" href={link} target="_blank" rel="noopener" data-cursor="Բացել">
                <Icon name="external" size={18} /> Բացել ամբողջ էկրանով
              </a>
              <button className="btn btn--ghost" onClick={copy}>
                <Icon name={copied ? "check" : "copy"} size={18} /> {copied ? "Պատճենված է" : "Պատճենել հղումը"}
              </button>
              <a
                className="btn btn--ghost"
                href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener"
              >
                <Icon name="telegram" size={18} /> Ուղարկել Telegram-ով
              </a>
            </div>
          </aside>

          <div className="preview">
            <LayoutGroup>
              <div className="views" role="tablist" aria-label="Սարք">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    role="tab"
                    aria-selected={view === v.id}
                    className={view === v.id ? "is-on" : ""}
                    onClick={() => setView(v.id)}
                  >
                    {view === v.id && <motion.i layoutId="view-pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <Icon name={v.icon} size={18} />
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <Stage view={view} state={state} />
            <p className="preview__caption">
              {view === "all"
                ? "Նույն կայքը՝ երեք էկրանի վրա"
                : `${DEVICES[view].label} · ${DEVICES[view].w}×${DEVICES[view].h}`}{" "}
              · կարող եք սեղմել, ավելացնել զամբյուղ ու ձևակերպել պատվեր
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
