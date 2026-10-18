export type Phase = {
  id: string;
  chapter: string;
  eyebrow: string;
  title: string;
  body: string;
};

export const PHASES: Phase[] = [
  {
    id: 'morning',
    chapter: '01',
    eyebrow: 'The quiet morning',
    title: 'The day starts gently, in the kitchen.',
    body: 'Morning light first. Coffee on the island, the counter still clear, the house still yours. We design for this hour — a wide window, warmth underfoot, somewhere unhurried to stand before the day asks anything of you.',
  },
  {
    id: 'afternoon',
    chapter: '02',
    eyebrow: 'The afternoon rhythm',
    title: 'Materials that can take a real life.',
    body: 'Oak that deepens where hands rest. Stone that shrugs off spilled juice. Textiles chosen for muddy shoes and Sunday naps. Nothing precious, nothing temporary — surfaces that grow more beautiful the more your family uses them.',
  },
  {
    id: 'openplan',
    chapter: '03',
    eyebrow: 'One room, many lives',
    title: 'Work, play, and dinner share one room.',
    body: 'A desk nook in the window light, deep drawers that swallow the clutter, sightlines that keep everyone in view. The room bends around your day — homework at one end, a slow lunch at the other — and never feels crowded.',
  },
  {
    id: 'evening',
    chapter: '04',
    eyebrow: 'The evening pivot',
    title: 'When the lamps come on, the house exhales.',
    body: 'The sun drops, the room turns amber, and pendants glow over the table while dinner runs long. We plan the lighting for this exact hour, because evenings are when a house stops being a project and starts being a home.',
  },
  {
    id: 'recap',
    chapter: '05',
    eyebrow: 'Looking back',
    title: 'Every room is part of one day.',
    body: 'From the first quiet coffee to the last conversation, a well-designed home holds the whole rhythm without asking you to notice it. That is what we design — not a showroom, but the backdrop for your ordinary, extraordinary days.',
  },
];
