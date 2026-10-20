// ─────────────────────────────────────────────────────────────────────────────
// Site-wide contact channels.
//
// WHATSAPP_NUMBER: full international format, digits only — country code
// first, no "+", no spaces, no dashes. Current: +91-9867103837 → 919867103837
// ─────────────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '919867103837';

/** Builds an official WhatsApp Click-to-Chat URL with any pre-filled message
 *  (a plain <a href> / window.open target — no SDK, no script, no tracking). */
export const buildWhatsAppUrl = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Default first message for the header CTA and the floating badge.
const WHATSAPP_MESSAGE =
  'Hi! I just saw your portfolio on Celestial Designs and would like to inquire about a home interior consultation.';

export const WHATSAPP_CHAT_URL = buildWhatsAppUrl(WHATSAPP_MESSAGE);
