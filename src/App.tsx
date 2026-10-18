import { useRef } from 'react';
import { HomeScene } from './scene/HomeScene';
import { useSceneTimeline } from './scene/useSceneTimeline';
import { PHASES } from './content/phases';
import { Hero } from './components/Hero';
import { PhaseCard } from './components/PhaseCard';
import { InquiryForm } from './contact/InquiryForm';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'We listen first',
    body: 'One honest conversation about your days, your budget, and what isn’t working. No moodboards yet, no pressure.',
  },
  {
    step: '02',
    title: 'Design, in plain language',
    body: 'Layouts, materials and a 3D preview of your rooms — with every cost written down before a thing is ordered.',
  },
  {
    step: '03',
    title: 'Built, week by week',
    body: 'Vetted local trades, a fixed schedule, and a walkthrough together every Friday until the keys are yours.',
  },
];

export function App() {
  const storyRef = useRef<HTMLDivElement>(null);
  useSceneTimeline(storyRef);

  return (
    <>
      <HomeScene />

      <div
        data-veil
        className="pointer-events-none fixed inset-0 z-[5] bg-linen/85 opacity-0 backdrop-blur-xl"
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[3px] bg-charcoal/5">
        <div data-progress className="h-full w-full origin-left scale-x-0 bg-terracotta" />
      </div>

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8 md:px-16 md:py-5">
        <a href="#top" className="font-serif text-base tracking-wide text-charcoal md:text-lg">
          Celestial Designs
        </a>
        <nav className="hidden items-center gap-8 font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/70 uppercase md:flex">
          <a href="#story" className="transition-colors hover:text-terracotta">
            The day
          </a>
          <a href="#process" className="transition-colors hover:text-terracotta">
            Process
          </a>
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-charcoal/20 bg-linen/40 px-4 py-2 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal uppercase backdrop-blur-sm transition-colors hover:border-terracotta hover:text-terracotta md:px-5"
        >
          Start a project
        </a>
      </header>

      <main ref={storyRef} id="top" className="relative z-10">
        <Hero />

        <div id="story">
          {PHASES.map((phase, i) => (
            <PhaseCard key={phase.id} phase={phase} align={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>

        <section
          id="contact"
          data-contact
          className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-8 md:px-16"
        >
          <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <div data-reveal className="flex flex-col justify-center">
              <p className="font-sans text-[11px] font-semibold tracking-[0.22em] text-sage uppercase md:text-xs">
                Trust & reality
              </p>
              <h2 className="mt-4 font-serif tracking-[-0.015em] text-charcoal text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.1]">
                From dream,
                <br />
                to drawing,
                <br />
                to done.
              </h2>
              <p className="mt-5 max-w-md font-sans text-[15px] leading-[1.8] text-charcoal/85 md:text-base">
                A beautiful 3D daydream only matters if it can be built — on a
                real budget, on a real street, for a real family. Here is
                exactly how we get you there.
              </p>
              <div className="mt-9 space-y-6">
                {PROCESS_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-5">
                    <span className="font-serif text-sm text-terracotta">{s.step}</span>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-charcoal">{s.title}</h3>
                      <p className="mt-1 max-w-sm font-sans text-sm leading-relaxed text-charcoal/75">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              data-reveal
              className="w-full self-center rounded-2xl border border-charcoal/5 bg-linen/90 p-6 shadow-[0_24px_60px_-30px_rgba(43,39,36,0.4)] backdrop-blur-md sm:p-8 md:rounded-3xl md:p-11"
            >
              <h3 className="font-serif tracking-[-0.015em] text-charcoal text-[clamp(1.5rem,4vw,2rem)] leading-tight">
                Tell us how your days go.
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/75">
                Your timeline, your must-haves, your half-formed ideas — we’ll
                turn them into a plan. We reply within two working days.
              </p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 px-6 pb-14 pt-6 text-center">
          <p className="font-serif text-base text-charcoal/75">A home that keeps its rhythm.</p>
          <p className="mt-2 font-sans text-[11px] tracking-[0.16em] text-charcoal/55 uppercase">
            Celestial Designs · Residential interiors · © 2026
          </p>
        </footer>
      </main>
    </>
  );
}
