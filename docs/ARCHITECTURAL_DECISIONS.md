# Architectural Decisions

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## ADR-1 Browser-only runtime

Decision: keep all core functionality in a static browser application.
Reason: privacy and zero-backend setup are core product requirements.

## ADR-2 Vendored runtime libraries

Decision: vendor browser-ready builds of `pdf.js` and `pdf-lib`.
Reason: the app must work locally without a bundler or remote CDN dependency at runtime.

## ADR-3 Page-level scope first

Decision: focus on page operations instead of full PDF content editing.
Reason: the page-level scope is technically reliable in a browser-only offline product.

## ADR-4 Export overlays during generation

Decision: watermark and page numbers are applied during export.
Reason: this avoids a more complex live annotation editor while still covering common output needs.
