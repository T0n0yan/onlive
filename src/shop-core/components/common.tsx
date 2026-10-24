import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Icon } from "../../ui/Icon.tsx";
import { MAX_QTY } from "../cart.ts";
import { formatAMD } from "../format.ts";
import type { StockStatus } from "../types.ts";

export function Sheet({
  label,
  side = "center",
  onClose,
  children,
}: {
  label: string;
  side?: "center" | "right";
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const offset = side === "right" ? { x: 60, y: 0 } : { x: 0, y: 50 };
  return (
    <motion.div
      className={`s-overlay s-overlay--${side}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`s-sheet s-sheet--${side}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ ...offset, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={{ ...offset, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
      >
        <button className="s-iconbtn s-sheet__close" onClick={onClose} aria-label="Փակել">
          <Icon name="close" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Price({ value, old, unit }: { value: number; old?: number; unit?: string }) {
  return (
    <span className="s-price">
      <strong>{formatAMD(value)}</strong>
      {old !== undefined && old > value && <s>{formatAMD(old)}</s>}
      {unit && <small>/ {unit}</small>}
    </span>
  );
}

const STOCK: Record<StockStatus, string> = {
  in: "Հասանելի է",
  low: "Վերջին հատերը",
  out: "Հասանելի չէ",
  preorder: "Պատվերով",
};

export function StockBadge({ stock }: { stock: StockStatus }) {
  return (
    <span className={`s-stock s-stock--${stock}`}>
      <i />
      {STOCK[stock]}
    </span>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="s-stars" aria-label={`${value} աստղ 5-ից`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={15} className={i < value ? "on" : ""} />
      ))}
    </span>
  );
}

export function QtyStepper({ value, onChange }: { value: number; onChange: (qty: number) => void }) {
  return (
    <div className="s-qty">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Պակասեցնել">
        <Icon name="minus" size={16} />
      </button>
      <motion.span key={value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {value}
      </motion.span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Ավելացնել"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
