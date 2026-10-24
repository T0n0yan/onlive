# Kayq Studio

Ստուդիայի պորտֆոլիո կայք + առցանց խանութների դեմո-կոնստրուկտոր։
Studio portfolio site plus a live demo builder for online shops (perfume, cakes, flowers, clothing, grocery).

- `index.html` — պորտֆոլիո՝ աշխատանքներ, ծառայություններ, կոնստրուկտոր, կապ։
- `shop.html?v=cake&f=catalog,cart&name=Անուշ` — դեմո խանութ։ Կոնստրուկտորի «Պատճենել հղումը» կոճակը տալիս է հենց այս հղումը, որը կարելի է ուղարկել հաճախորդին։

## Որտեղ ինչ փոխել

| Ինչ | Ֆայլ |
| --- | --- |
| Ստուդիայի անունը, Telegram, հեռախոս, email | `src/brand.ts` |
| Պորտֆոլիոյի նախագծերը, տեքստերը | `src/studio/content.ts` |
| Նախագծի իրական սքրինշոթ | ֆայլը դնել `public/work/` և `content.ts`-ում ավելացնել `image: "work/name.jpg"` |
| Խանութի ապրանքներ, գներ, գույներ | `src/verticals/<տեսակ>.ts` |

## Architecture

```
src/shop-core/   one storefront engine for every shop type
  types.ts       Product, OptionGroup, VerticalConfig, ShopState…
  cart.ts        pure cart reducer, option pricing, totals, restore from storage
  order.ts       checkout validation (Armenian phones), order numbers
  features.ts    feature registry + dependencies (payment → checkout → cart → catalog)
  url.ts         ShopState ⇄ demo URL
  bridge.ts      postMessage protocol between the studio page and demo iframes
  components/    Header, Hero slider, Catalog, ProductSheet, CartDrawer, Checkout, info sections
src/verticals/   data only: one file per business type
src/art/         SVG product illustrations (stand-ins for photos)
src/studio/      the portfolio page (motion + lenis animations)
```

A perfume shop and a cake shop share all logic: products, options (volume / weight, engraving /
inscription, delivery date), stock badges, cart, checkout and payment differ only in data.
New business type = new file in `src/verticals/` + one line in `src/verticals/index.ts`.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # shop-core unit tests
npm run build      # typecheck + production build into dist/
```

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).
Payments in demos are simulated; no data leaves the browser.
