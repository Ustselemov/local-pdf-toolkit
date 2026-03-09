# Feasibility Review

Archived planning note:
This root-level document is an early feasibility snapshot. The current authoritative project status lives in `docs/` and `product-brief.html`.

## Bottom line

A fully local browser-based PDF toolkit is realistic.

A fully local browser-based full PDF editor is not a safe promise.

The project becomes high-confidence only if the first release is limited to page-level operations.

## High-confidence features

These are the functions I would defend as realistic for an offline browser MVP.

- Open local PDF files
- Drag and drop files into the UI
- Preview pages
- Generate thumbnails
- Select pages
- Reorder pages
- Rotate pages
- Delete pages
- Extract selected pages
- Split by page ranges
- Merge multiple PDFs
- Download the output locally

## Medium-confidence features

These are plausible after the core app works, but I would not sell them as guaranteed until the base is proven.

- watermark text
- page numbers
- image to PDF
- export pages as images
- simple image stamp overlays

## Low-confidence or out-of-scope features

These are not appropriate promises for the first product pitch.

- full PDF text editing
- OCR
- advanced compression claims
- certificate-based digital signatures
- perfect support for every unusual PDF

## Why the high-confidence set works

- The browser can already access local files through standard file APIs
- Page-level PDF operations map well to client-side PDF libraries
- Exporting a generated PDF is straightforward through Blob download flows
- None of the core actions require sending files to a server

## Main risks to respect

### Browser launch restrictions

Some implementations break when opened directly from disk.

Response:

- avoid remote dependencies
- keep startup simple
- test under actual `file://` launch conditions

### Heavy documents

Large PDFs can stress memory and rendering performance.

Response:

- use lazy thumbnail rendering
- limit preview resolution
- warn users during heavy operations

### PDF edge cases

Not every PDF will behave identically.

Response:

- keep the first version page-focused
- handle failures clearly
- test with diverse real files

## Final recommendation

If the goal is a product that can honestly claim privacy, simplicity, and offline usefulness, the correct first promise is:

"Local browser tool for merging, splitting, extracting, rotating, deleting, and reordering PDF pages."

That is the strongest version of the idea with the best chance of shipping cleanly.
