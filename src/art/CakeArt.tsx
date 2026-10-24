import { useId } from "react";
import type { ArtSpec } from "../shop-core/types.ts";
import { shade } from "./color.ts";

type Spec = Extract<ArtSpec, { kind: "cake" }>;

interface Tier {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BASE = 172;

function layout(tiers: Spec["tiers"]): Tier[] {
  const sizes: [number, number][] =
    tiers === 1 ? [[136, 66]] : tiers === 2 ? [[146, 52], [100, 46]] : [[152, 42], [114, 38], [78, 34]];
  let bottom = BASE;
  return sizes.map(([w, h]) => {
    const tier = { x: 100 - w / 2, y: bottom - h, w, h };
    bottom -= h;
    return tier;
  });
}

function Flower({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.55} rx={r * 0.42} ry={r * 0.6} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.3} fill="#fff3c4" />
    </g>
  );
}

export function CakeArt({ spec }: { spec: Spec }) {
  const id = useId().replace(/:/g, "");
  const tiers = layout(spec.tiers);
  const top = tiers[tiers.length - 1]!;
  const edge = shade(spec.cream, -0.12);
  const topCream = shade(spec.cream, 0.25);
  const piping = shade(spec.cream, 0.4);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1">
          <stop offset="0" stopColor={edge} />
          <stop offset="0.3" stopColor={spec.cream} />
          <stop offset="0.7" stopColor={spec.cream} />
          <stop offset="1" stopColor={shade(spec.cream, -0.2)} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="184" rx="86" ry="9" fill="#000" opacity="0.12" />
      <ellipse cx="100" cy="176" rx="84" ry="10" fill="#ffffff" />
      <ellipse cx="100" cy="174" rx="84" ry="9" fill="#f4f1ee" />
      {tiers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={`url(#${id}s)`} />
          <ellipse cx="100" cy={t.y + t.h} rx={t.w / 2} ry="7" fill={`url(#${id}s)`} />
          <ellipse cx="100" cy={t.y} rx={t.w / 2} ry="7" fill={topCream} />
          {Array.from({ length: Math.floor(t.w / 11) }, (_, k) => {
            const n = Math.floor(t.w / 11);
            const px = t.x + 6 + (k * (t.w - 12)) / Math.max(1, n - 1);
            const dy = Math.sin(((px - t.x) / t.w) * Math.PI) * 6;
            return <circle key={k} cx={px} cy={t.y + t.h + dy - 1} r="4.2" fill={piping} />;
          })}
          {spec.topping === "flowers" && i < tiers.length - 1 && (
            <>
              <Flower x={t.x + t.w * 0.25} y={t.y + t.h * 0.55} r={9} color={spec.accent} />
              <Flower x={t.x + t.w * 0.75} y={t.y + t.h * 0.5} r={7} color={shade(spec.accent, 0.3)} />
            </>
          )}
        </g>
      ))}

      {spec.topping === "drip" && (
        <>
          <path
            d={`M${top.x} ${top.y}
              ${Array.from({ length: 7 }, (_, k) => {
                const x0 = top.x + (k * top.w) / 7;
                const x1 = x0 + top.w / 14;
                const x2 = x0 + top.w / 7;
                const depth = 10 + ((k * 37) % 17);
                return `L${x0 + 2} ${top.y + 4} Q${x1} ${top.y + depth + 8} ${x2 - 2} ${top.y + 4}`;
              }).join(" ")}
              L${top.x + top.w} ${top.y} Z`}
            fill={spec.accent}
          />
          <ellipse cx="100" cy={top.y} rx={top.w / 2} ry="7" fill={spec.accent} />
          <ellipse cx="88" cy={top.y - 2} rx={top.w / 5} ry="2" fill="#fff" opacity="0.3" />
        </>
      )}

      {spec.topping === "berries" &&
        [
          [-0.28, -4],
          [-0.1, -7],
          [0.1, -5],
          [0.28, -3],
          [0, -1],
        ].map(([fx, dy], k) => (
          <g key={k}>
            <path
              d={`M${100 + fx! * top.w} ${top.y + dy! - 9} q6 2 4 9 q-4 6 -8 0 q-2 -7 4 -9Z`}
              fill={spec.accent}
            />
            <ellipse cx={100 + fx! * top.w - 1} cy={top.y + dy! - 5} rx="1.5" ry="2.5" fill="#fff" opacity="0.5" />
            <path d={`M${100 + fx! * top.w - 3} ${top.y + dy! - 10} l3 -3 l3 3`} stroke="#3f8f4a" strokeWidth="2" fill="none" />
          </g>
        ))}

      {spec.topping === "candles" &&
        [-22, 0, 22].map((dx, k) => (
          <g key={k}>
            <rect x={100 + dx - 3} y={top.y - 30} width="6" height="28" rx="2" fill={k === 1 ? spec.accent : "#ffd166"} />
            <rect x={100 + dx - 3} y={top.y - 22} width="6" height="3" fill="#fff" opacity="0.7" />
            <rect x={100 + dx - 3} y={top.y - 13} width="6" height="3" fill="#fff" opacity="0.7" />
            <path d={`M${100 + dx} ${top.y - 44} q6 8 0 12 q-6 -4 0 -12Z`} fill="#ff9f1c" />
            <path d={`M${100 + dx} ${top.y - 39} q3 4 0 6 q-3 -2 0 -6Z`} fill="#fff3b0" />
          </g>
        ))}

      {spec.topping === "macarons" &&
        [-0.3, 0, 0.3].map((fx, k) => {
          const x = 100 + fx * top.w;
          const color = k === 1 ? spec.accent : shade(spec.accent, k === 0 ? -0.15 : 0.25);
          return (
            <g key={k} transform={`translate(${x} ${top.y - 10 - (k === 1 ? 4 : 0)})`}>
              <ellipse cy="5" rx="13" ry="5" fill={color} />
              <rect x="-11" y="-1" width="22" height="5" rx="2" fill="#fff6e9" />
              <ellipse cy="-2" rx="13" ry="5" fill={shade(color, 0.12)} />
            </g>
          );
        })}

      {spec.topping === "flowers" && (
        <>
          <Flower x={92} y={top.y - 4} r={11} color={spec.accent} />
          <Flower x={110} y={top.y - 7} r={8} color={shade(spec.accent, 0.3)} />
          <ellipse cx="80" cy={top.y - 1} rx="8" ry="3.5" fill="#7fae7a" transform={`rotate(-20 80 ${top.y})`} />
        </>
      )}
    </svg>
  );
}
