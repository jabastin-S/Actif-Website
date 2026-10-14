/**
 * Single source for ACTIF copy and facts.
 *
 * Source of truth: "ACTIF Global Ventures: Consolidated Knowledge Base" (the Millis agent
 * knowledge base). `// KB §n` points to the section each fact comes from. Nothing here goes
 * beyond it, with two exceptions supplied by the owner on 2026-10-14: the phone number, which
 * the knowledge base marks as unconfirmed, and the accreditations list. The knowledge base's
 * own qualifiers ("selected", "options", "subject to validation") are kept wherever it uses them.
 */

export const COMPANY = {
  // KB §27A: use "ACTIF Global Ventures" unless the legal entity name is verified
  name: "ACTIF Global Ventures",
  parent: "Vani Fabrics Pvt. Ltd.", // KB §1
  heritageYear: 1970, // KB §2
  location: "Tiruppur, Tamil Nadu, India", // KB §1
  email: "info@actif.ltd", // KB §22
  phone: "+91 98946 02235", // owner-confirmed; not in the KB (KB §22 marks it unconfirmed)
  phoneHref: "tel:+919894602235",
  web: "actif.ltd", // KB §22
  webHref: "https://actif.ltd",
} as const;

export type SectorId = "home" | "upholstery" | "industrial" | "medical";

export const SECTORS: { id: SectorId; name: string }[] = [
  { id: "home", name: "Home & Bedding" },
  { id: "upholstery", name: "Upholstery" },
  { id: "industrial", name: "Industrial & Technical Textiles" },
  { id: "medical", name: "Medical & Healthcare Textiles" },
];

/** Why partners work with ACTIF. KB §21, with §2 and §18. */
export const STRENGTHS = [
  {
    title: "A development partner",
    body: "Not simply a fabric supplier: each textile is developed around the final product and the performance it must deliver.",
  },
  {
    title: "Knitting since 1970",
    body: "More than five decades of experience in yarn behaviour, knitted structures, machine configuration and manufacturing consistency.",
  },
  {
    title: "Customised to the brief",
    body: "Materials, structures, widths, weights and performance characteristics, developed for each programme.",
  },
  {
    title: "Knitting to finishing, connected",
    body: "Circular knitting, finishing and selected made-up capabilities, with support for commercial-scale production.",
  },
  {
    title: "Repeatable quality",
    body: "A good sample starts the programme. Consistency builds the business.",
  },
  {
    title: "Oriented to global markets",
    body: "Responsible material pathways, with traceability and Digital Product Passport readiness.",
  },
] as const;

/* ---------- Home & Bedding (KB §6, §7) ---------- */

export const HOME_LEAD =
  "Knitted fabrics for contemporary home and lifestyle applications, with specifications tailored to brands, retailers, hospitality businesses and private-label partners.";

export const RANGE = [
  { name: "Bed and fitted sheets", note: "Flexible, soft structures for a secure mattress fit and ease of movement." },
  { name: "Mattress covers and ticking", note: "Developed around stretch, softness, breathability and durability, including protective bedding." },
  { name: "Blankets and throws", note: "Soft, warm, dimensional constructions with customisable weight and hand feel." },
  { name: "Comfort layers", note: "Knitted structures designed to enhance tactile and comfort performance." },
  { name: "Pillow cases and duvets", note: "Including hospitality bedding, to each brand's specification." },
  { name: "Specialty home textiles", note: "Custom constructions created around specific product and brand requirements." },
] as const;

/** Selected reference capabilities, not a specification for every fabric (KB §7). */
export const BEDDING_SELECTED = [
  { value: "150–160 GSM", text: "Selected jersey bedding range" },
  { value: "Up to 118 in", text: "Selected finished width (300 cm)" },
] as const;

/** Finishing possibilities. Every functional claim is validated per application (KB §14). */
export const FINISHES = [
  "Soft finish",
  "Moisture management",
  "Soil release",
  "Easy care",
  "Water-repellent options",
  "Antimicrobial options",
  "UV protection",
  "Wrinkle resistance",
  "Fire-retardant options",
  "Customer-specific finishes",
] as const;

/* ---------- Materials (KB §11, §12) ---------- */

export const STRUCTURES = [
  { name: "Single Jersey", note: "Soft, versatile and adaptable, including for bedding." },
  { name: "Rib", note: "Flexible, with strong stretch characteristics." },
  { name: "Interlock", note: "A smooth, stable and substantial double knit." },
  { name: "Terry", note: "A loop surface associated with softness and absorbency." },
  { name: "Fleece", note: "Comfort-oriented, associated with warmth and softness." },
  { name: "Jacquard", note: "Engineered patterns and dimensional surface effects." },
  { name: "Pointelle", note: "Decorative openwork with a breathable character." },
  { name: "Specialty knits", note: "Custom constructions for individual programme requirements." },
] as const;

export const FIBRES =
  "Cotton, polyester, poly-cotton and cotton-poly blends, cotton-Tencel, cotton-bamboo, cotton-linen, modal, viscose, bamboo-based options, recycled and cellulosic fibres, and specialty blends.";

/* ---------- Process (KB §15, §16) ---------- */

