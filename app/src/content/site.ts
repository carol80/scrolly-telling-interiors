// ═════════════════════════════════════════════════════════════════════════════
// SITE CONFIG — the one file to edit for branding & contact details.
//
//   • Rebranding:       change BRAND.name / BRAND.tagline / BRAND.footerLine
//                       (every component — header, hero, footer, WhatsApp
//                       messages, form — reads from here automatically)
//   • WhatsApp number:  WHATSAPP_NUMBER, full international format, digits
//                       only (country code first, no "+", spaces or dashes)
//                       e.g. +91-9869393993 → '919869393993'
//
// ALSO (static HTML, not reachable from this file — search for "REBRAND"):
//   app/index.html  →  <title> and the meta description
// ═════════════════════════════════════════════════════════════════════════════

export const BRAND = {
  name: 'JV Interiors',
  tagline: 'Interiors for real life',
  footerLine: 'Residential interiors',
} as const;

const WHATSAPP_NUMBER = '919869393993';

/** Builds an official WhatsApp Click-to-Chat URL with any pre-filled message
 *  (a plain <a href> / window.open target — no SDK, no script, no tracking). */
export const buildWhatsAppUrl = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Default first message for the header CTA and the floating badge.
const WHATSAPP_MESSAGE = `Hi! I just saw your portfolio on ${BRAND.name} and would like to inquire about a home interior consultation.`;

export const WHATSAPP_CHAT_URL = buildWhatsAppUrl(WHATSAPP_MESSAGE);
