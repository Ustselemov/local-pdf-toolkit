# Local PDF Toolkit

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

AI-generated code and documentation may contain errors or incorrect assumptions. Human review is recommended before production, security-sensitive, or business-critical use.

Local PDF Toolkit is a browser-only, offline-first PDF workspace for private document operations on a local machine. Files are processed in the browser and are not uploaded to a backend service.

## Highlights

- Offline browser workflow with no backend
- Local PDF, JPG, and PNG import
- Page thumbnails, reorder, rotate, delete, extract, split, and merge-by-export
- Watermark and page number overlays during export
- PDF and JPEG export paths

## Repository Structure

- `docs/` formal product and technical documentation
- `src/` shared PDF logic
- `tests/` automated checks
- `tools/` local development helpers
- `vendor/` browser-ready third-party runtime assets

## Requirements

- Node.js 20+ for development tasks and tests
- Current Chromium-based browser for local `file://` usage

## Installation

1. Run `npm install`
2. Open `index.html` directly in the browser
3. Import local files and work in the page workspace

## Example Usage

1. Drop one or more PDF, JPG, or PNG files into the landing area.
2. Reorder or rotate pages in the workspace.
3. Open `Overlays` if watermark or page numbers are needed.
4. Export as PDF or JPEG.

## Configuration

- No runtime secrets are required for the current build.
- `.env.example` exists as a future-proof configuration template.
- If future contributors add secrets, real values must stay in local untracked `.env` files only.

## Development Commands

- `npm.cmd test`
- `npm.cmd run samples`

## Troubleshooting

- If local file loading behaves inconsistently, use a current Chromium-based browser.
- If multiple JPEG exports do not all download, check browser permissions for multiple downloads.
- If a large document feels slow, reduce the number of pages in the active workspace before export.

## Documentation

- [Product Overview](./docs/PRODUCT_OVERVIEW.md)
- [Technical Specification](./docs/TECHNICAL_SPECIFICATION.md)
- [Functional Requirements](./docs/FUNCTIONAL_REQUIREMENTS.md)
- [Non-Functional Requirements](./docs/NON_FUNCTIONAL_REQUIREMENTS.md)
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Architectural Decisions](./docs/ARCHITECTURAL_DECISIONS.md)
- [Data Model](./docs/DATA_MODEL.md)
- [API Reference](./docs/api/API_REFERENCE.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
- [Testing](./docs/TESTING.md)
- [Roadmap](./docs/ROADMAP.md)
- [Security](./docs/security/SECURITY.md)
- [Documentation Wiki](./docs/wiki/index.html)

## Legacy Planning Artifacts

The following files are retained from earlier planning iterations and are not the primary source of truth for current repository documentation:

- `architecture.md`
- `roadmap.md`
- `feasibility-review.md`
- `product-brief.html`

## Security

No secrets are required for the current build. See [docs/security/SECURITY.md](./docs/security/SECURITY.md) for safe handling guidance.

## License

Released under the MIT License. See [LICENSE](./LICENSE).
