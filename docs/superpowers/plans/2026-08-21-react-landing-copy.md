# React Landing Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone React implementation of the existing FC Lokomotiv × SWM fan-zone landing page with matching content, visuals, responsiveness, and interactions.

**Architecture:** Keep the original static landing untouched in `landing/` as the visual source of truth. Create a Vite-powered React app in `landing-react/`; its component renders equivalent semantic markup, while it deliberately imports the shared stylesheet and image/font assets from `landing/` so appearance remains identical and media stays single-sourced.

**Tech Stack:** React 18, Vite 5, existing CSS and local image/font assets.

## Global Constraints

- Preserve the existing Russian copy, visual hierarchy, colors, layout, accessible labels, desktop/mobile breakpoints, and supplied assets.
- Do not alter files in `landing/`; React-specific changes belong only in `landing-react/`.
- Keep channel targets configurable and unset by default; show the same non-blocking toast when a target is missing.
- Score controls must clamp each team score to integers from 0 through 9.
- The React app must build with `npm run build` and be visually checked at desktop and mobile widths.

---

### Task 1: Scaffold a standalone Vite React app and render the full landing page

**Files:**

- Create: `landing-react/package.json`
- Create: `landing-react/index.html`
- Create: `landing-react/vite.config.js`
- Create: `landing-react/src/main.jsx`
- Create: `landing-react/src/App.jsx`
- Create: `landing-react/README.md`
- Test: `landing-react` production bundle and browser screenshots

**Interfaces:**

- Consumes: `landing/styles.css` and every asset URL resolved relative to that file.
- Produces: `App`, a default React component rendered into `#root`; `CHANNEL_LINKS`, a local configuration constant inside `App.jsx`.

- [ ] **Step 1: Add the project manifest and entry document**

```json
{
  "name": "loko-swm-react-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1" },
  "devDependencies": { "@vitejs/plugin-react": "^4.3.1", "vite": "^5.4.0" }
}
```

Create `index.html` with `<main id="root"></main>` and the `src/main.jsx` module entry. Add `vite.config.js` with the React plugin and an `fs.allow` path that permits imports from the sibling `landing/` directory.

- [ ] **Step 2: Implement the React entry point**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../landing/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode><App /></StrictMode>,
);
```

This keeps visual rules and asset references tied to the existing source design while moving DOM ownership to React.

- [ ] **Step 3: Implement `App.jsx` with data-driven repeated cards and React state**

```jsx
const CHANNEL_LINKS = { telegram: "", max: "" };
const clampScore = (value) => Math.max(0, Math.min(9, value));

export default function App() {
  const [scores, setScores] = useState({ home: 2, away: 1 });
  const [toast, setToast] = useState(null);
  const changeScore = (team, delta) => setScores((current) => ({
    ...current,
    [team]: clampScore(current[team] + delta),
  }));
  // Render the equivalent header, sections, footer, toast and the original card content.
}
```

Map the repeated step, contest, prize, merchandise, and rule records to their existing CSS class names. Keep image paths rooted at `../landing/assets/` in JSX so Vite emits those files. Replace DOM listeners with `onClick` handlers, `useEffect` timer cleanup for the toast, `scrollIntoView` for the score CTA, and a pointer-move transform stored on the hero centerpiece.

- [ ] **Step 4: Document local commands and link configuration**

Write `landing-react/README.md` with these commands:

```bash
cd landing-react
npm install
npm run dev
npm run build
```

Explain that `CHANNEL_LINKS` in `src/App.jsx` holds the production Telegram and MAX URLs, and that no URLs are preconfigured.

- [ ] **Step 5: Install dependencies, build, and run behavioural checks**

Run:

```bash
cd landing-react
npm install
npm run build
```

Expected: Vite produces `landing-react/dist/` with exit code 0. Start the app, confirm both score steppers update and clamp the visible score, and confirm an empty channel link opens the toast.

- [ ] **Step 6: Perform visual regression checks**

Capture the React page at a 1440px desktop viewport and a 390px mobile viewport. Inspect the screenshots against `output/playwright/desktop-score-final.png` and `output/playwright/mobile-final.png`; correct clipped media, broken asset URLs, overlapping text, or missing sections before delivery.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/plans/2026-08-21-react-landing-copy.md landing-react
git commit -m "feat: add React copy of fan-zone landing"
```

## Self-Review

- Spec coverage: Task 1 covers separate React scaffolding, all source content, shared visual rules and media, required interactions, responsive verification, and configuration of channel links.
- Placeholder scan: no deferred implementation markers are present; the full UI follows the existing source markup and CSS classes.
- Type consistency: `scores`, `changeScore`, and `CHANNEL_LINKS` are defined and used locally inside `App`.
