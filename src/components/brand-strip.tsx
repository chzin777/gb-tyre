import { brands } from "@/lib/site";

/**
 * Brands stocked. A marquee is right here because breadth is the message and no
 * single name needs the reader's attention. This is the only marquee on the page.
 *
 * NOTE: set as wordmarks in the display face. Tyre manufacturers are not covered
 * by any open logo set, so real logo files need to be supplied and dropped in.
 */
export function BrandStrip() {
  const loop = [...brands, ...brands];

  return (
    <section
      aria-label="Tyre brands we stock"
      className="relative border-y border-carbon bg-asphalt-2 py-8 md:py-10"
    >
      <p className="mb-6 text-center font-mono text-[11px] tracking-[0.28em] text-slate-dim uppercase">
        Premium and budget, all sizes, price matched
      </p>

      <div className="marquee-mask overflow-hidden">
        <ul className="marquee-track flex w-max items-center">
          {loop.map((brand, i) => (
            <li key={`${brand}-${i}`} className="flex items-center">
              <span className="px-7 font-display text-2xl font-extrabold tracking-tight text-slate-soft md:px-10 md:text-[32px]">
                {brand}
              </span>
              <span aria-hidden className="tread-band h-3 w-8 opacity-60" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
