export function Hero() {
  return (
    <section data-hero className="relative flex min-h-[100svh] items-end px-6 pb-24 sm:pb-28 md:px-16">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-linen/85 via-linen/35 to-transparent" />
      <div data-hero-inner className="relative max-w-2xl">
        <p data-hero-line className="font-sans text-[11px] font-semibold tracking-[0.22em] text-charcoal/75 uppercase md:text-xs">
          Celestial Designs · Interiors for real life
        </p>
        <h1
          data-hero-line
          className="mt-5 font-serif font-medium tracking-[-0.02em] text-charcoal text-[clamp(2.7rem,8vw,4.75rem)] leading-[1.04]"
        >
          A home that
          <br />
          keeps its rhythm.
        </h1>
        <p
          data-hero-line
          className="mt-6 max-w-lg font-sans text-[15px] leading-[1.8] text-charcoal/85 md:text-[17px]"
        >
          Walk through one ordinary day in a home we designed — from the first
          quiet coffee to the last warm light. Scroll slowly. This is how your
          days could feel.
        </p>
        <div
          data-hero-line
          className="mt-10 flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.2em] text-charcoal/65 uppercase md:text-xs"
        >
          <span className="inline-block h-px w-10 bg-charcoal/40" />
          Scroll to step inside
        </div>
      </div>
    </section>
  );
}
