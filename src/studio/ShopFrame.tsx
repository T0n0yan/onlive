import { useEffect, useRef, useState, type CSSProperties } from "react";
import { isShopReady, type StudioToShop } from "../shop-core/bridge.ts";
import type { ShopState } from "../shop-core/types.ts";
import { encodeShopState } from "../shop-core/url.ts";

export type DeviceId = "phone" | "tablet" | "desktop";

export const DEVICES: Record<DeviceId, { w: number; h: number; label: string; pad: number; top: number }> = {
  phone: { w: 390, h: 844, label: "Հեռախոս", pad: 12, top: 12 },
  tablet: { w: 820, h: 1180, label: "Պլանշետ", pad: 18, top: 18 },
  desktop: { w: 1440, h: 900, label: "Համակարգիչ", pad: 0, top: 38 },
};

/** Outer size of a device including its frame, before scaling. */
export const deviceSize = (id: DeviceId) => {
  const d = DEVICES[id];
  return { w: d.w + d.pad * 2, h: d.h + d.top + d.pad };
};

export const shopUrl = (state: ShopState) => `${import.meta.env.BASE_URL}shop.html?${encodeShopState(state)}`;

/**
 * A live demo shop in an iframe. The URL is only used for the first load; later changes are sent
 * with postMessage so the preview updates instantly without a reload.
 */
export function DeviceFrame({
  device,
  state,
  scale,
  scrollTarget,
  interactive = true,
  eager = false,
  className,
  style,
}: {
  device: DeviceId;
  state: ShopState;
  scale: number;
  /** Changing this scrolls the demo (hero auto tour). */
  scrollTarget?: string;
  interactive?: boolean;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [initialSrc] = useState(() => shopUrl(state));
  const [ready, setReady] = useState(false);
  const d = DEVICES[device];
  const size = deviceSize(device);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow && isShopReady(event.data)) setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const msg: StudioToShop = { source: "kayq-studio", type: "shop-state", state };
    frame.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, [ready, state]);

  useEffect(() => {
    if (!ready || !scrollTarget) return;
    const msg: StudioToShop = { source: "kayq-studio", type: "scroll-to", target: scrollTarget };
    frame.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, [ready, scrollTarget]);

  return (
    <div
      className={`device device--${device} ${className ?? ""}`}
      style={{ width: size.w * scale, height: size.h * scale, ...style }}
    >
      <div className="device__body" style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}>
        {device === "desktop" && (
          <div className="device__bar">
            <i />
            <i />
            <i />
            <span>{state.name || "your-shop.am"}</span>
          </div>
        )}
        {device === "phone" && <div className="device__island" />}
        <iframe
          ref={frame}
          title={`Դեմո՝ ${d.label}`}
          src={initialSrc}
          loading={eager ? "eager" : "lazy"}
          style={{
            width: d.w,
            height: d.h,
            left: d.pad,
            top: d.top,
            pointerEvents: interactive ? "auto" : "none",
          }}
          tabIndex={interactive ? 0 : -1}
        />
        {!ready && <div className="device__loading" style={{ left: d.pad, top: d.top, width: d.w, height: d.h }} />}
      </div>
    </div>
  );
}
