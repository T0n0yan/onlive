// All studio-page copy in one place. Edit texts here; components only render them.

export interface Project {
  id: string;
  name: string;
  url: string;
  kind: string;
  text: string;
  tags: string[];
  /** Two colours for the card's fallback cover. */
  colors: [string, string];
  /**
   * Optional local screenshot in /public (e.g. "work/clevit.jpg"). Without it the card loads a
   * live screenshot of the site in the visitor's browser.
   */
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "clevit",
    name: "Clevit",
    url: "https://www.clevit.io/",
    kind: "IT ընկերության կայք",
    text: "Վեբ և մոբայլ մշակման ընկերության կորպորատիվ կայք՝ ծառայություններով, քեյսերով և կապի ձևով։",
    tags: ["Կորպորատիվ", "Ծառայություններ", "Responsive"],
    colors: ["#2563eb", "#22d3ee"],
  },
  {
    id: "oracia",
    name: "Oracia AI",
    url: "https://oracia.ai/en",
    kind: "AI պրոդուկտ",
    text: "Արհեստական բանականության պրոդուկտի բազմալեզու կայք՝ պրոդուկտի ներկայացմամբ ու գրանցմամբ։",
    tags: ["AI", "SaaS", "Բազմալեզու"],
    colors: ["#7c3aed", "#f472b6"],
  },
  {
    id: "courtcue",
    name: "CourtCue",
    url: "https://www.courtcueapp.com/",
    kind: "Մոբայլ հավելվածի կայք",
    text: "Հավելվածի պրոմո կայք՝ հնարավորություններով, էկրաններով և ներբեռնման կոչով։",
    tags: ["App", "Լենդինգ", "Անիմացիաներ"],
    colors: ["#16a34a", "#a3e635"],
  },
  {
    id: "renegade",
    name: "Renegade Technology",
    url: "https://renegadetechnology.com/",
    kind: "Տեխնոլոգիական ընկերություն",
    text: "Տեխնոլոգիական և կիբեռանվտանգության ընկերության կայք՝ խիստ, վստահություն ներշնչող դիզայնով։",
    tags: ["Կորպորատիվ", "B2B", "Անվտանգություն"],
    colors: ["#dc2626", "#f97316"],
  },
  {
    id: "apostolic",
    name: "Հոգևոր ժառանգություն",
    url: "https://apostolic.am",
    kind: "Թվային գրադարան + Telegram Mini App",
    text: "Գրադարան «Հայ Առաքելական Սուրբ Եկեղեցի» Telegram խմբի համար՝ տեսանյութեր, աուդիո, գրքեր, որոնում, էջանիշներ։ Աշխատում է և՛ կայքում, և՛ Telegram-ի ներսում։",
    tags: ["Telegram Mini App", "Cloudflare", "React"],
    colors: ["#b45309", "#facc15"],
  },
  {
    id: "taxservice",
    name: "Ինքնասպասարկման պորտալ",
    url: "https://self-portal.taxservice.am/",
    kind: "Պետական պորտալ",
    text: "Ինքնասպասարկման պորտալ՝ անձնական կաբինետով, ձևերով և ծառայություններով, մեծ թվով օգտատերերի համար։",
    tags: ["Պորտալ", "Անձնական կաբինետ", "Անվտանգություն"],
    colors: ["#0ea5e9", "#6366f1"],
  },
];

export const ROTATING = [
  { word: "ծաղիկներ", vertical: "flowers" },
  { word: "տորթեր", vertical: "cake" },
  { word: "օծանելիք", vertical: "perfume" },
  { word: "հագուստ", vertical: "fashion" },
  { word: "մթերք", vertical: "grocery" },
] as const;

export const MARQUEE = [
  "Ծաղկի խանութ",
  "Տորթեր",
  "Օծանելիք",
  "Հագուստ",
  "Սուպերմարկետ",
  "Գեղեցկության սրահ",
  "Սրճարան",
  "Նվերների խանութ",
  "Կոշիկ",
  "Զարդեր",
];

export const STATS = [
  { value: 6, suffix: "", label: "իրական նախագիծ" },
  { value: 100, suffix: "%", label: "հարմարեցված հեռախոսի համար" },
  { value: 3, suffix: "", label: "էկրան՝ հեռախոս, պլանշետ, համակարգիչ" },
  { value: 24, suffix: "/7", label: "պատվերներ ձեր կայքում" },
];

export const SERVICES = [
  {
    icon: "cart",
    title: "Առցանց խանութ",
    text: "Կատալոգ, զամբյուղ, պատվեր, առաքում և առցանց վճարում՝ քարտ, Idram, Telcell։",
    wide: true,
  },
  { icon: "layers", title: "Կայք ընկերության համար", text: "Լենդինգ կամ բազմաէջ կայք՝ ծառայություններով ու կապի ձևով։" },
  { icon: "telegram", title: "Telegram բոտ ու Mini App", text: "Պատվերներ ու ծանուցումներ հենց Telegram-ում։" },
  { icon: "palette", title: "Դիզայն ձեր ոճով", text: "Գույներ, տառատեսակներ, անիմացիաներ՝ բրենդին համապատասխան։" },
  { icon: "bolt", title: "Արագ ու Google-ում", text: "Արագ բացվող էջեր, SEO, Google Maps, Instagram կապ։" },
  {
    icon: "rocket",
    title: "Աջակցություն ու զարգացում",
    text: "Թողարկումից հետո չենք անհետանում՝ փոփոխություններ, նոր բաժիններ, նոր ֆունկցիաներ։",
    wide: true,
  },
] as const;

export const WHY = [
  { title: "Պատվերներ 24/7", text: "Հաճախորդը պատվիրում է գիշերը, առանց սպասելու, որ պատասխանեք direct-ում։" },
  { title: "Գներն ու առկայությունը՝ միշտ տեսանելի", text: "Այլևս «գինը՝ direct-ում» չկա. մարդը տեսնում է ու գնում։" },
  { title: "Վճարում հենց կայքում", text: "Քարտով, Idram-ով կամ Telcell-ով՝ առանց փոխանցումների ու սքրինշոթների։" },
  { title: "Գտնում են Google-ում", text: "«Ծաղիկներ Երևան» որոնողը կարող է գտնել հենց ձեզ։" },
];

export const PROCESS = [
  {
    title: "Ծանոթություն",
    text: "Գալիս ենք ձեր խանութ կամ զանգում ենք։ Հասկանում ենք՝ ինչ եք վաճառում, ում և ինչպես եք հիմա ընդունում պատվերները։",
  },
  {
    title: "Դիզայն",
    text: "Պատրաստում ենք կայքի դիզայնը՝ ձեր բրենդի գույներով ու ոճով, և համաձայնեցնում ձեզ հետ։",
  },
  {
    title: "Մշակում",
    text: "Լցնում ենք ձեր ապրանքները, լուսանկարները, գները, առաքման կանոնները և միացնում վճարումները։",
  },
  {
    title: "Թողարկում ու աջակցություն",
    text: "Դոմեն, Google, Instagram, սոցցանցեր։ Հետո՝ փոփոխություններ ու նոր հնարավորություններ, երբ բիզնեսը մեծանա։",
  },
];
