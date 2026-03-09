# Technical Specification

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Runtime Model

The application is a static browser application opened from local files. It uses browser JavaScript plus vendored PDF libraries.

## Main Libraries

- `pdf.js` for preview rendering from source PDFs
- `pdf-lib` for PDF composition, page copying, and export overlays

## Supported Input Types

- PDF
- JPG
- JPEG
- PNG

## Core Processing Rules

- No network requests are required for core document processing
- No backend service exists
- Export overlays are rendered during export, not stored as editable live annotations
- JPEG export is generated from original source data, not from thumbnail-sized previews

## Browser Constraints

- The app targets current Chromium-based browsers for reliable `file://` behavior
- Multiple JPEG downloads may be gated by browser download settings
