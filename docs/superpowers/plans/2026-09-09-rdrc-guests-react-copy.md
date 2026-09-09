# RDRC Guests React Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a React/Vite rendering of the published RDRC guest landing that preserves the current mobile, CTA, and family-activity changes.

**Architecture:** Keep the existing campaign component intact and introduce a dedicated `RdrcGuestsApp` root with its own CSS. Reference shared public assets from Vite's configured `landing/assets` directory, including the new family activity collage. Use declarative JSX data for steps, channels, and activities.

**Tech Stack:** React 18, Vite 5, native CSS.

## Global Constraints

- Preserve published wording, anchors, and Telegram/MAX destinations.
- The hero background must stay full-width on mobile, without `cover` zoom.
- Motion is CSS-only, hover-based, and disabled for reduced motion.
- The existing `PopArtCampaign.jsx` remains untouched.

### Task 1: Add a dedicated RDRC guests React entry

**Files:**
- Create: `landing-react/src/RdrcGuestsApp.jsx`
- Create: `landing-react/src/rdrc-guests.css`
- Modify: `landing-react/src/main.jsx`

- [x] Define constant data arrays for steps and activities, plus a reusable arrow component.
- [x] Render the published page structure with `registration`, `how`, `million`, and `contests` anchors.
- [x] Implement responsive CSS for the non-zooming hero, compact action chips, starry CTA hover, and animated family activity art.
- [x] Point `main.jsx` at the new root while retaining the old component source.

### Task 2: Supply the family activity asset and verify the production build

**Files:**
- Create: `landing/assets/activities-family-v2.png`

- [x] Copy the approved generated family collage into the Vite public asset directory.
- [x] Run `npm run build` in `landing-react`.
- [x] Verify the generated output contains the React root and the family asset URL.
