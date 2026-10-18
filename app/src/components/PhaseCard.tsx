import type { Phase } from '../content/phases';

type Props = Readonly<{
  phase: Phase;
  align: 'left' | 'right';
}>;

export function PhaseCard({ phase, align }: Props) {
  return (
    <section className="flex min-h-[100svh] items-center px-5 py-24 sm:px-8 md:px-16">
      <article
        data-reveal
        className={`w-full max-w-md rounded-2xl border border-charcoal/5 bg-linen/85 p-6 shadow-[0_24px_60px_-30px_rgba(43,39,36,0.4)] backdrop-blur-md sm:p-8 md:rounded-3xl md:p-11 ${
          align === 'left' ? 'mr-auto' : 'ml-auto'
        }`}
      >
        <div className="flex items-baseline gap-3 md:gap-4">
          <span className="font-serif text-sm text-terracotta">{phase.chapter}</span>
          <p className="font-sans text-[11px] font-semibold tracking-[0.22em] text-terracotta uppercase md:text-xs">
            {phase.eyebrow}
          </p>
        </div>
        <h2 className="mt-4 font-serif tracking-[-0.015em] text-charcoal text-[clamp(1.65rem,4.5vw,2.35rem)] leading-[1.15]">
          {phase.title}
        </h2>
        <p className="mt-5 font-sans text-[15px] leading-[1.8] text-charcoal/85 md:text-base">
          {phase.body}
        </p>
      </article>
    </section>
  );
}
