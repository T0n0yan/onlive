import type { FulfilmentMethod } from "./cart.ts";

export type PaymentMethod = "card" | "idram" | "telcell" | "cash";

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "card", label: "Բանկային քարտ", hint: "ArCa · Visa · Mastercard" },
  { id: "idram", label: "Idram", hint: "Դրամապանակով" },
  { id: "telcell", label: "Telcell", hint: "Wallet կամ տերմինալ" },
  { id: "cash", label: "Կանխիկ", hint: "Ստանալիս" },
];

export interface CheckoutForm {
  name: string;
  phone: string;
  method: FulfilmentMethod;
  address: string;
  date: string;
  comment: string;
  payment: PaymentMethod;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export const emptyCheckout = (): CheckoutForm => ({
  name: "",
  phone: "",
  method: "delivery",
  address: "",
  date: "",
  comment: "",
  payment: "card",
});

/** Armenian numbers: +374 XX XXX XXX or 0XX XXX XXX. Returns "+374XXXXXXXX" or null. */
export function normalizeArmenianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("374") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : null;
  if (local === null || !/^\d{8}$/.test(local)) return null;
  return `+374${local}`;
}

export function validateCheckout(form: CheckoutForm, opts: { needsDate: boolean }): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (form.name.trim().length < 2) errors.name = "Գրեք ձեր անունը";
  if (!normalizeArmenianPhone(form.phone)) errors.phone = "Օրինակ՝ 091 23 45 67";
  if (form.method === "delivery" && form.address.trim().length < 5) errors.address = "Գրեք առաքման հասցեն";
  if (opts.needsDate && !form.date) errors.date = "Ընտրեք ամսաթիվը";
  return errors;
}

/** Short, readable order number: KQ-<yymmdd>-<4 digits>. */
export function orderNumber(now: Date, random: () => number = Math.random): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const tail = String(Math.floor(random() * 10000)).padStart(4, "0");
  return `KQ-${yy}${mm}${dd}-${tail}`;
}
