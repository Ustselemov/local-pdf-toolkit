# Private Offline PDF Toolkit

Current build is a local browser MVP with real page previews and page-level PDF operations.

## What works now

- open local PDF files
- click or drag-and-drop import
- show real page thumbnails
- drag pages to reorder them
- move a page left or right by one step
- rotate pages
- delete pages
- extract a single page from its card
- extract selected pages into a new PDF
- split the current workspace by ranges
- export the current workspace as one PDF

## MVP 1 scope check

Promised for MVP 1:

- open local PDF files
- preview pages
- reorder pages
- rotate pages
- delete pages
- extract pages
- split by ranges
- merge PDFs through workspace export
- save the result locally

Current status:

- all of the above are implemented

Not in MVP 1:

- deep text editing inside PDFs
- OCR
- advanced compression
- certificate-based digital signatures

## Run

Open `index.html` directly in the browser.

## Test

- `npm.cmd test`
- `npm.cmd run samples`

Sample PDFs are written to `sample-files/`.

## Planning docs

- `architecture.md`
- `roadmap.md`
- `feasibility-review.md`
- older planning/spec page versions were folded into the current app flow instead of staying as the main HTML entry
