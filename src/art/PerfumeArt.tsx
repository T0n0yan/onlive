import { useId } from "react";
import type { ArtSpec } from "../shop-core/types.ts";
import { shade } from "./color.ts";

type Spec = Extract<ArtSpec, { kind: "perfume" }>;

const CAPS: Record<Spec["cap"], [string, string, string]> = {
  gold: ["#f8e6a8", "#b8862f", "#f2d68c"],
  black: ["#4a4a4a", "#0b0b0b", "#2a2a2a"],
  silver: ["#fafafa", "#9b9ea3", "#e3e5e8"],
  wood: ["#b98451", "#5e3b1c", "#9a6a3c"],
};

interface Geometry {
  body: string;
  /** Top of the liquid; above it the glass is empty. */
  level: number;
  top: number;
  neck: [number, number, number, number];
  cap: { x: number; y: number; w: number; h: number; r: number };
  label: { x: number; y: number; w: number; h: number };
}

const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;

const SHAPES: Record<Spec["shape"], Geometry> = {
  round: {
    body: "M100 72a54 54 0 1 1 0 108a54 54 0 1 1 0-108Z",
    top: 72,
    level: 96,
    neck: [90, 60, 20, 14],
    cap: { x: 80, y: 30, w: 40, h: 32, r: 16 },
    label: { x: 76, y: 118, w: 48, h: 22 },
  },
  square: {
    body: rect(50, 74, 100, 106, 14),
    top: 74,
    level: 92,
    neck: [89, 62, 22, 14],
    cap: { x: 74, y: 26, w: 52, h: 38, r: 5 },
    label: { x: 70, y: 112, w: 60, h: 30 },
  },
  tall: {
    body: rect(66, 58, 68, 122, 9),
    top: 58,
    level: 74,
    neck: [91, 46, 18, 14],
    cap: { x: 80, y: 10, w: 40, h: 38, r: 4 },
    label: { x: 76, y: 104, w: 48, h: 40 },
  },
  flask: {
    body: "M74 82H126Q132 82 134 88L152 170Q154 180 144 180H56Q46 180 48 170L66 88Q68 82 74 82Z",
    top: 82,
    level: 98,
    neck: [89, 68, 22, 16],
    cap: { x: 78, y: 32, w: 44, h: 38, r: 10 },
    label: { x: 74, y: 128, w: 52, h: 24 },
  },
};

export function PerfumeArt({ spec }: { spec: Spec }) {
  const id = useId().replace(/:/g, "");
  const g = SHAPES[spec.shape];
  const [c1, c2, c3] = CAPS[spec.cap];
  const deep = shade(spec.liquid, -0.45);
  const light = shade(spec.liquid, 0.35);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}l`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={spec.liquid} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" x2="1">
          <stop offset="0" stopColor={c2} />
          <stop offset="0.35" stopColor={c1} />
          <stop offset="0.7" stopColor={c3} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}b`}>
          <path d={g.body} />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="186" rx="56" ry="6" fill="#000" opacity="0.28" />
      <rect x={g.neck[0]} y={g.neck[1]} width={g.neck[2]} height={g.neck[3]} fill={`url(#${id}c)`} opacity="0.9" />
      <g clipPath={`url(#${id}b)`}>
        <rect x="0" y="0" width="200" height="200" fill={`url(#${id}l)`} />
        <rect x="0" y="0" width="200" height={g.level} fill="#fff" opacity="0.16" />
        <rect x="0" y={g.level - 1} width="200" height="2" fill="#fff" opacity="0.35" />
        <rect x="58" y={g.top} width="18" height="130" fill={`url(#${id}h)`} transform="rotate(8 67 120)" />
        <rect x="128" y={g.top} width="6" height="130" fill="#fff" opacity="0.18" />
      </g>
      <path d={g.body} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.6" />
      <rect
        x={g.label.x}
        y={g.label.y}
        width={g.label.w}
        height={g.label.h}
        rx="2"
        fill="#fff"
        opacity="0.82"
      />
      <rect x={g.label.x + 8} y={g.label.y + g.label.h / 2 - 1.5} width={g.label.w - 16} height="3" rx="1.5" fill={deep} opacity="0.75" />
      <rect x={g.cap.x} y={g.cap.y} width={g.cap.w} height={g.cap.h} rx={g.cap.r} fill={`url(#${id}c)`} />
      <rect x={g.cap.x + 5} y={g.cap.y + 4} width="4" height={g.cap.h - 8} rx="2" fill="#fff" opacity="0.35" />
    </svg>
  );
}
