import { COMPANY, STRENGTHS } from "@/content/site";
import { Chapter } from "@/components/stage/StageContext";

export function Heritage() {
  return (
    <Chapter
      id="heritage"
      labelledBy="heritage-title"
      className="border-t border-rule px-[var(--gutter)] py-20 lg:py-32"
    >
      <h2
        id="heritage-title"
        className="display max-w-[40rem] text-[clamp(2.1rem,3.9vw,4rem)] text-ink"
      >
        <span className="block">Textile know-how,</span>
        <span className="block">since {COMPANY.heritageYear}.</span>
      </h2>

      <div className="mt-10 space-y-5">
        <p className="copy text-ink">
          ACTIF Global Ventures is a unit of {COMPANY.parent}, based in Tiruppur, India&rsquo;s
          knitwear capital.
        </p>
        <p className="copy text-ink-soft">
          We develop and manufacture knitted textiles for home, interior, industrial and healthcare
          use, with every stage from yarn to finished pack under one roof. Heritage is the reason
          we know how a fabric should behave; development is how we make it behave for your
          product.
        </p>
      </div>

      <h3 className="mt-16 text-sm font-medium text-ink">Why partners work with ACTIF</h3>
      <ul className="mt-4 border-t border-rule">
        {STRENGTHS.map((item) => (
          <li
            key={item.title}
            className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8"
          >
            <p className="display text-[1.375rem] leading-[1.15] text-ink">{item.title}</p>
            <p className="max-w-[44ch] text-[0.9375rem] text-ink-soft">{item.body}</p>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
