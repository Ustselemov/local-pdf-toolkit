# Testing

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Automated Checks

Run:

- `npm.cmd test`

Current automated coverage includes:

- rotation normalization
- reorder logic
- split parsing
- export order and relative rotation handling

## Manual Checks

Recommended manual checks in browser:

- import PDF and image files
- drag reorder pages
- export as PDF
- export as JPEG
- apply watermark and page numbers
- verify JPEG preset details shown in the export modal

## Known Gaps

- No browser automation suite currently verifies the full UI flow end to end.
- Performance and download behavior for many simultaneous JPEG exports depend partly on browser policy.
