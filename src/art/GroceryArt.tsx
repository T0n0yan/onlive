import { useId, type ReactNode } from "react";
import type { ArtSpec } from "../shop-core/types.ts";

type Spec = Extract<ArtSpec, { kind: "grocery" }>;

function Shine({ x, y, rx, ry, a = -30 }: { x: number; y: number; rx: number; ry: number; a?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity="0.4" transform={`rotate(${a} ${x} ${y})`} />;
}

const ITEMS: Record<Spec["item"], (id: string) => ReactNode> = {
  apple: (id) => (
    <>
      <defs>
        <radialGradient id={`${id}a`} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="1" stopColor="#b3141f" />
        </radialGradient>
      </defs>
      <path d="M100 66 C70 44 34 66 42 112 C50 156 82 180 100 166 C118 180 150 156 158 112 C166 66 130 44 100 66Z" fill={`url(#${id}a)`} />
      <path d="M100 68 Q98 46 108 34" stroke="#6b4423" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M106 48 Q128 28 148 40 Q130 60 106 48Z" fill="#5bab4c" />
      <Shine x={70} y={96} rx={10} ry={20} />
    </>
  ),
  tomato: () => (
    <>
      <ellipse cx="100" cy="116" rx="66" ry="58" fill="#e8402f" />
      <ellipse cx="100" cy="124" rx="58" ry="48" fill="#d93224" opacity="0.5" />
      <path d="M100 62 L112 48 L110 66 L134 60 L116 74 L132 86 L108 80 L100 96 L92 80 L68 86 L84 74 L66 60 L90 66 L88 48 Z" fill="#3e8f3a" />
      <rect x="97" y="40" width="6" height="16" rx="3" fill="#3e8f3a" />
      <Shine x={68} y={100} rx={10} ry={18} />
    </>
  ),
  lemon: (id) => (
    <>
      <defs>
        <radialGradient id={`${id}l`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff176" />
          <stop offset="1" stopColor="#f2b705" />
        </radialGradient>
      </defs>
      <path d="M34 116 Q38 112 44 110 Q60 64 106 62 Q150 62 160 104 Q166 106 170 112 Q164 118 160 120 Q150 160 104 162 Q56 162 44 122 Q38 120 34 116Z" fill={`url(#${id}l)`} />
      <path d="M118 62 Q132 30 162 36 Q150 66 118 62Z" fill="#5bab4c" />
      <Shine x={78} y={92} rx={8} ry={20} a={-55} />
    </>
  ),
  bread: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e7a85a" />
          <stop offset="1" stopColor="#a8622a" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="160" rx="84" ry="10" fill="#000" opacity="0.12" />
      <path d="M18 120 Q20 76 100 72 Q180 76 182 120 Q182 152 100 156 Q18 152 18 120Z" fill={`url(#${id}b)`} />
      {[56, 82, 108, 134].map((x) => (
        <path key={x} d={`M${x} 88 Q${x + 4} 114 ${x} 142`} stroke="#8a4b1c" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
      ))}
      <path d="M40 98 Q100 78 160 98" stroke="#f6cf8e" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
    </>
  ),
  milk: () => (
    <>
      <ellipse cx="100" cy="186" rx="44" ry="5" fill="#000" opacity="0.12" />
      <path d="M62 66 L80 36 H120 L138 66 Z" fill="#dfe8f3" />
      <rect x="88" y="26" width="24" height="12" rx="3" fill="#1c7ed6" />
      <rect x="62" y="66" width="76" height="118" rx="6" fill="#ffffff" />
      <rect x="62" y="104" width="76" height="46" fill="#1c7ed6" />
      <path d="M62 150 Q82 140 100 150 Q118 160 138 150 V184 H62Z" fill="#e7f0fb" />
      <text x="100" y="134" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="'Noto Sans Armenian Variable', sans-serif">
        ԿԱԹ
      </text>
    </>
  ),
  cheese: () => (
    <>
      <ellipse cx="100" cy="170" rx="80" ry="8" fill="#000" opacity="0.12" />
      <path d="M24 150 L176 150 L176 108 L52 70 Z" fill="#f7d469" />
      <path d="M24 150 L52 70 L176 108 L176 120 L60 86 L30 150Z" fill="#fbe39a" />
      <path d="M24 150 H176 V164 H24 Z" fill="#e9bf45" />
      {[
        [80, 124, 9],
        [120, 132, 7],
        [148, 120, 6],
        [62, 140, 5],
        [100, 104, 5],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#e3b33a" />
      ))}
    </>
  ),
  honey: (id) => (
    <>
      <defs>
        <linearGradient id={`${id}h`} x1="0" x2="1">
          <stop offset="0" stopColor="#f6b52e" />
          <stop offset="0.5" stopColor="#e08a0b" />
          <stop offset="1" stopColor="#b8650a" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="186" rx="52" ry="6" fill="#000" opacity="0.12" />
      <rect x="54" y="62" width="92" height="122" rx="18" fill={`url(#${id}h)`} />
      <rect x="60" y="40" width="80" height="26" rx="6" fill="#7a4a1e" />
      <path d="M60 66 H140 Q138 80 126 76 Q118 92 110 76 Q100 86 92 76 Q82 90 74 76 Q62 82 60 66Z" fill="#7a4a1e" opacity="0.4" />
      <rect x="66" y="108" width="68" height="40" rx="4" fill="#fff6dc" />
      <path d="M86 128 l7 -12 h14 l7 12 l-7 12 h-14 Z" fill="none" stroke="#c97b0a" strokeWidth="3" />
      <Shine x={68} y={90} rx={5} ry={18} a={0} />
    </>
  ),
  coffee: () => (
    <>
      <ellipse cx="100" cy="186" rx="52" ry="6" fill="#000" opacity="0.12" />
      <path d="M58 40 H142 L150 182 H50 Z" fill="#3b2a20" />
      <path d="M58 40 H142 L144 56 H56 Z" fill="#2a1d15" />
      <path d="M62 44 H138" stroke="#c9a27a" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="68" y="88" width="64" height="62" rx="4" fill="#f1e4d3" />
      <ellipse cx="100" cy="119" rx="14" ry="20" fill="#5a3a24" transform="rotate(25 100 119)" />
      <path d="M94 104 Q104 118 98 136" stroke="#f1e4d3" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};

export function GroceryArt({ spec }: { spec: Spec }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
      {ITEMS[spec.item](id)}
    </svg>
  );
}
