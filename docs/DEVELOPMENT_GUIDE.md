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
- `src/file-helpers.js` and `src/image-helpers.js` for import handling
- `src/workspace-helpers.js` for page-level workspace operations
- `src/overlay-helpers.js` and `src/split-helpers.js` for overlay and split rules
- `src/stamp-helpers.js` and `src/stamp-editor.js` for image stamp behavior
- `src/jpeg-helpers.js`, `src/export-helpers.js`, and `src/export-controller.js` for export presets, downloads, and export flow
- `src/test-hooks.js` for browser smoke integration
- `src/pdf-ops.mjs` for helper logic under test
- `sample-files/` for manual verification assets
- `vendor/` for browser runtime libraries
- `docs/` for product and engineering documentation

## Change Discipline

- Keep the core workflow offline-only.
- Preserve the no-backend architecture unless the product direction changes explicitly.
- Keep new logic in focused modules when it can be isolated from DOM orchestration.
- Update docs when export behavior, supported formats, or module boundaries change.
- Treat root-level legacy planning files as historical artifacts, not canonical engineering docs.
