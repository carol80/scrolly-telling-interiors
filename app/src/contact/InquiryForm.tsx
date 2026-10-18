import { useState, type FormEvent } from 'react';

const TIMELINES = [
  'Within 3 months',
  '3 to 6 months',
  '6 to 12 months',
  'Over a year out',
];

type Status = 'idle' | 'sending' | 'sent';

export function InquiryForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    // No backend is wired up yet. Replace this with the real endpoint.
    window.setTimeout(() => setStatus('sent'), 600);
  };

  if (status === 'sent') {
    return (
      <p className="font-serif text-xl text-charcoal">
        Thank you. Your note is on its way, and we will be in touch.
      </p>
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
        disabled={status === 'sending'}
        className="w-full rounded-full bg-terracotta px-6 py-3 font-sans text-base font-semibold text-linen transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Start the conversation'}
      </button>
    </form>
  );
}
