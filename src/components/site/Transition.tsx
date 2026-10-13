import { MaskLine, Parallax } from "./motion";
import { Picture } from "./Picture";

/** Edge-to-edge dark photograph that carries the page from the light chapters into the enquiry. */
export function Transition() {
  return (
    <section aria-labelledby="transition-title" className="on-dark relative isolate bg-charcoal text-on-dark">
      <Parallax className="h-[78svh] min-h-[28rem]" amount={7}>
        <Picture
          name="charcoalDrape"
          sizes="100vw"
          className="h-full w-full object-cover object-[70%_center]"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className="shell absolute inset-0 flex flex-col justify-center">
        <h2 id="transition-title" className="display max-w-[11ch] text-[clamp(3rem,8.4vw,7rem)]">
          <MaskLine>Start with</MaskLine>
          <MaskLine delay={0.08}>the material.</MaskLine>
        </h2>
        <a href="#contact" className="btn btn-light mt-10 w-full sm:w-72">
          Start an enquiry
        </a>
      </div>
    </section>
  );
}
