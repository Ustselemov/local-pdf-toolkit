# Architecture Diagram

```mermaid
flowchart TD
    User[User Browser Session] --> UI[index.html + styles.css]
    UI --> Runtime[app.js Runtime State]
    Runtime --> Preview[pdf.js Preview Rendering]
    Runtime --> Export[pdf-lib Export Composition]
    Runtime --> Helpers[src/pdf-ops.mjs]
    Runtime --> Vendor[vendor runtime assets]
```
