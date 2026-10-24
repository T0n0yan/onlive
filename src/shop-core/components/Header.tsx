import { AnimatePresence, motion } from "motion/react";
import { Icon } from "../../ui/Icon.tsx";
import { useShop } from "../ShopContext.tsx";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function Header() {
  const { name, has, cart, favorites, favoritesOnly, setFavoritesOnly, setPanel } = useShop();
  const count = cart.reduce((sum, l) => sum + l.qty, 0);
  const links = [
    has("catalog") && { id: "catalog", label: "Տեսականի" },
    has("services") && { id: "services", label: "Ծառայություններ" },
    has("delivery") && { id: "delivery", label: "Առաքում" },
    has("contacts") && { id: "contacts", label: "Կապ" },
  ].filter((l): l is { id: string; label: string } => Boolean(l));

  return (
    <header className="s-header">
      <div className="s-container s-header__row">
        <a className="s-logo" href="#top" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: "smooth" }))}>
          {name}
        </a>
        <nav className="s-nav" aria-label="Բաժիններ">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
        <div className="s-header__actions">
          {has("search") && (
            <button
              className="s-iconbtn"
              aria-label="Որոնում"
              onClick={() => {
                scrollTo("catalog");
                window.setTimeout(() => document.getElementById("s-search")?.focus(), 450);
              }}
            >
              <Icon name="search" />
            </button>
          )}
          {has("favorites") && (
            <button
              className={`s-iconbtn ${favoritesOnly ? "is-on" : ""}`}
              aria-label="Ընտրյալներ"
              aria-pressed={favoritesOnly}
              onClick={() => {
                setFavoritesOnly(!favoritesOnly);
                scrollTo("catalog");
              }}
            >
              <Icon name="heart" />
              {favorites.size > 0 && <span className="s-dot">{favorites.size}</span>}
            </button>
          )}
          {has("cart") && (
            <button className="s-cartbtn" onClick={() => setPanel({ type: "cart" })} aria-label="Զամբյուղ">
              <Icon name="cart" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    className="s-dot"
                    initial={{ scale: 0.3 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
