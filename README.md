# A Home That Keeps Its Rhythm

A scrollytelling website for a residential interior design studio. A single 3D home is fixed behind the page. As the visitor scrolls, the camera moves through the house and the light shifts across one day: a quiet morning, an afternoon of real life, an open-plan evening, and an overview.

The goal is warm and human, not a cold architecture moodboard. The copy is written for people planning their forever home.

> **Status: prototype.** The story, camera motion, and layout work end to end against a sample scene. The real home scene, real copy, and the inquiry backend are not done yet. See [What is missing](#what-is-missing-right-now).

---

## Contents

1. [Quick start](#quick-start)
2. [The story](#the-story)
3. [How it works](#how-it-works)
4. [The Spline scene contract](#the-spline-scene-contract)
5. [Tuning the camera and lights](#tuning-the-camera-and-lights)
6. [Editing content and design](#editing-content-and-design)
7. [The inquiry form](#the-inquiry-form)
8. [Project structure](#project-structure)
9. [Scripts](#scripts)
10. [Testing and verification](#testing-and-verification)
11. [What is needed to finish](#what-is-needed-to-finish)
12. [What is missing right now](#what-is-missing-right-now)
13. [Brief for the Spline scene](#brief-for-the-spline-scene)
14. [Agents](#agents)

---

## Quick start

Requirements: Node 20 or newer (tested with Node 25.8 and npm 11), and a modern browser with WebGL.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The page needs a Spline scene. Point it at a published `.splinecode` file with an env var in `.env.local` (create this file at the project root; it is not created for you):

```bash
VITE_SPLINE_SCENE=https://prod.spline.design/<id>/scene.splinecode
```

If the variable is not set, the code falls back to `/scene/home.splinecode`. Put the file at `public/scene/home.splinecode` for that path. Note that the `public/` folder does not exist yet; create it when you add the scene.

If no scene loads, the story still renders over a plain charcoal background. The scene error is logged to the console and the rest of the page keeps working.

---

## The story

The page is one long scroll with five story phases, followed by the inquiry section and a footer. The 3D camera and lights are tied to the whole page, so each phase is a stretch of scroll rather than a stop.

| # | Phase | Copy (eyebrow / title) | Camera (keyframe) | Light |
|---|-------|------------------------|-------------------|-------|
| 1 | The quiet morning | The quiet morning / A fresh start, before anyone else is up. | Wide, elevated view that dollies down to the breakfast bar (`waking`) | Full morning sun |
| 2 | The afternoon rhythm | The afternoon rhythm / Materials that can take a real life. | Macro zoom onto the table grain; cursor parallax is on here (`tactile`) | Sun at 90% |
| 3 | The expansive shift | Open sightlines / Work, play, and dinner share one room. | Pulls back and pans across the open plan (`open-plan`) | Sun at 70%, pendants start |
| 4 | The evening pivot | The evening pivot / The day slows down and the house gets warm. | Settles on the seating area (`dusk`) | Sun at 15%, pendants on |
| 5 | Looking back | Looking back / Every room is part of one day. | Jibs up and out to an overview (`overview`) | Sun almost off, pendants on |

Then comes the inquiry section ("Tell us how your days go.") and a footer.

Phase text lives in `src/content/phases.ts`. Camera and light values live in `src/scene/cameraRig.ts`.

---

## How it works

### Layers

```
┌───────────────────────────────────────────────────┐
│ <main>  story sections, form, footer   z-10       │  scrolls normally
│   (each card has a translucent linen background)  │
├───────────────────────────────────────────────────┤
│ SplineBackground   fixed, full-bleed   z-0         │  pointer-events: none
│   <Spline scene=…/>  (canvas)                     │
└───────────────────────────────────────────────────┘
```

The Spline layer is `position: fixed` and ignores pointer events, so the page scrolls and reads normally. The copy cards sit on top with a translucent background so the house stays visible behind them.

### Data flow

1. `App.tsx` renders `SplineBackground` and the story. It keeps the loaded Spline `Application` in state.
2. `SplineBackground` renders `<Spline>` from `@splinetool/react-spline`. Its `onLoad` callback passes the `Application` back up with `onReady`.
3. `useSplineCameraTimeline(storyRef, app)` runs once the `Application` exists:
   - **Scroll timeline.** A paused GSAP timeline tweens a plain `state` object across the keyframes. A `ScrollTrigger` scrubs that timeline over the whole `<main>` element with `scrub: 2`, so motion lags the scroll by about two seconds and feels weighted.
   - **Per-frame draw.** A `gsap.ticker` callback copies `state` into the scene every frame: the camera rig's position and rotation, the sun's intensity, and the pendant lights. It also adds the cursor parallax on top of the rotation.
   - **Lazy lookup.** Scene objects are found by name on each tick until they exist. Lights remember their authored intensity, so the scene's own values are scaled rather than overwritten.
4. `SceneErrorBoundary` wraps the Spline element. A scene that fails to load renders nothing in place of the canvas, and the story stays up.

### Why the camera is a named object

The Spline runtime does not expose a camera handle. Its types contain no `currentCamera` property, and `goToState` is not a valid event name. The valid event names are `mouseDown`, `mouseUp`, `mouseHover`, `keyDown`, `keyUp`, `start`, `lookAt`, `follow`, `scroll`, `collision`, and `rendered`.

So the camera is driven through objects:

- `CameraRig` (an empty in the Spline file) is the object the code moves. The scene camera is parented to it.
- If `CameraRig` is missing, the code falls back to `Default Camera`, which is the camera Spline exports by default. Moving that camera works. It was verified in a browser.

Rotation values in `cameraRig.ts` are in degrees. The code converts them to radians, because the runtime returns three.js Euler angles in radians.

### Parallax

`pointermove` updates a normalized pointer position. Each tick, the displayed cursor position eases toward the pointer (`PARALLAX_EASE = 0.04`). The offset is added to the rig's rotation, scaled by the keyframe's `parallax` value (0 to 1) and `PARALLAX_MAX_DEG` (3 degrees). Only the `tactile` keyframe sets `parallax: 1`, so the drift is strongest during the macro zoom and fades out on either side of it.

---

## The Spline scene contract

The code finds these objects by name. Names are case-sensitive and must match exactly.

| Name | Type in Spline | Used for | Required? |
|------|----------------|----------|-----------|
| `CameraRig` | Empty / null object, at the origin | Moved by the scroll timeline. The scene camera is parented to it. | Yes (or `Default Camera`) |
| `Default Camera` | Camera | Fallback if `CameraRig` is missing | Fallback only |
| `SunLight` | Directional light, with shadows on | Sun intensity across the day | Recommended |
| `PendantLight_1` | Point light, above the kitchen island | Turns on at dusk | Recommended |
| `PendantLight_2` | Point light, above the dining table | Turns on at dusk | Recommended |

Other objects in the scene are free to use any name. `UnderCabinetLights` is defined in `cameraRig.ts` but not used yet; see the known issues.

Light handling: the code records each light's authored `intensity` and sets `intensity = base × factor`. Below a factor of 0.01 it also sets `visible = false`. The authored value is therefore the brightest state.

---

## Tuning the camera and lights

All camera and lighting targets live in `src/scene/cameraRig.ts` in the `KEYFRAMES` array:

```ts
{
  id: 'tactile',
  camera: { position: { x: 180, y: 110, z: -40 }, rotation: { x: -4, y: -12, z: 0 } },
  lighting: { sun: 0.9, pendants: 0 },
  parallax: 1,
}
```

- `position` is in scene units, in the same coordinate system as the Spline editor.
- `rotation` is in degrees.
- `lighting.sun` and `lighting.pendants` are multipliers on each light's authored intensity (1 = full).
- `parallax` is 0 to 1.

**The current values are placeholders** written before any real model existed. They were chosen so that the camera visibly moves through a room-sized scene. Once the real scene is in place, tune them in this order:

1. Place `CameraRig` where you want the first frame (the `waking` keyframe).
2. Frame each phase in the Spline editor, then copy the `CameraRig` position and rotation into the matching keyframe.
3. Check each keyframe in the browser. The copy and the lighting must agree; see the known issues below.

The scroll range is set by the page height, not by the number of keyframes. A longer page gives the camera more travel per phase, and it can be lengthened by adding padding to a section.

---

## Editing content and design

**Copy.** Phase text is in `src/content/phases.ts`. The hero eyebrow, the trust and reality section, and the footer are inline in `src/App.tsx`. The inquiry form labels are in `src/contact/InquiryForm.tsx`.

**Colors.** Defined as theme tokens in `src/index.css`:

| Token | Value | Use |
|-------|-------|-----|
| `charcoal` | `#222222` | Body text, page background behind the scene |
| `linen` | `#fdfdfb` | Card backgrounds, base background |
| `cream` | `#f6f1e7` | Available, not used yet |
| `terracotta` | `#b8674a` | Eyebrows, primary button, focus ring |
| `sage` | `#9aa88f` | Trust-section eyebrow |
| `oak` | `#c9a27a` | Available, not used yet |

Pure black and pure white are deliberately avoided.

**Type.** Lora for headings, Plus Jakarta Sans for body text. Both load from Google Fonts in `index.html`.

**Motion.** Scroll-scrub is `scrub: 2`. The brief asked for 2 to 2.5. Change it in `useSplineCameraTimeline.ts`.

---

## The inquiry form

`src/contact/InquiryForm.tsx` collects:

- Name (required)
- Email (required)
- Start timeline (required): within 3 months, 3 to 6 months, 6 to 12 months, or over a year out
- Dream home ideas (optional, free text)

**Submitting does not send anything yet.** The handler waits 600 ms and shows a thank-you message. Replace the `setTimeout` in `handleSubmit` with a real request before launch.

---

## Project structure

```
scrolly-storytelling/
├── .claude/agents/             Agent files: architecture and skills for this project
├── index.html                  Entry HTML, fonts, favicon
├── package.json                Scripts and dependencies
├── tsconfig.json               Strict TypeScript config
├── vite.config.ts              React and Tailwind plugins
├── README.md                   This file
└── src/
    ├── main.tsx                React root, StrictMode
    ├── App.tsx                 Layout, story sections, form, footer
    ├── index.css               Tailwind import, theme tokens, base styles
    ├── content/
    │   └── phases.ts           The five story phases (copy)
    ├── contact/
    │   └── InquiryForm.tsx     Timeline inquiry form (no backend yet)
    └── scene/
        ├── cameraRig.ts            Keyframes, object names
        ├── SplineBackground.tsx    Fixed Spline layer, onLoad
        ├── SceneErrorBoundary.tsx  Contains scene load failures
        └── useSplineCameraTimeline.ts  ScrollTrigger timeline, ticker, parallax
```

`dist/` is build output and is created by `npm run build`. `node_modules/` is installed by `npm install`.

---

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server on port 5173 with hot reload |
| `npm run build` | Type-checks with `tsc --noEmit`, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` on port 4173 |

---

## Testing and verification

There is no automated test suite yet. The checks below were run by hand during development.

- **Type check and build.** `npm run build` passes. Vite warns that the main bundle is over 500 kB (about 1.3 MB minified, about 400 kB gzipped). Most of that is the Spline runtime.
- **No scene.** The page renders all six story sections and the form, and the Spline error is logged once and contained.
- **Sample scene.** A published sample scene (a cube with a default camera) was loaded through `VITE_SPLINE_SCENE`. With scroll at 0%, 25%, 50%, 75%, and 100%, the camera's z position read 900, 223, 370, 465, and 1300. The camera moves with scroll.
- **Production preview.** `vite preview` serves the built page.

These checks ran in headless Chrome with software WebGL. They have not been run in Safari, Firefox, or on a phone, and not on a real GPU.

To repeat the browser checks, install `playwright-core` in a folder outside the project and point it at Chrome. Keep the script out of the project tree.

---

## What is needed to finish

**Assets and content (blockers)**

- [ ] **The real Spline scene** of the home, with the object names from [The Spline scene contract](#the-spline-scene-contract). Without it the core feature does not run. A brief for it is at the end of this file.
- [ ] **Studio name, logo, and contact details.** The site has no brand name yet. The title "A Home That Keeps Its Rhythm" is a working title.
- [ ] **Confirmed copy.** The five phase texts and the trust section were written for the story. Check every claim (materials, process, timelines) against what the studio actually does.
- [ ] **Photography**, if any is wanted beyond the 3D scene.

**Inquiry form**

- [ ] **A backend.** Options: an email service, a CRM webhook, or a serverless function. Replace the stub in `InquiryForm.tsx`.
- [ ] **Consent and privacy.** A privacy notice and a consent checkbox, if the studio collects personal data from people in regions that require it (for example the EU or California).
- [ ] **Spam protection**, such as a honeypot field or a CAPTCHA.

**Engineering**

- [ ] **Git repository and `.gitignore`.** Neither exists. Ignore `node_modules/`, `dist/`, and `.env.local`.
- [ ] **Environment setup for deploys.** Set `VITE_SPLINE_SCENE` in the host's environment, and choose a host.
- [ ] **Keyframe tuning** against the real scene (see [Tuning](#tuning-the-camera-and-lights)).
- [ ] **Fix the section and keyframe alignment** (known issue 1).
- [ ] **Automated tests.** A small Playwright suite covering the no-scene path, the scene path, and the form.
- [ ] **Font hosting.** Fonts load from Google's CDN. Decide whether to self-host.
- [ ] **Performance.** Mount the Spline canvas only when it is near the viewport, as Spline's own guidance suggests, and keep the scene file small.
- [ ] **Remove `UNDER_CABINET_LIGHT_NAME`** or wire it to a light.

**Site basics**

- [ ] **SEO and social metadata**: description, Open Graph tags, an image, a `robots.txt`, and a sitemap.
- [ ] **Legal footer**: company name, address, and any required links.
- [ ] **Analytics**, if the studio wants them, plus a consent banner if required.

---

## What is missing right now

These are verified gaps in the current code.

1. **Copy and camera drift apart.** The scroll timeline spreads the five keyframes evenly over the page (progress 0, 0.2, 0.4, 0.6, 0.8, 1.0). The copy blocks start at 0, 0.16, 0.32, 0.48, 0.64, and 0.80 of the page height. For example, the "dusk" copy appears at about 0.48 to 0.64, while the dusk lighting is only reached at 0.80. The fix is to position each keyframe at its section's scroll range, for example with one timeline label per section, or one trigger per section. This has not been changed yet.
2. **Phase 4 blur is not built.** The brief asked for the background to blur or settle into a calm texture during the form. Nothing does that yet.
3. **Phase 5 fade is not built.** The brief asked for the copy to fade out during the overview. The copy stays fully visible.
4. **The camera does not pause on cards.** The brief asked for the camera to move only when a card reaches the center zone. The current camera scrubs continuously across the whole page.
5. **Reduced motion is ignored.** Visitors with `prefers-reduced-motion` still get the full scrub and parallax. Add a check that disables the scrub or reduces it.
6. **Parallax needs a moving pointer.** It follows `pointermove`, so it responds to mouse movement and to a finger dragging across the screen. It does not drift on its own when the pointer is still, and on touch it has not been tested on a device.
7. **The form does nothing.** See [The inquiry form](#the-inquiry-form).
8. **`UnderCabinetLights` is unused.** The brief's under-cabinet lighting is not connected.
9. **The sample scene was only a test.** The cube scene exercised the camera and light code. It is not the home, so no visual judgment about the real look has been made.
10. **Not tested on real hardware.** See [Testing and verification](#testing-and-verification).
11. **Build output is not excluded.** `dist/` would be committed without a `.gitignore`.
12. **Working title on the page.** The browser title and heading text are placeholders.

---

## Brief for the Spline scene

Paste this into Spline's AI generator, or hand it to a 3D artist as the brief. Replace the bracketed values with real measurements when you have them.

```text
Create a single residential interior scene for a warm, family-home interior design
studio's website. It will be embedded in a web page as a fixed background that a
visitor scrolls through, so the camera will move through the room. The mood is
warm, lived-in, trustworthy and grounded for a middle-class family planning their
forever home. Avoid anything cold, sterile, glossy-luxury or museum-like.

SPACE
- One open-plan room: kitchen with a breakfast bar, a dining table, a living area
  with a sofa and a reading chair, and a small desk nook by the window.
- Scale: about 1000 scene units wide and 800 deep, ceiling about 260 units high.
  One unit is roughly one centimetre. Floor at Y = 0. Center the room on the origin.
- A large window on the left wall (negative X) with a warm view outside (soft
  trees or sky, not a city skyline).

MATERIALS
- Floors: honey oak planks, matte, with visible grain.
- Cabinetry: soft sage-green or oak-toned cabinet fronts, not high gloss.
- Kitchen island: travertine or honed limestone top with natural veining, and a
  wood-edged breakfast bar.
- Dining table: solid oak with visible grain running along its length.
- Living room: a stone fireplace mantel in travertine with deep natural veins.
- Textiles: linen and bouclé sofa in cream and soft sage, a terracotta throw and
  a wool rug. Keep textures realistic and not overly detailed.
- Walls: warm off-white (a linen tone, never pure white) and one warm plaster accent wall.
- Metal accents: brushed brass on pendant fittings and cabinet pulls.
- Avoid pure black (#000000) and pure white (#FFFFFF) anywhere.

LIGHTING (name these objects exactly, the web code depends on the names)
- A directional light named "SunLight": warm morning sun (about 3200 K, #fff1d6),
  coming through the window from the left, with soft shadows enabled so long soft
  shadows fall across the oak floor. Leave its intensity at its base value; the
  code scales it.
- A point light named "PendantLight_1" hanging over the kitchen island, warm
  (about 2700 K), with a visible brass pendant shade.
- A point light named "PendantLight_2" hanging over the dining table, warm
  (about 2700 K), with a visible pendant shade.
- Optional: an emissive strip group named "UnderCabinetLights" under the kitchen
  wall cabinets, warm white.
- The two pendant lights should be off-or-dim in the morning. Set their base
  intensity to a full, warm value; the code scales them from 0 to 1.
- Use soft, realistic shadows. Avoid harsh edges.

CAMERA (important)
- Create an empty (null object) named "CameraRig" at the origin, at floor height.
- Parent the scene camera to "CameraRig". The code moves "CameraRig", not the
  camera directly, so the camera's own transform should be zero relative to it.
- Do not add Spline Events, physics, collisions, game controls or orbit/mouse
  camera control. The web page owns the camera.
- Do not rely on Spline States for the camera.

OBJECT NAMES
- Use descriptive names for everything else (for example "Kitchen Island",
  "Dining Table", "Window Frame"). Only the names above are required.

PERFORMANCE
- Keep the total scene file under about 5 MB and textures at 2K or below.
- Use reasonable polygon counts. Prefer simple geometry with good materials over
  heavy detail. No unused objects or hidden layers.

FRAMING (for reference, not final)
- Morning, wide and high: looking down into the room from near the ceiling,
  taking in the whole floor plan.
- Breakfast bar, eye height: standing at the breakfast bar, window light across
  the island top.
- Table grain close-up: close to the dining table, showing the oak grain and the
  fireplace mantel in the background.
- Open plan pan: back and to the side, showing kitchen, desk nook and living
  area together.
- Dusk seating: settled on the sofa area, pendant lights on, window light amber.
- Overview: high and pulled back, a dreamlike view of the whole room.

DELIVERABLE
- A published Spline scene, set to public, viewable without a login, with its
  .splinecode URL available for embedding.
```

After the scene exists, tune the keyframes as described in [Tuning the camera and lights](#tuning-the-camera-and-lights).

---

## Agents

Five agent files in `.claude/agents/` hold the architecture and the skills for working on this project:

| Agent | Covers |
|-------|--------|
| `scrolly-architect` | Overall structure, data flow, how to add or reorder a phase, and the known issues |
| `spline-scene-integration` | The Spline runtime API as verified, the object contract, light and camera handling |
| `scroll-motion-gsap` | ScrollTrigger scrub, `useGSAP` cleanup, the ticker, parallax, and the section alignment fix |
| `story-content-design` | Copy voice, the design tokens, the form, and the brand rules |
| `qa-verification` | Build checks, the browser test method, and the Windows-specific steps |

Each file has its architecture notes and the skills an agent needs for that area.
