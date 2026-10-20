import { useEffect, useRef, useState, type KeyboardEvent, type UIEvent } from 'react';
import { KIND_LABEL, PROJECTS, type Project, type ProjectImage } from '../content/projects';

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 — Project showcase.
// A snap-scrolling horizontal carousel per project (featured frame + arrows +
// thumbnail strip) with a click-to-expand lightbox. Everything here is plain
// DOM + CSS scroll-snap: zero libraries, zero impact on the 3D canvas — the
// section only joins the existing reveal system via `data-reveal`.
// ─────────────────────────────────────────────────────────────────────────────

type SlideMediaProps = Readonly<{
  image: ProjectImage;
  eager?: boolean;
}>;

// Renders the real photo when `src` is set, otherwise a styled placeholder so
// the layout is presentable before any images are added.
function SlideMedia({ image, eager = false }: SlideMediaProps) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    );
  }
  return (
    <div className="cd-placeholder" role="img" aria-label={image.alt}>
      <span>{KIND_LABEL[image.kind]}</span>
    </div>
  );
}

type ShowcaseProps = Readonly<{
  project: Project;
  eagerFirst: boolean;
  onOpen: (projectId: string, index: number) => void;
}>;

function ProjectShowcase({ project, eagerFirst, onOpen }: ShowcaseProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const count = project.images.length;

  // Derive the active slide from scroll position (works for swipe, trackpad
  // and arrow buttons alike).
  const handleTrackScroll = (event: UIEvent<HTMLUListElement>) => {
    const track = event.currentTarget;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setActive(best);
  };

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(index, 0), count - 1);
    const slide = track.children[clamped] as HTMLElement | undefined;
    // Horizontal-only scroll: block:'nearest' stops the page itself jumping.
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <article
      data-reveal
      className="cd-project w-full rounded-2xl border border-charcoal/5 bg-linen/85 p-6 shadow-[0_24px_60px_-30px_rgba(43,39,36,0.4)] backdrop-blur-md sm:p-8 md:rounded-3xl md:p-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-serif tracking-[-0.015em] text-charcoal text-[clamp(1.4rem,3.2vw,1.9rem)] leading-tight">
          {project.name}
        </h3>
        <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-charcoal/55 uppercase">
          {project.location}
        </p>
      </div>
      <p className="mt-2 max-w-2xl font-sans text-[15px] leading-[1.7] text-charcoal/80">
        {project.summary}
      </p>

      <div className="cd-carousel mt-6">
        <ul ref={trackRef} className="cd-carousel-track" onScroll={handleTrackScroll}>
          {project.images.map((image, i) => (
            <li key={image.file} className="cd-slide">
              <button
                type="button"
                className="cd-frame"
                onClick={() => onOpen(project.id, i)}
                aria-label={`Enlarge photo ${i + 1} of ${count}: ${image.alt}`}
              >
                <SlideMedia image={image} eager={eagerFirst && i === 0} />
                <span className="cd-slide-badge" data-kind={image.kind} aria-hidden="true">
                  {KIND_LABEL[image.kind]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="cd-arrow cd-arrow--prev"
          onClick={() => scrollToSlide(active - 1)}
          disabled={active === 0}
          aria-label="Previous photo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="cd-arrow cd-arrow--next"
          onClick={() => scrollToSlide(active + 1)}
          disabled={active === count - 1}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="cd-thumbs" role="group" aria-label={`${project.name} thumbnails`}>
          {project.images.map((image, i) => (
            <button
              key={image.file}
              type="button"
              className="cd-thumb"
              data-active={i === active}
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to photo ${i + 1} of ${count}`}
              aria-current={i === active}
            >
              <SlideMedia image={image} eager={eagerFirst && i === 0} />
            </button>
          ))}
        </div>
        <p className="cd-counter font-serif text-sm text-charcoal/70" aria-hidden="true">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      </div>
    </article>
  );
}

type LightboxProps = Readonly<{
  project: Project;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}>;

// Fullscreen viewer. Esc / backdrop click closes, arrow keys navigate,
// background scroll is locked (with scrollbar-width compensation so the
// layout doesn't shift while ScrollTrigger is mid-scrub).
function ProjectLightbox({ project, index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = project.images.length;
  const image = project.images[index];

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose();
    if (event.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
    if (event.key === 'ArrowRight' && index < count - 1) onNavigate(index + 1);
  };

  return (
    <div
      className="cd-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} — photo ${index + 1} of ${count}`}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={closeRef}
        type="button"
        className="cd-lightbox-close"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <figure className="cd-lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <div className="cd-lightbox-media">
          <SlideMedia image={image} eager />
        </div>
        <figcaption className="cd-lightbox-caption">
          <span>{image.alt}</span>
          <span className="cd-counter">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </figcaption>

        <button
          type="button"
          className="cd-arrow cd-lightbox-arrow--prev"
          onClick={() => onNavigate(index - 1)}
          disabled={index === 0}
          aria-label="Previous photo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="cd-arrow cd-lightbox-arrow--next"
          onClick={() => onNavigate(index + 1)}
          disabled={index === count - 1}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </figure>
    </div>
  );
}

export function ProjectGallery() {
  const [lightbox, setLightbox] = useState<{ projectId: string; index: number } | null>(null);

  // Remember what had focus when the lightbox opened, and hand it back on close.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const openLightbox = (projectId: string, index: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setLightbox({ projectId, index });
  };
  const closeLightbox = () => {
    setLightbox(null);
    lastFocusedRef.current?.focus();
  };

  const lightboxProject = lightbox
    ? PROJECTS.find((p) => p.id === lightbox.projectId) ?? null
    : null;

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative scroll-mt-24 px-5 py-24 sm:px-8 md:px-16 md:py-32"
    >
      {/* Deliberately NO full-bleed backdrop here: the 3D scene — and its
          evening-light pass — must stay visible behind this stretch of scroll.
          Readability comes from frosted-glass cards around every text block,
          the same recipe as the story cards (bg-linen/85 + backdrop-blur). */}
      <div className="mx-auto w-full max-w-6xl">
        <div
          data-reveal
          className="max-w-2xl rounded-2xl border border-charcoal/5 bg-linen/85 p-6 shadow-[0_24px_60px_-30px_rgba(43,39,36,0.4)] backdrop-blur-md sm:p-8 md:rounded-3xl"
        >
          <p className="font-sans text-[11px] font-semibold tracking-[0.22em] text-sage uppercase md:text-xs">
            Selected work
          </p>
          <h2
            id="projects-title"
            className="mt-4 font-serif tracking-[-0.015em] text-charcoal text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.1]"
          >
            Rooms we&rsquo;ve brought to life.
          </h2>
          <p className="mt-5 font-sans text-[15px] leading-[1.8] text-charcoal/85 md:text-base">
            Real homes, photographed the week the keys changed hands — wide
            views, material close-ups, and the &ldquo;before&rdquo; that proves
            it happened. Tap any image to look closer.
          </p>
        </div>

        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {PROJECTS.map((project, i) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              eagerFirst={i === 0}
              onOpen={openLightbox}
            />
          ))}
        </div>
      </div>

      {lightbox && lightboxProject && (
        <ProjectLightbox
          project={lightboxProject}
          index={lightbox.index}
          onClose={closeLightbox}
          onNavigate={(index) => setLightbox({ projectId: lightbox.projectId, index })}
        />
      )}
    </section>
  );
}
