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
3. Open [index.html](D:/VibeCoding/private-offline-pdf-toolkit/index.html) directly in a current Chromium-based browser.

## Repository Structure

- [index.html](D:/VibeCoding/private-offline-pdf-toolkit/index.html): application shell
- [styles.css](D:/VibeCoding/private-offline-pdf-toolkit/styles.css): UI styles
- [app.js](D:/VibeCoding/private-offline-pdf-toolkit/app.js): browser entrypoint and orchestration
- [src](D:/VibeCoding/private-offline-pdf-toolkit/src): focused browser helper modules and tested logic
- [sample-files](D:/VibeCoding/private-offline-pdf-toolkit/sample-files): sample PDFs and stamp images for manual checks
- [tests](D:/VibeCoding/private-offline-pdf-toolkit/tests): automated checks
- [docs](D:/VibeCoding/private-offline-pdf-toolkit/docs): product and engineering documentation
- [vendor](D:/VibeCoding/private-offline-pdf-toolkit/vendor): vendored browser libraries

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

## Troubleshooting

- If local file loading behaves inconsistently, use a current Chromium-based browser.
- If multiple JPEG exports do not all download, check browser permissions for multiple downloads.
- If a large document feels slow, reduce the number of pages in the active workspace before export.
