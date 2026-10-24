import { AnimatePresence } from "motion/react";
import { useEffect, type CSSProperties } from "react";
import { CartDrawer } from "./components/CartDrawer.tsx";
import { Catalog } from "./components/Catalog.tsx";
import { Checkout, OrderDone } from "./components/Checkout.tsx";
import { Header } from "./components/Header.tsx";
import { HeroSlider, StaticHero } from "./components/Hero.tsx";
import { ProductSheet } from "./components/ProductSheet.tsx";
import {
  ChatButton,
  Contacts,
  Delivery,
  DemoPill,
  Footer,
  PromoStrip,
  Reviews,
  Services,
  Toast,
} from "./components/Sections.tsx";
import { ShopProvider, useShop } from "./ShopContext.tsx";
import type { ShopState, Theme, VerticalConfig } from "./types.ts";

function themeVars(theme: Theme): CSSProperties {
  return {
    "--bg": theme.bg,
    "--surface": theme.surface,
    "--surface2": theme.surface2,
    "--text": theme.text,
    "--muted": theme.muted,
    "--line": theme.line,
    "--accent": theme.accent,
    "--accent-text": theme.accentText,
    "--r": `${theme.radius}px`,
    "--font-d": theme.fontDisplay,
    "--font-b": theme.fontBody,
    colorScheme: theme.dark ? "dark" : "light",
  } as CSSProperties;
}

function Panels() {
  const { panel, has } = useShop();
  return (
    <AnimatePresence>
      {panel.type === "product" && <ProductSheet key={`p-${panel.id}`} id={panel.id} />}
      {panel.type === "cart" && has("cart") && <CartDrawer key="cart" />}
      {panel.type === "checkout" && has("checkout") && <Checkout key="checkout" />}
      {panel.type === "done" && <OrderDone key="done" number={panel.number} total={panel.total} paid={panel.paid} />}
    </AnimatePresence>
  );
}

function Shop() {
  const { theme, has, name, config } = useShop();

  useEffect(() => {
    document.title = `${name} · ${config.tagline}`;
    document.documentElement.style.background = theme.bg;
  }, [name, config.tagline, theme.bg]);

  return (
    <div className={`shop shop--${config.id} ${theme.displayCaps ? "shop--caps" : ""}`} style={themeVars(theme)}>
      <Header />
      <main>
        {has("slider") ? <HeroSlider /> : <StaticHero />}
        {has("promo") && <PromoStrip />}
        {has("catalog") && <Catalog />}
        {has("services") && <Services />}
        {has("delivery") && <Delivery />}
        {has("reviews") && <Reviews />}
        {has("contacts") && <Contacts />}
      </main>
      <Footer />
      {has("chat") && <ChatButton />}
      <DemoPill />
      <Toast />
      <Panels />
    </div>
  );
}

/** The whole shop for one vertical. Key it by vertical id so switching shops starts clean. */
export function Storefront({ config, state }: { config: VerticalConfig; state: ShopState }) {
  return (
    <ShopProvider config={config} state={state}>
      <Shop />
    </ShopProvider>
  );
}
