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

- `app.js` for browser runtime logic
- `src/pdf-ops.mjs` for helper logic under test
- `vendor/` for browser runtime libraries
- `docs/` for product and engineering documentation

## Change Discipline

- Keep the core workflow offline-only.
- Preserve the no-backend architecture unless the product direction changes explicitly.
- Update docs when export behavior or supported formats change.
- Treat root-level legacy planning files as historical artifacts, not canonical engineering docs.
