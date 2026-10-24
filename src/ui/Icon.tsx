import type { SVGProps } from "react";

const PATHS = {
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M9.5 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  heart: "M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4.5 4.5",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5 10 17 19 7",
  arrowRight: "M5 12h14m-5-6 6 6-6 6",
  arrowLeft: "M19 12H5m5-6-6 6 6 6",
  arrowUpRight: "M7 17 17 7M9 7h8v8",
  star: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
  truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7S10.5 3 8 3.8C5.8 4.5 7 7 12 7Zm0 0s1.5-4 4-3.2C18.2 4.5 17 7 12 7Z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z",
  chat: "M4 5h16v11H8l-4 4V5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  shield: "M12 3 4.5 6v6c0 4.4 3.2 7.9 7.5 9 4.3-1.1 7.5-4.6 7.5-9V6L12 3Zm-3 9 2 2 4-4",
  brush: "M14.5 4.5 19.5 9.5 11 18l-5-5 8.5-8.5ZM6 13l-2.5 2.5a2.5 2.5 0 0 0 0 3.5c1 1 3.5 1 5-1.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  leaf: "M5 19C5 10 11 5 20 4c-.5 9-5.5 15-14 15H5Zm0 0 8-8",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2.1-13.9L20 18M8.1 16.9 20 6",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5 12 12l9-4.5M12 12v9",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  phone: "M5 4h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5L20 15v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  pin: "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  telegram: "M21 4 3 11l6 2.2M21 4l-3 16-9-6.8M21 4 9 13.2V19l3-3.3",
  whatsapp: "M4 20l1.3-4A8 8 0 1 1 8.2 19L4 20Zm5-11c0 3.5 2.5 6 6 6l1.2-1.6-2-1-1 .8c-1.3-.5-2.2-1.4-2.7-2.7l.8-1-1-2L9 9Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  phoneDevice: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
  tablet: "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 15h2",
  desktop: "M3 4h18v12H3zM8 20h8M12 16v4",
  devices: "M2 5h14v9H2zM6 18h6M9 14v4M17 9h5v11h-5z",
  copy: "M8 8h12v12H8zM4 16V4h12",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  code: "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 5-9 13-9 0 8-5 12-9 13l-1-1ZM14.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  wand: "M15 4V2m0 8V8m-4-3H9m10 0h-2m-6.5 9.5L3 22m10.5-14.5-11 11M18 2l-3 3 3 3 3-3-3-3Z",
  palette: "M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5S13.3 15 14.5 15H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8ZM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
} as const;

export type IconId = keyof typeof PATHS;

export function Icon({ name, size = 20, ...rest }: { name: IconId; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
