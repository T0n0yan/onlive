import type { Choice, OptionGroup, Product, VerticalConfig } from "../shop-core/types.ts";

const sizes: OptionGroup = {
  id: "size",
  label: "Չափս",
  kind: "choice",
  choices: ["XS", "S", "M", "L", "XL"].map((s) => ({ id: s.toLowerCase(), label: s })),
};

const tailoring: OptionGroup = {
  id: "measures",
  label: "Կարել ըստ ձեր չափսերի",
  kind: "text",
  personal: true,
  placeholder: "Կրծք․ 88 / գոտկ․ 70 / երկ․ 110",
  maxLength: 60,
  priceDelta: 5000,
};

function p(product: Omit<Product, "options">, colors: Choice[], withSize = true): Product {
  const color: OptionGroup = { id: "color", label: "Գույն", kind: "choice", choices: colors };
  return { ...product, options: withSize ? [sizes, color, tailoring] : [color] };
}

export const fashion: VerticalConfig = {
  id: "fashion",
  label: "Հագուստի խանութ",
  emoji: "👗",
  defaultName: "NORA",
  tagline: "Հագուստ Երևանից",
  theme: {
    dark: false,
    bg: "#f3f2ef",
    surface: "#ffffff",
    surface2: "#e7e5e0",
    text: "#121212",
    muted: "#6b6964",
    line: "rgba(18, 18, 18, 0.12)",
    accent: "#121212",
    accentText: "#ffffff",
    radius: 0,
    fontDisplay: "'Noto Sans Armenian Variable', system-ui, sans-serif",
    fontBody: "'Noto Sans Armenian Variable', system-ui, sans-serif",
    displayCaps: true,
  },
  accents: ["#121212", "#b4532a", "#2f4a3a", "#3d4f8a", "#a3485d"],
  categories: [
    { id: "women", label: "Կանացի" },
    { id: "men", label: "Տղամարդու" },
    { id: "basics", label: "Բեյսիք" },
    { id: "accessories", label: "Աքսեսուարներ" },
  ],
  products: [
    p(
      {
        id: "linen",
        name: "Կտավե զգեստ",
        category: "women",
        price: 29000,
        stock: "in",
        badge: "Նոր",
        short: "100% կտավ, midi",
        description: "Թեթև ու շնչող զգեստ՝ ամառվա և վաղ աշնան համար։",
        tint: "#ebe3d8",
        art: { kind: "fashion", garment: "dress", color: "#c9a98b" },
      },
      [
        { id: "sand", label: "Ավազագույն", swatch: "#c9a98b" },
        { id: "olive", label: "Ձիթապտղագույն", swatch: "#7d8461" },
        { id: "white", label: "Սպիտակ", swatch: "#f2efe8" },
      ],
    ),
    p(
      {
        id: "hoodie",
        name: "Oversize հուդի",
        category: "basics",
        price: 24000,
        oldPrice: 30000,
        stock: "in",
        badge: "Հիթ",
        short: "Թավշյա բամբակ, 420 գ/մ²",
        description: "Ամուր գործվածք, որը չի կորցնում ձևը լվացքից հետո։",
        tint: "#dfe5df",
        art: { kind: "fashion", garment: "hoodie", color: "#2f4a3a" },
      },
      [
        { id: "forest", label: "Կանաչ", swatch: "#2f4a3a" },
        { id: "black", label: "Սև", swatch: "#1b1b1b" },
        { id: "grey", label: "Մոխրագույն", swatch: "#9a9a96" },
      ],
    ),
    p(
      {
        id: "tee",
        name: "Բամբակյա շապիկ",
        category: "basics",
        price: 9500,
        stock: "in",
        short: "Organic cotton, regular fit",
        description: "Ամեն օրվա շապիկ՝ օրգանական բամբակից։",
        tint: "#eceae5",
        art: { kind: "fashion", garment: "tee", color: "#f4f1ea" },
      },
      [
        { id: "white", label: "Սպիտակ", swatch: "#f4f1ea" },
        { id: "black", label: "Սև", swatch: "#1b1b1b" },
        { id: "navy", label: "Մուգ կապույտ", swatch: "#26314f" },
      ],
    ),
    p(
      {
        id: "coat",
        name: "Բրդյա վերարկու",
        category: "women",
        price: 59000,
        stock: "low",
        short: "70% բուրդ, ազատ ձև",
        description: "Տաք ու թեթև վերարկու՝ երկար ձմռան համար։",
        tint: "#e3e0da",
        art: { kind: "fashion", garment: "jacket", color: "#4a4741" },
      },
      [
        { id: "charcoal", label: "Գրաֆիտ", swatch: "#4a4741" },
        { id: "camel", label: "Կամել", swatch: "#b08a5e" },
      ],
    ),
    p(
      {
        id: "trousers",
        name: "Լայն տաբատ",
        category: "men",
        price: 22000,
        stock: "in",
        short: "Բարձր գոտկատեղ, ծալքերով",
        description: "Դասական կտրվածք՝ ժամանակակից համամասնություններով։",
        tint: "#e9e4dc",
        art: { kind: "fashion", garment: "pants", color: "#8b7d6b" },
      },
      [
        { id: "taupe", label: "Մոխրաշագանակագույն", swatch: "#8b7d6b" },
        { id: "black", label: "Սև", swatch: "#1b1b1b" },
      ],
    ),
    p(
      {
        id: "bag",
        name: "Կաշվե պայուսակ",
        category: "accessories",
        price: 35000,
        stock: "out",
        short: "Բնական կաշի, ձեռագործ",
        description: "Ձեռքով կարված պայուսակ՝ երևանյան արհեստանոցից։",
        tint: "#ece0d6",
        art: { kind: "fashion", garment: "bag", color: "#7a3e26" },
      },
      [
        { id: "cognac", label: "Կոնյակագույն", swatch: "#7a3e26" },
        { id: "black", label: "Սև", swatch: "#1b1b1b" },
      ],
      false,
    ),
    p(
      {
        id: "reddress",
        name: "Երեկոյան զգեստ",
        category: "women",
        price: 34000,
        stock: "preorder",
        short: "Մետաքս, կարում ենք պատվերով",
        description: "Կարում ենք ձեր չափսերով՝ 7–10 օրում։",
        tint: "#f1e1e4",
        art: { kind: "fashion", garment: "dress", color: "#a3485d" },
      },
      [
        { id: "wine", label: "Գինեգույն", swatch: "#a3485d" },
        { id: "black", label: "Սև", swatch: "#1b1b1b" },
      ],
    ),
    p(
      {
        id: "blacktee",
        name: "Սև շապիկ",
        category: "men",
        price: 9500,
        stock: "in",
        short: "Heavy cotton, boxy fit",
        description: "Խիտ բամբակ, լայն ուսեր։",
        tint: "#e4e2de",
        art: { kind: "fashion", garment: "tee", color: "#1d1d1d" },
      },
      [
        { id: "black", label: "Սև", swatch: "#1d1d1d" },
        { id: "white", label: "Սպիտակ", swatch: "#f4f1ea" },
      ],
    ),
  ],
  slides: [
    {
      eyebrow: "Աշուն / Ձմեռ 2026",
      title: "Նոր հավաքածու",
      text: "Բնական գործվածքներ, պարզ ձևեր, տեղական արտադրություն։",
      cta: "Դիտել հավաքածուն",
      products: ["coat", "linen", "hoodie"],
      background: "linear-gradient(135deg, #e7e3dc 0%, #f6f5f2 100%)",
    },
    {
      eyebrow: "Ատելիե",
      title: "Կարում ենք ձեր չափսերով",
      text: "Ընտրեք մոդելը, ուղարկեք չափսերը, մնացածը՝ մեզ։",
      cta: "Ինչպես է աշխատում",
      products: ["reddress"],
      background: "linear-gradient(135deg, #f1e4e6 0%, #f3f2ef 100%)",
    },
    {
      eyebrow: "Բեյսիք",
      title: "Ամեն օրվա համար",
      text: "Շապիկներ ու հուդիներ՝ 9 500 դրամից։",
      cta: "Գնել",
      products: ["tee", "blacktee", "hoodie"],
      background: "linear-gradient(135deg, #dfe5df 0%, #f3f2ef 100%)",
    },
  ],
  services: [
    { icon: "scissors", title: "Անհատական կարում", text: "Մոդելը՝ ձեր չափսերով, 7–10 օրում։" },
    { icon: "shield", title: "Փոխանակում 14 օրում", text: "Չսազե՞ց։ Փոխում ենք առանց հարցերի։" },
    { icon: "sparkle", title: "Ստայլիստ", text: "Անվճար խորհրդատվություն՝ խանութում կամ օնլայն։" },
    { icon: "truck", title: "Առաքում ամբողջ ՀՀ", text: "Երևանում՝ նույն օրը, մարզեր՝ 1–3 օր։" },
  ],
  reviews: [
    { name: "Էլեն Պ.", rating: 5, text: "Զգեստը կարեցին իմ չափսերով, նստում է կատարյալ։" },
    { name: "Հայկ Մ.", rating: 5, text: "Հուդիի որակը շատ լավն է, արդեն երկրորդն եմ վերցնում։" },
    { name: "Աննա Լ.", rating: 4, text: "Արագ առաքում ու գեղեցիկ փաթեթավորում։" },
  ],
  delivery: {
    fee: 1000,
    freeFrom: 40000,
    time: "Երևանում՝ նույն օրը, մարզեր՝ 1–3 օր",
    zones: ["Երևան", "Գյումրի", "Վանաձոր", "Ամբողջ ՀՀ"],
    pickup: "Երևան, Կենտրոն",
  },
  contacts: { address: "Երևան, Կենտրոն", hours: "Ամեն օր՝ 11:00–21:00", phone: "+374 10 00 00 00" },
  copy: {
    catalogTitle: "Հավաքածու",
    catalogText: "Բնական գործվածքներ, տեղական արտադրություն",
    addToCart: "Զամբյուղ",
    personalTitle: "Ատելիե",
    promoBanner: "Season sale՝ −20% ընտրված մոդելների վրա",
    servicesTitle: "Ծառայություններ",
    emptyCart: "Զամբյուղը դատարկ է",
  },
  defaultFeatures: [
    "slider", "catalog", "categories", "search", "stock", "promo", "favorites", "custom",
    "cart", "checkout", "payment", "delivery", "services", "reviews", "contacts", "chat",
  ],
};
