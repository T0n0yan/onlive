function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, "0")).join("")}`;

/** amount > 0 mixes with white, < 0 with black (−1…1). */
export function shade(hex: string, amount: number): string {
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return toHex(parse(hex).map((c) => c + (target - c) * t));
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Relative luminance, for choosing readable text on a colour. */
export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export const readableOn = (hex: string) => (luminance(hex) > 0.45 ? "#111111" : "#ffffff");
