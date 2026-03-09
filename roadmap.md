# Private Offline PDF Toolkit Roadmap

## Roadmap philosophy

This roadmap is intentionally conservative.

The first goal is not to be a full PDF editor. The first goal is to be a trustworthy offline replacement for the most common online PDF utilities.

## Version 1.0

### Product promise

A private local browser tool for page-level PDF operations.

### Committed scope

- Open local PDF files
- Preview pages
- Show thumbnails
- Select pages
- Reorder pages
- Rotate pages
- Delete pages
- Extract selected pages
- Split by ranges
- Merge multiple PDFs
- Download the output

### Not committed in 1.0

- text editing inside existing PDF content
- OCR
- advanced compression
- certificate signatures
- complex form workflows

### Exit criteria

- Stable local launch via `index.html`
- No server dependency
- No internet dependency for normal flows
- Core export flows validated on real sample PDFs
- Friendly error handling for invalid files
- Usable on current Chrome and Edge

## Version 1.1

Only after 1.0 proves stable.

Candidate additions:

- watermark text
- page numbers
- better export naming
- undo for recent page operations
- improved heavy-file feedback

## Version 1.2

Candidate additions:

- image to PDF
- PDF page export to images
- image stamp overlay
- metadata editing

## Version 2.0

Only if earlier versions are stable and user demand supports it.

Candidate additions:

- crop pages
- flatten overlays
- batch workflows
- expanded browser support hardening

## Deferred research topics

These should be investigated separately and not treated as default roadmap commitments.

- OCR in browser
- advanced compression presets
- digital signing support
- broader form editing support

## Implementation order

1. File import and validation
2. Thumbnail preview
3. Selection model
4. Delete and rotate
5. Reorder pages
6. Merge and extract
7. Split by ranges
8. Export flow
9. Error handling and performance passes
10. Cross-browser verification
