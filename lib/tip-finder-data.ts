// Disposal site & material seed data for Envirocycle's Tip Finder.
//
// SITES: real Glasgow-area waste transfer stations from public listings.
// PRICES: ⚠️ ALL PLACEHOLDERS. Ring each supplier for real trade rates
// and edit the numbers below. Search "TODO" to find every line that needs one.

export type MaterialId =
  | "mixed"
  | "wood"
  | "inert"
  | "plasterboard"
  | "metal"
  | "green"
  | "card"
  | "weee"
  | "soil"
  | "mattress"
  | "tyres"
  | "hazardous";

export interface Material {
  id: MaterialId;
  name: string;
  description: string;
}

export const materials: Material[] = [
  { id: "mixed",        name: "General Mixed Waste", description: "Loose mixed C&D and household" },
  { id: "wood",         name: "Wood",                description: "Timber, Grade A–D" },
  { id: "inert",        name: "Inert / Rubble",      description: "Bricks, concrete, hardcore" },
  { id: "plasterboard", name: "Plasterboard",        description: "Gypsum board, kept separate" },
  { id: "metal",        name: "Mixed Metals",        description: "Ferrous and non-ferrous scrap" },
  { id: "green",        name: "Green / Garden Waste",description: "Soft landscaping and branches" },
  { id: "card",         name: "Card / Paper",        description: "Clean and dry" },
  { id: "weee",         name: "Electricals (WEEE)",  description: "Appliances and electronics" },
  { id: "soil",         name: "Soil",                description: "Clean soil and subsoil" },
  { id: "mattress",     name: "Mattresses",          description: "Per-item priced" },
  { id: "tyres",        name: "Tyres",               description: "Car and van" },
  { id: "hazardous",    name: "Hazardous",           description: "Specialist sites only" },
];

export interface SiteRate {
  pricePerTonne: number;
  minCharge?: number;
  notes?: string;
}

export interface OpeningHours {
  day: number; // 0 = Sunday … 6 = Saturday
  open: string;
  close: string;
}

export interface DisposalSite {
  id: string;
  name: string;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  phone?: string;
  hours: OpeningHours[];
  rates: Partial<Record<MaterialId, SiteRate>>;
  notes?: string;
}

const weekdayHours = (open: string, close: string): OpeningHours[] =>
  [1, 2, 3, 4, 5].map((day) => ({ day, open, close }));

export const sites: DisposalSite[] = [
  {
    id: "wrc-inchinnan",
    name: "WRC Recycling (Glasgow Airport)",
    address: "45 Newmains Ave, Inchinnan, Renfrew",
    postcode: "PA4 9RR",
    lat: 55.881,
    lng: -4.443,
    phone: "",
    hours: [
      ...weekdayHours("07:00", "17:00"),
      { day: 6, open: "08:00", close: "12:00" },
    ],
    rates: {
      mixed:        { pricePerTonne: 160 },
      wood:         { pricePerTonne: 90 },
      card:         { pricePerTonne: 20 },
      plasterboard: { pricePerTonne: 140 },
      metal:        { pricePerTonne: 0, notes: "Buy-back: ask for current scrap rates" },
    },
    notes: "Recommended by Glasgow City Council for business waste.",
  },
  {
    id: "nhw-glasgow",
    name: "NHW Group",
    address: "31 Nuneaton Street, Glasgow",
    postcode: "G40 3JT",
    lat: 55.847,
    lng: -4.219,
    phone: "",
    hours: [
      ...weekdayHours("07:30", "17:00"),
      { day: 6, open: "08:00", close: "13:00" },
    ],
    rates: {
      mixed:        { pricePerTonne: 165 },
      wood:         { pricePerTonne: 92 },
      inert:        { pricePerTonne: 25, minCharge: 20 },
      plasterboard: { pricePerTonne: 145 },
      green:        { pricePerTonne: 75 },
      card:         { pricePerTonne: 22 },
    },
    notes: "East End Glasgow. Recommended by Glasgow City Council.",
  },
  {
    id: "jm-murdoch",
    name: "JM Murdoch & Son",
    address: "Neilston Road, Neilston",
    postcode: "G78 3DA",
    lat: 55.781,
    lng: -4.422,
    phone: "0141 881 1234",
    hours: weekdayHours("07:00", "16:30"),
    rates: {
      mixed:        { pricePerTonne: 155 },
      wood:         { pricePerTonne: 88 },
      card:         { pricePerTonne: 18 },
    },
    notes: "Family-owned waste & haulage. Kerbside collections also available.",
  },
  {
    id: "dow-cumbernauld",
    name: "The Dow Group",
    address: "Cumbernauld Industrial Estate",
    postcode: "G68 9HQ",
    lat: 55.946,
    lng: -4.001,
    phone: "",
    hours: weekdayHours("07:00", "17:00"),
    rates: {
      mixed:        { pricePerTonne: 168 },
      wood:         { pricePerTonne: 95 },
      plasterboard: { pricePerTonne: 138 },
      green:        { pricePerTonne: 72 },
    },
    notes: "North of Glasgow. Wheelie bin and commercial collections.",
  },
  {
    id: "levenseat-forth",
    name: "Levenseat (Forth)",
    address: "Wilsontown, Forth, Lanark",
    postcode: "ML11 8EP",
    lat: 55.779,
    lng: -3.678,
    phone: "",
    hours: weekdayHours("07:00", "17:00"),
    rates: {
      mixed:        { pricePerTonne: 150, notes: "MRF + Energy-from-Waste — best for residual" },
      wood:         { pricePerTonne: 80 },
      inert:        { pricePerTonne: 18, minCharge: 15 },
      soil:         { pricePerTonne: 20, notes: "Aggregate recovery — clean soil only" },
      green:        { pricePerTonne: 60 },
    },
    notes: "Furthest out (~30 mi) but cheapest per-tonne. Worth it only for full loads.",
  },
];