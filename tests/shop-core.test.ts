import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cartReducer, cartTotals, defaultSelections, lineKey, restoreCart, unitPrice } from "../src/shop-core/cart.ts";
import { normalizeFeatures, toggleFeature } from "../src/shop-core/features.ts";
import { discountPercent, formatAMD } from "../src/shop-core/format.ts";
import { normalizeArmenianPhone, orderNumber, validateCheckout, emptyCheckout } from "../src/shop-core/order.ts";
import type { CartLine } from "../src/shop-core/types.ts";
import { decodeShopState, encodeShopState } from "../src/shop-core/url.ts";
import { defaultFeaturesFor, VERTICAL_IDS, VERTICALS } from "../src/verticals/index.ts";

const perfume = VERTICALS.perfume.products.find((p) => p.id === "velours")!;
const soldOut = VERTICALS.perfume.products.find((p) => p.stock === "out")!;
const cake = VERTICALS.cake.products.find((p) => p.id === "strawberry")!;

describe("cart", () => {
  it("prices options on top of the base price", () => {
    assert.equal(unitPrice(perfume, { volume: "50" }), 42000 + 9000);
    assert.equal(unitPrice(perfume, { volume: "100", wrap: "gift", engraving: "Անի" }), 42000 + 21000 + 2000 + 3000);
    assert.equal(unitPrice(perfume, { engraving: "   " }), 42000, "blank engraving is free");
    assert.equal(unitPrice(cake, { weight: "3" }), 18000 * 3);
  });

  it("merges identical lines and splits different options", () => {
    let lines: CartLine[] = [];
    lines = cartReducer(lines, { type: "add", product: perfume, selections: { volume: "30" } });
    lines = cartReducer(lines, { type: "add", product: perfume, selections: { volume: "30" }, qty: 2 });
    lines = cartReducer(lines, { type: "add", product: perfume, selections: { volume: "50" } });
    assert.equal(lines.length, 2);
    assert.equal(lines[0]!.qty, 3);
    assert.equal(lineKey("a", { b: "1", a: "2" }), lineKey("a", { a: "2", b: "1" }));
  });

  it("refuses sold-out products and removes lines at quantity zero", () => {
    assert.deepEqual(cartReducer([], { type: "add", product: soldOut, selections: {} }), []);
    const lines = cartReducer([], { type: "add", product: perfume, selections: {} });
    assert.deepEqual(cartReducer(lines, { type: "setQty", key: lines[0]!.key, qty: 0 }), []);
  });

  it("only preselects personal options when the custom feature is on", () => {
    assert.deepEqual(defaultSelections(perfume, false), { volume: "30" });
    assert.deepEqual(defaultSelections(perfume, true), { volume: "30", wrap: "none" });
  });

  it("charges delivery until the free threshold, never for pickup", () => {
    const delivery = VERTICALS.perfume.delivery;
    const one = cartReducer([], { type: "add", product: perfume, selections: {} });
    assert.equal(cartTotals(one, delivery, "delivery").delivery, 0, "42 000 is above the 30 000 threshold");
    const cheap = cartReducer([], {
      type: "add",
      product: { ...perfume, price: 10000 },
      selections: {},
    });
    const t = cartTotals(cheap, delivery, "delivery");
    assert.equal(t.delivery, delivery.fee);
    assert.equal(t.untilFree, 20000);
    assert.equal(cartTotals(cheap, delivery, "pickup").delivery, 0);
  });

  it("restores a saved cart with current prices and drops unknown items", () => {
    const saved = [
      { productId: "velours", qty: 2, selections: { volume: "50" }, unitPrice: 1 },
      { productId: "ghost", qty: 1, selections: {} },
      "garbage",
    ];
    const lines = restoreCart(saved, VERTICALS.perfume.products);
    assert.equal(lines.length, 1);
    assert.equal(lines[0]!.unitPrice, 51000, "price comes from the catalogue, not storage");
  });
});

describe("features", () => {
  it("drops features whose requirements are missing", () => {
    assert.deepEqual(normalizeFeatures(["payment", "checkout"]), []);
    assert.deepEqual(normalizeFeatures(["catalog", "cart", "checkout", "payment"]), ["catalog", "cart", "checkout", "payment"]);
  });

  it("turning payment on pulls in checkout, cart and catalog; turning cart off drops them", () => {
    const on = toggleFeature(["slider"], "payment");
    assert.deepEqual(on, ["slider", "catalog", "cart", "checkout", "payment"]);
    assert.deepEqual(toggleFeature(on, "cart"), ["slider", "catalog"]);
  });

  it("every vertical's defaults are already consistent", () => {
    for (const id of VERTICAL_IDS) {
      assert.deepEqual(normalizeFeatures(defaultFeaturesFor(id)), defaultFeaturesFor(id), id);
    }
  });
});

describe("demo URL", () => {
  it("round-trips the generator state", () => {
    const state = { vertical: "cake" as const, features: ["catalog" as const, "cart" as const], name: "Անուշ", accent: "#B5793F" };
    const decoded = decodeShopState(encodeShopState(state), VERTICAL_IDS, defaultFeaturesFor);
    assert.deepEqual(decoded, { ...state, accent: "#b5793f" });
  });

  it("falls back to safe defaults for bad input", () => {
    const decoded = decodeShopState("v=casino&f=cart,hack&accent=red", VERTICAL_IDS, defaultFeaturesFor);
    assert.equal(decoded.vertical, VERTICAL_IDS[0]);
    assert.deepEqual(decoded.features, [], "cart without catalog is dropped");
    assert.equal(decoded.accent, undefined);
    assert.deepEqual(decodeShopState("v=flowers", VERTICAL_IDS, defaultFeaturesFor).features, defaultFeaturesFor("flowers"));
  });
});

describe("order", () => {
  it("accepts Armenian phone formats", () => {
    assert.equal(normalizeArmenianPhone("091 23 45 67"), "+37491234567");
    assert.equal(normalizeArmenianPhone("+374 (77) 123-456"), "+37477123456");
    assert.equal(normalizeArmenianPhone("12345"), null);
  });

  it("validates required checkout fields", () => {
    const form = { ...emptyCheckout(), name: "Ա", phone: "1" };
    const errors = validateCheckout(form, { needsDate: true });
    assert.deepEqual(Object.keys(errors).sort(), ["address", "date", "name", "phone"]);
    const ok = { ...emptyCheckout(), name: "Անի", phone: "091234567", method: "pickup" as const };
    assert.deepEqual(validateCheckout(ok, { needsDate: false }), {});
  });

  it("formats prices and order numbers", () => {
    assert.equal(formatAMD(1234567), "1 234 567 ֏");
    assert.equal(discountPercent(42000, 52000), 19);
    assert.equal(orderNumber(new Date(2026, 9, 24), () => 0.0421), "KQ-261024-0421");
  });
});
