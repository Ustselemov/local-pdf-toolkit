# Local PDF Toolkit

This project was generated with the assistance of Codex AI and prompted by Ustselemov. AI-generated code and documentation may contain errors or incorrect assumptions. Human review is recommended before production, security-sensitive, or business-critical use.

## Overview

Local PDF Toolkit is an offline-first browser application for private PDF page operations. Files stay on the user's device and are processed locally in the browser.

Current supported workflow:

- Offline browser workflow with no backend
- Local PDF, JPG, and PNG import
- Page thumbnails, reorder, rotate, delete, extract, split, and merge-by-export
- Watermark and page number overlays during export
- Fullscreen image stamp editor
- PDF and JPEG export paths

## Quick Start

1. Install Node.js 20+ if you want to run tests.
2. Run `npm install`.
3. Open `index.html` directly in a current Chromium-based browser.

## Repository Structure

- `index.html`: application shell
- `styles.css`: UI styles
- `app.js`: browser entrypoint and orchestration layer
- `src/common-helpers.js`: shared utility functions
- `src/file-helpers.js`: supported file and MIME detection
- `src/image-helpers.js`: browser image loading helpers
- `src/workspace-helpers.js`: page selection, move, rotate, delete, and filename helpers
- `src/overlay-helpers.js`: watermark and page-number rendering for canvas and PDF
- `src/stamp-helpers.js`: stamp geometry helpers
- `src/stamp-editor.js`: fullscreen image stamp editor controller
- `src/jpeg-helpers.js`: JPEG presets and export detail formatting
- `src/export-helpers.js`: browser download helpers
- `src/export-controller.js`: export modal and export-flow controller
- `src/test-hooks.js`: browser smoke-test hooks
- `src/pdf-ops.mjs`: tested PDF helper logic
- `sample-files/`: sample PDFs and stamp images for manual checks
- `tests/`: automated checks
- `docs/`: product and engineering documentation
- `vendor/`: vendored browser libraries

## Usage

1. Drop one or more PDF, JPG, or PNG files into the landing area.
2. Reorder or rotate pages in the workspace.
3. Open `Overlays` if watermark or page numbers are needed.
4. Open the per-page stamp editor if an image stamp is needed.
5. Export as PDF or JPEG.

## Configuration

- No runtime secrets are required for the current offline browser build.
- `.env.example` is included for future configuration growth.
- Do not store real credentials in tracked files.

## Testing

Run:

- `npm.cmd test`
- `npm.cmd run test:browser`

## Troubleshooting

- If local file loading behaves inconsistently, use a current Chromium-based browser.
- If multiple JPEG exports do not all download, check browser permissions for multiple downloads.
- If a large document feels slow, reduce the number of pages in the active workspace before export.
