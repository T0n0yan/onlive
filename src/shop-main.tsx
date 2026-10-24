import "./styles/fonts.ts";
import "./styles/shop.css";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { isStudioMessage, type ShopToStudio } from "./shop-core/bridge.ts";
import { Storefront } from "./shop-core/Storefront.tsx";
import type { ShopState } from "./shop-core/types.ts";
import { decodeShopState, encodeShopState } from "./shop-core/url.ts";
import { defaultFeaturesFor, VERTICAL_IDS, VERTICALS } from "./verticals/index.ts";

const parse = (search: string) => decodeShopState(search, VERTICAL_IDS, defaultFeaturesFor);

/** Re-validates a state received from the parent page by round-tripping it through the URL format. */
function sanitize(state: ShopState): ShopState | null {
  try {
    return parse(encodeShopState(state));
  } catch {
    return null;
  }
}

function ShopApp() {
  const [state, setState] = useState<ShopState>(() => parse(window.location.search));

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isStudioMessage(event.data)) return;
      const msg = event.data;
      if (msg.type === "scroll-to") {
        const top = msg.target === "top" ? 0 : (document.getElementById(msg.target)?.offsetTop ?? 0) - 64;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      const next = sanitize(msg.state);
      if (next) setState(next);
    };
    window.addEventListener("message", onMessage);
    if (window.parent !== window) {
      const ready: ShopToStudio = { source: "kayq-shop", type: "ready" };
      window.parent.postMessage(ready, window.location.origin);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <Storefront key={state.vertical} config={VERTICALS[state.vertical]} state={state} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShopApp />
  </StrictMode>,
);
