import { useId } from "react";
import type { ArtSpec } from "../shop-core/types.ts";
import { shade } from "./color.ts";

type Spec = Extract<ArtSpec, { kind: "fashion" }>;

const GARMENT: Record<Exclude<Spec["garment"], "bag">, { body: string; folds: string[]; hanger: boolean }> = {
  tee: {
    body: "M74 50 Q100 64 126 50 L150 58 L176 86 L156 106 L142 96 L142 178 L58 178 L58 96 L44 106 L24 86 L50 58 Z",
    folds: ["M80 120 Q84 150 78 176", "M120 118 Q116 150 122 176", "M58 96 Q64 90 62 76", "M142 96 Q136 90 138 76"],
    hanger: true,
  },
  dress: {
    body: "M80 48 Q100 60 120 48 L126 50 L124 92 Q150 140 166 182 L34 182 Q50 140 76 92 L74 50 Z",
    folds: ["M90 104 Q80 140 68 180", "M110 104 Q120 140 132 180", "M100 106 L100 182", "M76 92 Q100 100 124 92"],
    hanger: true,
  },
  hoodie: {
    body: "M74 46 Q100 70 126 46 L150 56 Q168 64 172 92 L178 166 L156 168 L148 108 L146 178 L54 178 L52 108 L44 168 L22 166 L28 92 Q32 64 50 56 Z",
    folds: ["M70 140 H130 L124 166 H76 Z", "M92 64 L90 96", "M108 64 L110 96", "M54 108 Q60 100 58 84", "M146 108 Q140 100 142 84"],
    hanger: true,
  },
  jacket: {
    body: "M76 44 L100 60 L124 44 L152 54 Q168 62 170 90 L176 172 L154 174 L148 112 L148 186 L52 186 L52 112 L46 174 L24 172 L30 90 Q32 62 48 54 Z",
    folds: ["M76 44 L92 104 L100 60", "M124 44 L108 104 L100 60", "M100 104 L100 186", "M60 150 H84", "M116 150 H140"],
    hanger: true,
  },
  pants: {
    body: "M62 32 H138 L150 184 H112 L100 84 L88 184 H50 Z",
    folds: ["M62 44 H138", "M80 46 L72 184", "M120 46 L128 184", "M100 46 V70"],
    hanger: false,
  },
};

export function FashionArt({ spec }: { spec: Spec }) {
  const id = useId().replace(/:/g, "");
  const dark = shade(spec.color, -0.22);
  const light = shade(spec.color, 0.14);
  const fold = shade(spec.color, -0.35);
  const gradient = (
    <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor={light} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  );

  if (spec.garment === "bag") {
    return (
      <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
        <defs>{gradient}</defs>
        <ellipse cx="100" cy="184" rx="64" ry="6" fill="#000" opacity="0.14" />
        <path d="M72 84 Q72 30 100 30 Q128 30 128 84" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M44 84 H156 L164 172 Q164 180 156 180 H44 Q36 180 36 172 Z" fill={`url(#${id}g)`} />
        <path d="M44 84 H156 L152 118 Q100 132 48 118 Z" fill={dark} opacity="0.55" />
        <path d="M50 92 H150" stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 4" />
        <rect x="92" y="114" width="16" height="12" rx="2" fill="#e8c77a" />
        <path d="M46 170 H154" stroke="#fff" strokeOpacity="0.25" strokeDasharray="3 4" />
      </svg>
    );
  }

  const g = GARMENT[spec.garment];
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
      <defs>{gradient}</defs>
      <ellipse cx="100" cy="192" rx="54" ry="5" fill="#000" opacity="0.1" />
      {g.hanger && (
        <g stroke="#8a8a8a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M100 30 Q100 18 108 16 Q116 16 116 24 Q116 30 108 32 L100 36" />
          <path d="M100 36 L58 56 M100 36 L142 56" />
        </g>
      )}
      <path d={g.body} fill={`url(#${id}g)`} stroke={fold} strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round" />
      {g.folds.map((d, i) => (
        <path key={i} d={d} stroke={fold} strokeOpacity="0.28" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      ))}
      {spec.garment === "jacket" &&
        [118, 140, 162].map((y) => <circle key={y} cx="108" cy={y} r="3" fill={shade(spec.color, -0.5)} />)}
      {spec.garment === "hoodie" && (
        <g stroke="#f1f1f1" strokeWidth="2" strokeLinecap="round">
          <path d="M92 66 L90 96" />
          <path d="M108 66 L110 96" />
        </g>
      )}
    </svg>
  );
}
