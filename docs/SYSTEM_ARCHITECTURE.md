# System Architecture

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Components

- `index.html`: application shell and UI structure
- `styles.css`: presentation layer
- `app.js`: browser entrypoint and orchestration layer
- `src/common-helpers.js`: shared utility functions
- `src/file-helpers.js`: input type detection and image MIME helpers
- `src/image-helpers.js`: browser image loading helpers
- `src/workspace-helpers.js`: pure workspace operations for selection, ordering, rotation, deletion, and export filenames
- `src/overlay-helpers.js`: watermark and page-number rendering for canvas and PDF output
- `src/split-helpers.js`: split-range parsing logic
- `src/stamp-helpers.js`: stamp geometry helpers
- `src/stamp-editor.js`: fullscreen image stamp editor controller
- `src/jpeg-helpers.js`: JPEG preset definitions and detail formatting
- `src/export-helpers.js`: browser blob export helpers
- `src/export-controller.js`: export modal lifecycle and export orchestration
- `src/test-hooks.js`: browser smoke-test hooks for the `file://` workflow
- `src/pdf-ops.mjs`: tested helper logic for page operations
- `vendor/`: vendored browser-ready third-party dependencies

## Architecture Summary

The application uses a local-first single-page architecture. Document bytes are loaded into browser memory, preview rendering is handled through `pdf.js`, PDF composition is handled through `pdf-lib`, and the browser runtime is split into focused modules for workspace behavior, overlays, stamps, export, and test hooks. `app.js` now acts as the integration layer rather than the primary home for every feature.

## Storage Model

No persistent application database is used. Data lives in browser memory during the session.
