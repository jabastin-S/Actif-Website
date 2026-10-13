/**
 * Single source for ACTIF copy and facts.
 *
 * Sources: the original repository content (home-textiles range, capacity, standards,
 * SDGs, contact) and the 2026 redesign brief (four sectors, Vani Fabrics, 1970 heritage).
 * Items marked `// CONFIRM` are carried over from the source as stated and should be
 * checked by ACTIF before launch. Nothing here is invented: where the source gives no
 * detail (upholstery, industrial, medical) the copy stays at sector level.
 */

export const COMPANY = {
  name: "ACTIF",
  legalName: "ACTIF Global Ventures Pvt Ltd",
  parent: "Vani Fabrics Private Limited",
  heritageYear: 1970,
  location: "Tiruppur, Tamil Nadu, India",
  email: "info@actif.ltd",
  phone: "+91 98946 02235",
  phoneHref: "tel:+919894602235",
  web: "actif.ltd",
  webHref: "https://actif.ltd",
} as const;

export type SectorId = "home" | "upholstery" | "industrial" | "medical";

export const SECTORS: { id: SectorId; name: string }[] = [
  { id: "home", name: "Home & Bedding" },
  { id: "upholstery", name: "Upholstery" },
  { id: "industrial", name: "Industrial & Technical Textiles" },
  { id: "medical", name: "Medical & Healthcare Textiles" },
];

export const STRENGTHS = [
  {
    title: "Knit to pack, under one roof",
    body: "Fabric, finishing, cut and sew and packing are run together, so a programme has one team to answer for it.",
  },
  {
    title: "Sustainability designed in",
    body: "Responsible fibres, energy and chemistry sit inside each process rather than being added at the end.",
  },
  {
    title: "Built for export",
    body: "Programmes shaped for buyers in Australia, Europe and the USA.",
  },
  {
    title: "Traceable by design",
    body: "Working to international standards, with Digital Product Passport and traceability readiness.", // CONFIRM scope
  },
  {
    title: "Renewable energy",
    body: "Solar and wind energy support production at the mill. Ask us for current figures.", // CONFIRM share of supply
  },
  {
    title: "Made to the programme",
    body: "Flexible capacity and quick sample-to-bulk turnaround, tailored to each brand.",
  },
] as const;

export const RANGE = [
  { name: "Bed sheets", fibres: "Cotton, bamboo, Tencel, blends" },
  { name: "Fitted sheets", fibres: "Cotton, blends" },
  { name: "Pillow cases", fibres: "Cotton, bamboo, silk blends" },
  { name: "Duvet covers", fibres: "Cotton, linen, bamboo" },
  { name: "Baby collection", fibres: "Organic cotton, bamboo" },
  { name: "Hospitality collection", fibres: "Cotton-poly blends, high durability" },
] as const;

export const FINISHES = [
  { title: "Antimicrobial protection", body: "Applied to specification; ask us for current performance data." },
  { title: "Odour control", body: "Fresher fabric between washes." },
  { title: "Skin friendly", body: "Gentle enough for the whole family." },
  { title: "Soil release", body: "Stains lift out with ease." },
  { title: "Moisture management", body: "Wicks and dries efficiently." },
  { title: "Soft hand and easy care", body: "Low maintenance, made to last through repeated washing." },
  { title: "Made to specification", body: "Functional finishes tailored to the customer and market." },
] as const;

export const PROCESS = [
  { title: "Responsible fibres", body: "Cotton, bamboo, Tencel, organic and blended yarns, chosen for the programme." },
  { title: "Knitting", body: "Fabric is knitted in-house, the start of the knit-to-pack line." },
  { title: "Green dyeing", body: "Dyeing built around green chemistry." },
  { title: "Functional finishing", body: "Antimicrobial, soil-release and moisture-management finishes applied to specification." },
  { title: "Cut and sew", body: "Cut and sewn to each brand's specification." },
  { title: "Responsible packaging", body: "Packed with care for the brand's market." },
  { title: "Global delivery", body: "Shipped to brands in Australia, Europe and the USA." },
] as const;

export const CAPACITY = [
  { value: 150, text: "metric tonnes of greige fabric a month" },
  { value: 50, text: "metric tonnes of finished fabric a month" },
  { value: 5, text: "containers shipped a month" },
] as const; // CONFIRM figures and the scope they apply to

export const PILLARS = [
  {
    name: "Environmental",
    items: ["Solar and wind energy", "Water stewardship", "Green chemical processing", "Responsible waste", "Sustainable materials"],
  },
  {
    name: "Social",
    items: ["Safe workplace", "Ethical labour", "Skill development", "Employee wellbeing", "Consumer safety"],
  },
  {
    name: "Governance",
    items: ["Global compliance", "Supply chain transparency", "Digital Product Passport", "Traceability systems", "Continuous improvement"],
  },
] as const;

export const STANDARDS = [
  { group: "Environmental", names: ["GOTS", "OEKO-TEX"] },
  { group: "Social", names: ["SEDEX"] },
  { group: "Chemical", names: ["ZDHC"] },
  { group: "Digital readiness", names: ["Digital Product Passport ready", "Traceability enabled"] },
] as const; // CONFIRM certificate scope, numbers and validity before launch

export const SDGS = [
  { no: 6, title: "Clean water and sanitation", note: "Water stewardship" },
  { no: 7, title: "Affordable and clean energy", note: "Renewable energy" },
  { no: 8, title: "Decent work and economic growth", note: "Safe and ethical employment" },
  { no: 9, title: "Industry, innovation and infrastructure", note: "Manufacturing innovation" },
  { no: 12, title: "Responsible consumption and production", note: "Responsible production" },
  { no: 13, title: "Climate action", note: "Climate action" },
] as const;
