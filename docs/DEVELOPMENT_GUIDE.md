# Development Guide

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Local Setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Open `index.html` directly in a current Chromium-based browser.

## Configuration

- The current browser-only build does not require secrets.
- `.env.example` is included so future contributors have a standard configuration entry point.
- Real secrets must never be committed and must remain in local untracked `.env` files.

## Source Areas

- `app.js` for browser orchestration and DOM wiring
- `src/common-helpers.js` for shared utility logic
- `src/file-helpers.js` and `src/image-helpers.js` for input handling
- `src/overlay-helpers.js` and `src/split-helpers.js` for export and split rules
- `src/stamp-helpers.js` and `src/stamp-editor.js` for image stamp behavior
- `src/jpeg-helpers.js` and `src/export-helpers.js` for export presets and browser downloads
- `src/pdf-ops.mjs` for helper logic under test
- `sample-files/` for manual verification assets
- `vendor/` for browser runtime libraries
- `docs/` for product and engineering documentation

## Change Discipline

- Keep the core workflow offline-only.
- Preserve the no-backend architecture unless the product direction changes explicitly.
- Update docs when export behavior, supported formats, or module boundaries change.
- Treat root-level legacy planning files as historical artifacts, not canonical engineering docs.
