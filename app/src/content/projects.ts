// ─────────────────────────────────────────────────────────────────────────────
// Project gallery content + automatic photo discovery.
//
// HOW TO ADD PHOTOS — no code changes needed:
// 1. Find (or create) the folder for the project: app/src/assets/projects/<slug>/
//    Slugs are listed in PROJECT_DEFS below (oak-kitchen, garden-room,
//    loft-study). New project = new entry here + a matching folder.
// 2. Drop the photos in:
//      01-wide.jpg    hero shot        04-detail.jpg  material close-up
//      02-angle.jpg   alternate angle  05-detail.jpg  material close-up
//      03-angle.jpg   alternate angle  06-before.jpg  the "before" state
//    Files named this way get the right role and position. Any other photo
//    you drop in the folder is picked up automatically and appended at the
//    end of the carousel (.jpg .jpeg .png .webp .avif).
// 3. Done — the carousel, thumbnails, counter and lightbox rebuild from
//    whatever is in the folder. Photos are display-fitted into the 16:10
//    frame (cropped to fill, never distorted) and lazy-loaded.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectImageKind = 'wide' | 'angle' | 'detail' | 'before';

export type ProjectImage = {
  /** Resolved URL once the photo exists; null renders the styled placeholder. */
  src: string | null;
  file: string;
  kind: ProjectImageKind;
  alt: string;
};

export type Project = {
  id: string;
  name: string;
  location: string;
  summary: string;
  /** Curated alt text keyed by canonical filename (e.g. '01-wide.jpg').
   *  Photos without an entry fall back to a generated description. */
  captions?: Record<string, string>;
  images: ProjectImage[];
};

export const KIND_LABEL: Record<ProjectImageKind, string> = {
  wide: 'Wide view',
  angle: 'Alternate angle',
  detail: 'Material close-up',
  before: 'Before',
};

// Vite picks up every photo in every project folder at build/dev time and
// hands us a ready-to-use URL (content-hashed, rewritten for GitHub Pages'
// /scrolly-telling-interiors/ base automatically).
const imageModules = import.meta.glob('../assets/projects/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Fallback set shown while a project's folder is still empty — the section
// keeps its gallery shape; placeholders vanish as soon as photos land.
const PLACEHOLDER_SET: Array<{ file: string; kind: ProjectImageKind }> = [
  { file: '01-wide.jpg', kind: 'wide' },
  { file: '02-angle.jpg', kind: 'angle' },
  { file: '03-angle.jpg', kind: 'angle' },
  { file: '04-detail.jpg', kind: 'detail' },
  { file: '05-detail.jpg', kind: 'detail' },
  { file: '06-before.jpg', kind: 'before' },
];

const buildImages = (project: Pick<Project, 'id' | 'name' | 'captions'>): ProjectImage[] => {
  const prefix = `../assets/projects/${project.id}/`;

  const discovered = Object.entries(imageModules)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, src]) => {
      const file = path.slice(prefix.length);
      // Canonical names ("03-angle.jpg") carry an explicit role + position.
      const canonical = /^(\d{2})-(wide|angle|detail|before)\./i.exec(file);
      return {
        src,
        file,
        kind: (canonical ? canonical[2] : 'angle') as ProjectImageKind,
        rank: canonical ? Number(canonical[1]) : 1000,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.file.localeCompare(b.file))
    .map((entry) => ({
      ...entry,
      alt:
        project.captions?.[entry.file.toLowerCase()] ??
        `${project.name} — ${KIND_LABEL[entry.kind]}`,
    }));

  if (discovered.length > 0) return discovered;

  return PLACEHOLDER_SET.map(({ file, kind }) => ({
    src: null,
    file,
    kind,
    alt: project.captions?.[file] ?? `${project.name} — ${KIND_LABEL[kind]}`,
  }));
};

const PROJECT_DEFS: Array<Omit<Project, 'images'>> = [
  {
    id: 'oak-kitchen',
    name: 'The Oak Kitchen',
    location: 'Terraced house · North London',
    summary:
      'A galley kitchen opened into the garden, built around one long oak island where the whole family drifts each morning.',
    captions: {
      '01-wide.jpg': 'Wide view of the oak kitchen with island under morning light',
      '02-angle.jpg': 'View from the garden doors back toward the cooking run',
      '03-angle.jpg': 'Breakfast end of the island with pendant lights',
      '04-detail.jpg': 'Close-up of oiled oak grain and brass pull',
      '05-detail.jpg': 'Limestone worktop edge and splashback junction',
      '06-before.jpg': 'The same kitchen before renovation, boxed in and dark',
    },
  },
  {
    id: 'garden-room',
    name: 'The Garden Room',
    location: 'Semi-detached · East London',
    summary:
      'A dim back living room reworked into an open plan space that follows the sun — desk nook by day, long table by night.',
    captions: {
      '01-wide.jpg': 'Wide view of the open plan garden room at midday',
      '02-angle.jpg': 'Window-side desk nook in afternoon light',
      '03-angle.jpg': 'Dining end with pendant lights over the table',
      '04-detail.jpg': 'Close-up of sage upholstery weave and oak armrest',
      '05-detail.jpg': 'Shelving detail with books and ceramics',
      '06-before.jpg': 'The back room before works, single aspect and dim',
    },
  },
  {
    id: 'loft-study',
    name: 'The Loft Study',
    location: 'End-of-terrace · South London',
    summary:
      'An unused loft turned into a calm work-and-read retreat — built-ins swallow the clutter, the skyline does the decorating.',
    captions: {
      '01-wide.jpg': 'Wide view of the loft study with skylight and built-in desk',
      '02-angle.jpg': 'Reading corner with low chair and floor lamp',
      '03-angle.jpg': 'Built-in shelving wall along the eaves',
      '04-detail.jpg': 'Close-up of painted ply joinery and leather pull',
      '05-detail.jpg': 'Desk detail with task lamp and notebook',
      '06-before.jpg': 'The empty loft before conversion, rafters exposed',
    },
  },
];

export const PROJECTS: Project[] = PROJECT_DEFS.map((project) => ({
  ...project,
  images: buildImages(project),
}));
