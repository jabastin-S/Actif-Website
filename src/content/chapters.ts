/**
 * Chapters of the page and the "specimen" each one puts on the stage.
 *
 * The stage draws an ILLUSTRATIVE knit structure (plain jersey, rib, open mesh, waffle) in a
 * yarn colour. It stands for the kind of material in each chapter; it is not a claim that a
 * given ACTIF product uses that structure. The stage caption says so.
 */

export type Structure = "jersey" | "rib" | "mesh" | "waffle";

export type Specimen = {
  /** shader structure weights: jersey, rib, mesh, waffle (should sum to 1) */
  mix: [number, number, number, number];
  /** loops across the short side of the stage; lower is a bigger, closer view */
  scale: number;
  face: string;
  shade: string;
  back: string;
  relief: number;
  /** interface fill colour for the chapter */
  chap: string;
  /** text-safe (>= 4.5:1 on paper) version of the chapter colour */
  chapInk: string;
  /** short structure label for the stage caption */
  structure: string;
};

export type ChapterId =
  | "intro"
  | "heritage"
  | "home"
  | "upholstery"
  | "industrial"
  | "medical"
  | "capabilities"
  | "responsibility"
  | "contact";

export const SPECIMENS: Record<Exclude<ChapterId, "contact">, Specimen> = {
  intro: {
    mix: [1, 0, 0, 0],
    scale: 26,
    face: "#dcd5c4",
    shade: "#7b7361",
    back: "#3e3a31",
    relief: 1,
    chap: "#d8d0bf",
    chapInk: "#6b6350",
    structure: "Plain knit, magnified",
  },
  heritage: {
    mix: [0.5, 0.5, 0, 0],
    scale: 26,
    face: "#cfc6b2",
    shade: "#5f5848",
    back: "#37332a",
    relief: 1,
    chap: "#d8d0bf",
    chapInk: "#6b6350",
    structure: "Plain knit with rib",
  },
  home: {
    mix: [1, 0, 0, 0],
    scale: 42,
    face: "#ead9a8",
    shade: "#8e7a42",
    back: "#4a3f1d",
    relief: 0.9,
    chap: "#e4cf8e",
    chapInk: "#76611f",
    structure: "Fine plain knit",
  },
  upholstery: {
    mix: [0, 1, 0, 0],
    scale: 26,
    face: "#3b7a64",
    shade: "#0e2b22",
    back: "#06140f",
    relief: 1.25,
    chap: "#2f6b57",
    chapInk: "#235544",
    structure: "Rib structure",
  },
  industrial: {
    mix: [0, 0, 1, 0],
    scale: 13,
    face: "#9aa5b0",
    shade: "#3a444e",
    back: "#566270",
    relief: 0.9,
    chap: "#8d98a3",
    chapInk: "#47525d",
    structure: "Open mesh structure",
  },
  medical: {
    mix: [1, 0, 0, 0],
    scale: 48,
    face: "#d6eeea",
    shade: "#5e9e98",
    back: "#2f5754",
    relief: 0.8,
    chap: "#b9e0db",
    chapInk: "#27706a",
    structure: "Fine plain knit",
  },
  capabilities: {
    mix: [0, 0, 0, 1],
    scale: 24,
    face: "#cbc6ba",
    shade: "#4f4b42",
    back: "#25231f",
    relief: 1.15,
    chap: "#d8d0bf",
    chapInk: "#6b6350",
    structure: "Waffle structure",
  },
  responsibility: {
    mix: [0, 1, 0, 0],
    scale: 30,
    face: "#5e8a8b",
    shade: "#12302f",
    back: "#08181a",
    relief: 1,
    chap: "#4f7f80",
    chapInk: "#2f5f61",
    structure: "Fine rib structure",
  },
};

export const CHAPTERS: { id: ChapterId; label: string; href: string }[] = [
  { id: "intro", label: "Introduction", href: "#top" },
  { id: "heritage", label: "Heritage", href: "#heritage" },
  { id: "home", label: "Home & Bedding", href: "#home" },
  { id: "upholstery", label: "Upholstery", href: "#upholstery" },
  { id: "industrial", label: "Industrial & Technical", href: "#industrial" },
  { id: "medical", label: "Medical & Healthcare", href: "#medical" },
  { id: "capabilities", label: "Capabilities", href: "#capabilities" },
  { id: "responsibility", label: "Responsibility", href: "#responsibility" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const APPLICATIONS = [
  { id: "home", name: "Home & Bedding", href: "#home" },
  { id: "upholstery", name: "Upholstery", href: "#upholstery" },
  { id: "industrial", name: "Industrial & Technical Textiles", href: "#industrial" },
  { id: "medical", name: "Medical & Healthcare Textiles", href: "#medical" },
] as const;
