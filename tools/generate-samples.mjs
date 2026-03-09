import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, '..', 'sample-files');

await mkdir(outputDir, { recursive: true });
await createSample(resolve(outputDir, 'sample-a.pdf'), 'Sample A', 3, degrees(0));
await createSample(resolve(outputDir, 'sample-b.pdf'), 'Sample B', 2, degrees(90));

console.log(`Sample PDFs written to ${outputDir}`);

async function createSample(targetPath, label, pageCount, defaultRotation) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  for (let index = 0; index < pageCount; index += 1) {
    const page = pdf.addPage([320 + index * 20, 420]);
    page.setRotation(defaultRotation);
    page.drawText(`${label} · page ${index + 1}`, {
      x: 28,
      y: 360,
      size: 22,
      font,
      color: rgb(0.13, 0.14, 0.18),
    });
    page.drawText('Use these files to manually verify merge, split, extract, rotate, delete, and reorder flows.', {
      x: 28,
      y: 320,
      size: 12,
      font,
      color: rgb(0.35, 0.38, 0.42),
      maxWidth: 240,
    });
  }

  await writeFile(targetPath, await pdf.save());
}
