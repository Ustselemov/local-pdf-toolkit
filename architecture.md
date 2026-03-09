# Private Offline PDF Toolkit Architecture

Archived planning note:
This root-level document is an early planning artifact. The current authoritative engineering docs live in `docs/` and `product-brief.html`.

## Goal

Build a browser app that users can run locally on a normal computer without backend services, Docker, Python, or developer tooling.

## Confidence boundary

The architecture is high confidence only if the first release focuses on page-level operations.

That means:

- open local files
- render previews
- reorder pages
- rotate pages
- delete pages
- extract pages
- split by ranges
- merge documents
- export a new PDF

It does not mean full in-place editing of arbitrary PDF content.

## Launch model

The target launch flow is:

1. User downloads a zip archive
2. User extracts the folder
3. User opens `index.html`
4. App works locally without contacting any server

Because of this requirement, the implementation must be conservative about browser restrictions in `file://` mode.

## Technical principles

- Fully client-side processing
- Static-file delivery
- Privacy-first by default
- No runtime network dependency
- Graceful handling of large files
- Browser-compatible, conservative implementation choices

## Recommended stack for MVP 1

### UI shell

Responsibilities:

- file dropzone
- import button
- document list
- page thumbnail grid
- selection controls
- action toolbar
- export controls
- user notices
- privacy messaging

Implementation:

- Plain HTML
- Plain CSS
- Vanilla JavaScript

Reason:

- Lowest launch friction
- Easiest to keep working under local-file constraints
- Easiest to distribute as a static folder

### PDF preview layer

Responsibilities:

- render page previews
- generate thumbnails
- support selection feedback
- render on demand for performance

Implementation direction:

- Use a local copy of a browser PDF renderer
- Prefer a configuration that does not depend on remote workers or remote assets
- For version 1, correctness and compatibility matter more than maximum rendering speed

### PDF manipulation layer

Responsibilities:

- reorder pages
- rotate pages
- remove pages
- copy pages between files
- split by ranges
- merge documents
- save output

Implementation direction:

- Use a local browser-side PDF manipulation library
- Keep mutations page-level wherever possible
- Avoid promising content rewriting features in the core engine

### File handling layer

Responsibilities:

- read user-selected files
- convert files into in-memory buffers
- validate input type and size
- generate downloadable output files

Browser APIs:

- `File`
- `arrayBuffer()`
- `Blob`
- `URL.createObjectURL()`
- `download` attribute on links

### Application state

Suggested state model:

- imported documents
- flattened page list for the active workspace
- selected page ids
- pending operation state
- export status
- validation and error messages

Implementation direction:

- in-memory state only for documents
- optional localStorage only for UI preferences
- never persist user PDF content automatically

## Browser constraints that must shape the design

### 1. `file://` restrictions

Risk:

- Some browser features behave differently when opening a page directly from disk

Design response:

- vendor all required libraries locally
- avoid runtime fetches to CDN resources
- avoid complicated startup assumptions
- test direct open in Chrome and Edge first

### 2. Memory pressure

Risk:

- Large PDFs can consume a lot of memory during preview and export

Design response:

- lazy-render thumbnails
- cap preview resolution
- release temporary canvases when possible
- show progress and warnings for heavy files

### 3. PDF complexity

Risk:

- Some PDFs contain unusual structures, forms, embedded fonts, or damaged objects

Design response:

- scope MVP 1 to page-level operations
- test against a sample set of real-world PDFs
- show clear error messaging when a file is unsupported

## Functional requirements for MVP 1

- User can add one or more local PDF files
- User can view pages as thumbnails
- User can select one or more pages
- User can change page order
- User can rotate selected pages
- User can delete selected pages
- User can extract selected pages into a new file
- User can split a PDF by page ranges
- User can merge multiple PDFs
- User can download the resulting PDF

## Non-functional requirements for MVP 1

- Must run locally without a server
- Must not require internet for normal use
- Must not upload files anywhere
- Must handle invalid files with clear messages
- Must remain usable on common consumer laptops
- Must work in current Chrome and Edge at minimum
- Firefox and Safari support should be tested, but not assumed blindly before verification

## Explicit non-goals for MVP 1

- full PDF text editing
- OCR
- advanced compression tuning
- cryptographic signing workflows
- universal support for every malformed or exotic PDF

## Acceptance checklist

A build is ready only if all checks pass:

1. Open the app via `index.html` from disk
2. Import multiple sample PDFs
3. Reorder pages and export
4. Rotate pages and export
5. Delete pages and export
6. Extract selected pages and export
7. Merge two or more PDFs and export
8. Open exported files in standard PDF readers successfully
9. Confirm no network calls are required for these flows
10. Confirm error messages appear for invalid input
