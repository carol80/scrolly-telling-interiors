import { useState } from 'react';
import { BRAND, WHATSAPP_CHAT_URL } from '../content/site';

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

// FEATURE 1 — fixed frosted-glass header.
// Pure UI: no data-* hooks, so the GSAP/ScrollTrigger timeline never touches it.
// Sits at z-40: above the content layer (z-10) and old header (z-20),
// below the lightbox (z-50), far below native browser chrome.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`cd-header fixed inset-x-0 top-0 z-40 ${open ? 'cd-menu-open' : ''}`}>
      <div className="cd-header-glass flex items-center justify-between gap-4 px-5 py-3 sm:px-8 md:px-16 md:py-4">
        <a
          href="#top"
          className="shrink-0 font-serif text-base tracking-wide text-charcoal md:text-lg"
          onClick={close}
        >
          {BRAND.name}
        </a>

        {/* Desktop links — hidden below 768px, where the burger takes over */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/70 uppercase md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-terracotta">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 md:gap-3">
          {/* FEATURE 3 anchor #1 — header CTA opens a WhatsApp chat */}
          <a
            href={WHATSAPP_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cd-cta"
          >
            <span className="hidden sm:inline">Book Consultation</span>
            <span className="sm:hidden">Book</span>
          </a>

          {/* Hamburger — collapses the text links below 768px */}
          <button
            type="button"
            className="cd-burger md:hidden"
            aria-expanded={open}
            aria-controls="cd-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel — always mounted, animated via .cd-menu-open */}
      <nav id="cd-mobile-nav" aria-label="Mobile" className="cd-mobile-nav md:hidden">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
