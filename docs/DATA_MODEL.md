# Data Model

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Primary In-Memory Entities

### SourceDocument

- `id`
- `type` (`pdf` or `image`)
- `name`
- `bytes`
- `pageCount`
- optional preview/runtime handles such as `pdfjsDoc`, `objectUrl`, `width`, `height`

### WorkspacePage

- `id`
- `sourceDocId`
- `sourceType`
- `sourceName`
- `sourcePageIndex`
- `baseRotation`
- `rotation`

### OverlaySettings

- `watermarkText`
- `watermarkPreset`
- `pageNumbersEnabled`
- `pageNumberFormat`
- `pageNumberPreset`
