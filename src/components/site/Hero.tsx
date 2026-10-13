import { COMPANY } from "@/content/site";
import { ClipReveal, MaskLine, Parallax } from "./motion";
import { ImageNote } from "./ImageNote";
import { Picture } from "./Picture";

/**
 * A printed-plate composition on the ivory ground: the headline sets the scale, a tall macro of
 * the knit stands against it, and a wide room scene overlaps the macro's edge. Memorable with
 * every animation off; motion only adds the entrance.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-ivory pt-[calc(var(--header-h)+1.5rem)] pb-[var(--space-continue)] md:pt-[calc(var(--header-h)+2.5rem)]"
    >
      <div className="shell hero-grid">
        <h1
          id="hero-title"
          className="display area-title text-[clamp(2.6rem,11.2vw,4.5rem)] text-ink md:text-[clamp(3.8rem,7.6vw,5.1rem)] xl:text-[clamp(4.6rem,6.7vw,6rem)]"
        >
          <span className="sr-only">ACTIF Global Ventures: </span>
          <MaskLine immediate>Knitted textiles</MaskLine>
          <MaskLine immediate delay={0.09}>
            for home, interiors,
          </MaskLine>
          <MaskLine immediate delay={0.18}>
            industry and <em>care.</em>
          </MaskLine>
        </h1>

        <ClipReveal className="area-macro md:min-h-[26rem]" delay={0.2}>
          <div className="grain relative aspect-[4/3] overflow-hidden bg-linen md:aspect-auto md:h-full md:min-h-[26rem]">
            <Parallax className="absolute inset-0" amount={3}>
              <Picture
                name="macroSoft"
                priority
                sizes="(min-width:1280px) 30vw, (min-width:768px) 40vw, 92vw"
                alt="Close view of oatmeal knitted jersey folding in a diagonal ridge"
                className="h-full w-full object-cover object-[50%_40%]"
              />
            </Parallax>
            <ImageNote tone="ink" />
          </div>
        </ClipReveal>

        <div className="area-text self-end [animation:fade-in_1.2s_ease_0.8s_both]">
          <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-soft">
            Developed and made in Tiruppur, India. A unit of {COMPANY.parent}, with textile heritage
            since {COMPANY.heritageYear}.
          </p>
          <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8 xl:flex-col xl:items-start xl:gap-1">
            <a href="#applications" className="btn w-full sm:w-auto sm:min-w-64">
              Explore applications
            </a>
            <a href="#contact" className="btn-quiet w-fit">
              Start an enquiry
            </a>
          </div>
        </div>

        <ClipReveal
          className="area-bed relative z-10 xl:-mr-14 xl:self-end"
          delay={0.45}
        >
          <div className="grain relative aspect-[16/10] overflow-hidden shadow-[0_0_0_10px_var(--ivory)] md:aspect-[16/9] xl:aspect-[16/10]">
            <Picture
              name="homeInterior"
              sizes="(min-width:1280px) 44vw, (min-width:768px) 54vw, 92vw"
              alt="A calm bedroom corner with neutral linen bedding"
              className="h-full w-full object-cover object-[40%_60%]"
            />
            <ImageNote />
          </div>
        </ClipReveal>
      </div>
    </section>
  );
}
