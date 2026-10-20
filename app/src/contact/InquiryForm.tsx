import { useState, type FormEvent } from 'react';
import { BRAND, buildWhatsAppUrl } from '../content/site';

const TIMELINES = [
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'Over a year out',
];

export function InquiryForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const timeline = String(data.get('timeline') ?? '').trim();
    const ideas = String(data.get('ideas') ?? '').trim();

    // Structured WhatsApp message — *asterisks* render as bold in WhatsApp,
    // \n becomes a real line break via encodeURIComponent.
    const lines: Array<string | null> = [
      `Hi ${BRAND.name}!`,
      '',
      'I just viewed your portfolio on your website and would like to enquire about a home interior consultation.',
      '',
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Project timeline:* ${timeline}`,
      ideas ? `*Ideas for the home:* ${ideas}` : null,
    ];
    const message = lines.filter((line): line is string => line !== null).join('\n');

    // Open WhatsApp in a new tab. window.open with 'noopener' can return null
    // even on success in some browsers, so drop the opener manually instead
    // and only fall back to a same-tab redirect when the popup was blocked.
    const tab = window.open(buildWhatsAppUrl(message), '_blank');
    if (tab) {
      tab.opener = null;
    } else {
      window.location.href = buildWhatsAppUrl(message);
    }
    setSentTo(name);
  };

  if (sentTo !== null) {
    return (
      <div>
        <p className="font-serif text-xl text-charcoal">
          Thank you{sentTo ? `, ${sentTo}` : ''}. WhatsApp should have opened with
          your note ready to send — we reply within two working days.
        </p>
        <p className="mt-3 font-sans text-sm text-charcoal/65">
          Didn&rsquo;t open?{' '}
          <a
            href={buildWhatsAppUrl(
              `Hi ${BRAND.name}! I would like to enquire about a home interior consultation.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-terracotta underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Tap here to chat with us directly.
          </a>
        </p>
      </div>
    );
  }

  const field =
    'mt-2 w-full rounded-lg border border-charcoal/15 bg-white/80 px-4 py-3 font-sans text-[15px] text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20';
  const label = 'block font-sans text-sm font-medium text-charcoal';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className={label}>
        Name
        <input name="name" type="text" required autoComplete="name" className={field} />
      </label>

      <label className={label}>
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>

      <label className={label}>
        When would you like to start?
        <select name="timeline" required defaultValue="" className={field}>
          <option value="" disabled>
            Choose a timeline
          </option>
          {TIMELINES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className={label}>
        What should your home feel like?
        <textarea
          name="ideas"
          rows={4}
          placeholder="A bigger kitchen, a reading nook, a table that seats everyone..."
          className={field}
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-terracotta px-6 py-3 font-sans text-base font-semibold text-linen transition-opacity hover:opacity-90"
      >
        Start the conversation
      </button>
      <p className="text-center font-sans text-xs leading-relaxed text-charcoal/55">
        Opens WhatsApp with your note pre-filled — nothing is stored on this site.
      </p>
    </form>
  );
}
