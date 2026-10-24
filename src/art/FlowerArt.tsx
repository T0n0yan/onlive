import type { ArtSpec } from "../shop-core/types.ts";
import { shade } from "./color.ts";

type Spec = Extract<ArtSpec, { kind: "flowers" }>;

/** Bouquet heads: x, y, radius. Drawn back to front. */
const HEADS: [number, number, number][] = [
  [62, 70, 15],
  [138, 70, 15],
  [84, 52, 17],
  [116, 50, 17],
  [100, 72, 21],
  [74, 90, 18],
  [126, 90, 18],
  [100, 100, 16],
];

function Rose({ r, color }: { r: number; color: string }) {
  const dark = shade(color, -0.25);
  return (
    <g>
      <circle r={r} fill={color} />
      <circle r={r * 0.78} fill="none" stroke={dark} strokeOpacity="0.45" strokeWidth={r * 0.1} />
      <path
        d={`M${-r * 0.5} 0 A${r * 0.5} ${r * 0.5} 0 1 1 ${r * 0.35} ${r * 0.35} A${r * 0.3} ${r * 0.3} 0 1 1 ${-r * 0.1} ${-r * 0.2}`}
        fill="none"
        stroke={dark}
        strokeOpacity="0.55"
        strokeWidth={r * 0.1}
        strokeLinecap="round"
      />
      <circle cx={-r * 0.35} cy={-r * 0.4} r={r * 0.22} fill="#fff" opacity="0.18" />
    </g>
  );
}

function Peony({ r, color }: { r: number; color: string }) {
  const outer = shade(color, -0.08);
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * r * 0.5} cy={Math.sin(a) * r * 0.5} r={r * 0.55} fill={outer} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.4;
        return (
          <circle key={i} cx={Math.cos(a) * r * 0.25} cy={Math.sin(a) * r * 0.25} r={r * 0.42} fill={shade(color, 0.15)} />
        );
      })}
      <circle r={r * 0.28} fill={shade(color, 0.35)} />
    </g>
  );
}

function Tulip({ r, color }: { r: number; color: string }) {
  return (
    <g>
      <path
        d={`M${-r * 0.8} ${-r * 0.3} Q${-r * 0.9} ${r} 0 ${r} Q${r * 0.9} ${r} ${r * 0.8} ${-r * 0.3} L${r * 0.45} ${-r * 0.05} L${r * 0.15} ${-r * 0.75} L0 ${-r * 0.2} L${-r * 0.15} ${-r * 0.75} L${-r * 0.45} ${-r * 0.05} Z`}
        fill={color}
      />
      <path
        d={`M0 ${-r * 0.2} Q${-r * 0.1} ${r * 0.5} 0 ${r * 0.95}`}
        stroke={shade(color, -0.25)}
        strokeOpacity="0.5"
        strokeWidth={r * 0.08}
        fill="none"
      />
      <ellipse cx={-r * 0.4} cy={r * 0.15} rx={r * 0.12} ry={r * 0.35} fill="#fff" opacity="0.2" />
    </g>
  );
}

function Daisy({ r, color }: { r: number; color: string }) {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-r * 0.6}
          rx={r * 0.2}
          ry={r * 0.5}
          fill={color}
          stroke="#e7e2d3"
          strokeWidth="0.6"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <circle r={r * 0.32} fill="#f4b81c" />
      <circle r={r * 0.32} fill="none" stroke="#d99a0b" strokeWidth="1" />
    </g>
  );
}

const HEAD = { rose: Rose, peony: Peony, tulip: Tulip, daisy: Daisy };

export function FlowerArt({ spec }: { spec: Spec }) {
  const Head = HEAD[spec.flower];
  const wrapDark = shade(spec.wrap, -0.18);
  const wrapLight = shade(spec.wrap, 0.12);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
      <ellipse cx="100" cy="190" rx="40" ry="5" fill="#000" opacity="0.12" />
      <path d="M38 78 L100 186 L162 78 Q100 58 38 78Z" fill={wrapDark} />
      {[
        [56, 104, -40],
        [146, 102, 40],
        [48, 82, -60],
        [154, 82, 60],
        [100, 116, 0],
      ].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="9" ry="24" fill={i % 2 ? "#4f8a55" : "#3d7344"} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {spec.flower === "tulip" &&
        HEADS.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} Q${(x + 100) / 2} ${(y + 140) / 2} 100 150`} stroke="#4f8a55" strokeWidth="3" fill="none" />
        ))}
      {HEADS.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <Head r={r} color={spec.colors[i % spec.colors.length]!} />
        </g>
      ))}
      <path d="M58 112 L100 186 L142 112 Q120 124 100 120 Q80 124 58 112Z" fill={spec.wrap} />
      <path d="M100 120 L100 186" stroke={wrapDark} strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M58 112 Q80 124 100 120" stroke={wrapLight} strokeWidth="2" fill="none" />
      <g transform="translate(100 150)">
        <path d="M0 0 Q-16 -10 -18 2 Q-16 12 0 0Z" fill="#c9a4a8" />
        <path d="M0 0 Q16 -10 18 2 Q16 12 0 0Z" fill="#c9a4a8" />
        <path d="M0 0 L-8 18 M0 0 L8 18" stroke="#c9a4a8" strokeWidth="3" strokeLinecap="round" />
        <circle r="3.5" fill="#b88a8f" />
      </g>
    </svg>
  );
}
