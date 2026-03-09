# API Reference

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Runtime Surface

The application is a browser-only UI, not a network API. Its runtime behavior is driven by DOM events in `app.js`, with helper modules in `src/` handling file detection, image loading, workspace operations, split parsing, overlay rendering, stamp editing, JPEG presets, export flow, and browser smoke hooks.

## Supported User Operations

- Import local PDF files
- Import local JPG and PNG files
- Reorder pages
- Rotate pages
- Delete pages
- Extract pages through export
- Split the workspace by page ranges
- Apply watermark and page-number overlays during export
- Open a fullscreen image stamp editor for per-page stamp placement
- Export to PDF or JPEG

## Test Hooks

Browser smoke coverage uses `src/test-hooks.js`, which exposes a temporary `LocalPdfToolkitTestApi` on `globalThis` during runtime for automated local verification.
