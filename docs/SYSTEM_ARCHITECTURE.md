# System Architecture

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Components

- `index.html`: application shell and UI structure
- `styles.css`: presentation layer
- `app.js`: browser runtime, state management, import/export orchestration
- `src/pdf-ops.mjs`: tested helper logic for page operations
- `vendor/`: vendored browser-ready third-party dependencies

## Architecture Summary

The application uses a local-first single-page architecture. Document bytes are loaded into browser memory, preview rendering is handled through `pdf.js`, and export composition is handled through `pdf-lib`.

## Storage Model

No persistent application database is used. Data lives in browser memory during the session.