export const DEVELOPMENT = [
  { title: "Application", body: "Understand where and how the textile will be used." },
  { title: "Material", body: "Select the fibre and yarn combination." },
  { title: "Construction", body: "Develop the knitted structure around the product's requirements." },
  { title: "Specification", body: "Define yarn count, gauge, GSM, width, stretch, recovery and thickness." },
  { title: "Aesthetics", body: "Develop colour, texture, surface character, softness and hand feel." },
  { title: "Performance", body: "Define the performance required and, where appropriate, functional finishing." },
  { title: "Validation", body: "Evaluate the textile against agreed specifications and testing requirements." },
  { title: "Production", body: "Move the approved development into repeatable commercial production." },
] as const;

export const JOURNEY = [
  "Material selection",
  "Circular knitting",
  "Dyeing",
  "Fabric finishing",
  "Cut and sew",
  "Quality control",
  "Packing",
  "Global delivery",
] as const;

/* ---------- Capacity (KB §17, §27B) ---------- */

/** Stated at different stages of production: shown side by side, never converted or equated. */
export const CAPACITY = [
  { before: "", value: "200+", text: "circular knitting machines" },
  { before: "About", value: "40", text: "tonnes of knitting capacity a day" },
  { before: "", value: "150", text: "tonnes of greige knitted fabric a month" },
  { before: "About", value: "50", text: "tonnes of finished fabric a month" },
] as const;

/* ---------- Responsibility (KB §19) ---------- */

export const PILLARS = [
  {
    name: "Environmental",
    items: ["Renewable energy", "Water stewardship", "Responsible chemistry", "Waste management", "Responsible material options"],
  },
  {
    name: "Social",
    items: ["Safe workplace", "Ethical labour", "Skill development", "Employee wellbeing", "Consumer safety"],
  },
  {
    name: "Governance",
    items: ["Compliance", "Supply-chain transparency", "Traceability", "Digital Product Passport readiness", "Continuous improvement"],
  },
] as const;

/**
 * Owner-supplied from ACTIF's reference material (2026-10-14); not in the knowledge base, which
 * asks that certifications be shown only when currently valid and authorised. Confirm certificate
 * scope and validity before launch.
 */
export const ACCREDITATIONS = [
  { name: "OEKO-TEX®", body: "Standard 100: confidence in textiles, tested for harmful substances." },
  { name: "GOTS", body: "Global Organic Textile Standard: certified organic processing." },
  { name: "GRS", body: "Global Recycled Standard: verified recycled content and traceability." },
  { name: "BCI", body: "Better Cotton Initiative: sustainably sourced cotton fibre." },
] as const;

export const RESPONSIBLE_MATERIALS = [
  "Recycled fibres",
  "Organic material options",
  "Responsible cotton pathways",
  "Cellulosic fibres",
  "Durable constructions for longer product life",
  "Material optimisation",
  "Waste-conscious development",
] as const;

/* ---------- Applications (KB §6 to §10) ---------- */

/** Gateway line for each application card. */
export const APPLICATION_COPY: Record<SectorId, { line: string }> = {
  home: {
    line: "Bedding, mattress and lifestyle fabrics for brands, retailers, hospitality and private label.",
  },
  upholstery: {
    line: "Selected knitted fabrics for residential furniture, hospitality interiors and soft furnishings.",
  },
  industrial: {
    line: "Knitted constructions developed around the technical performance an application requires.",
  },
  medical: {
    line: "Selected knitted solutions for hospital bedding, patient comfort and protective applications.",
  },
};

/** Chapter copy for the three non-flagship applications. */
export const SECTOR_COPY = {
  upholstery: {
    lead: "Selected knitted upholstery and interior textiles that balance visual character, tactile experience and everyday performance.",
    detail:
      "For residential furniture, hospitality interiors, soft furnishing components, decorative interior textiles and comfort-oriented furniture. Customised by texture, structure, thickness, GSM, stretch, composition, colour, surface finish and functional performance.",
  },
  industrial: {
    lead: "Industrial development begins with the technical performance the final application requires. The knitted construction is adapted around technical parameters rather than conventional fashion criteria.",
    detail:
      "Strength, dimensional stability, stretch and recovery, breathability and airflow, moisture management and durability. Each requirement is evaluated and confirmed before we commit to it.",
  },
  medical: {
    lead: "Healthcare textiles demand comfort, hygiene, consistency, durability and functional performance. We develop selected knitted solutions for hospital bedding, patient comfort textiles, mattress and protective applications, healthcare upholstery and reusable textile components.",
    detail:
      "Medical and functional claims are tied to the intended use, your requirements and the applicable testing and validation.",
  },
} as const;

/** What to bring to a first conversation, by sector. Questions, not claims (KB §24). */
export const FIRST_CONVERSATION: Record<Exclude<SectorId, "home">, [string, string][]> = {
  upholstery: [
    ["The product", "The furniture or interior the fabric is for, and its market."],
    ["The feel", "Texture, hand feel, stretch and surface character."],
    ["The programme", "A sample development or a commercial repeat programme."],
  ],
  industrial: [
    ["The application", "What the fabric must do in the final product."],
    ["The parameters", "Strength, stability, stretch, airflow or moisture behaviour, if known."],
    ["The validation", "The testing or specification it will be measured against."],
  ],
  medical: [
    ["The use", "Where the textile will be used, and by whom."],
    ["The requirements", "Comfort, hygiene and durability needs, and any regulations that apply."],
    ["The validation", "The testing required for its intended use."],
  ],
};
