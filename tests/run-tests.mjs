import assert from 'node:assert/strict';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import {
  buildPdfBytes,
  movePageBefore,
  normalizeRotation,
  parseSplitSpec,
} from '../src/pdf-ops.mjs';

const tests = [
  {
    name: 'normalizeRotation keeps values within 0-359',
    run() {
      assert.equal(normalizeRotation(450), 90);
      assert.equal(normalizeRotation(-90), 270);
      assert.equal(normalizeRotation(720), 0);
    },
  },
  {
    name: 'movePageBefore reorders cards without mutating the original array',
    run() {
      const pages = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const moved = movePageBefore(pages, 'c', 'a');
      assert.deepEqual(moved.map((page) => page.id), ['c', 'a', 'b']);
      assert.deepEqual(pages.map((page) => page.id), ['a', 'b', 'c']);
    },
  },
  {
    name: 'parseSplitSpec parses page groups and removes duplicates inside each group',
    run() {
      const groups = parseSplitSpec('1-3,2|4|5-6', 6);
      assert.deepEqual(groups, [[0, 1, 2], [3], [4, 5]]);
    },
  },
  {
    name: 'buildPdfBytes preserves page order and applies relative rotation',
    async run() {
      const sourceA = await createSourcePdf('Alpha', [200, 220]);
      const sourceB = await createSourcePdf('Beta', [310]);

      const bytes = await buildPdfBytes({
        pdfLib: { PDFDocument, degrees },
        sourceDocuments: [
          { id: 'a', bytes: sourceA },
          { id: 'b', bytes: sourceB },
        ],
        pages: [
          {
            id: 'b-1',
            sourceDocId: 'b',
            sourcePageIndex: 0,
            baseRotation: 0,
            rotation: 0,
          },
          {
            id: 'a-2',
            sourceDocId: 'a',
            sourcePageIndex: 1,
            baseRotation: 0,
            rotation: 90,
          },
        ],
      });

      const exported = await PDFDocument.load(bytes);
      assert.equal(exported.getPageCount(), 2);
      assert.equal(exported.getPage(0).getSize().width, 310);
      assert.equal(exported.getPage(1).getSize().width, 220);
      assert.equal(exported.getPage(1).getRotation().angle, 90);
    },
  },
];

let failures = 0;
for (const test of tests) {
  try {
    await test.run();
    console.log(`PASS ${test.name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${test.name}`);
    console.error(error.stack || error.message);
  }
}

if (failures > 0) {
  process.exitCode = 1;
  console.error(`\n${failures} test(s) failed.`);
} else {
  console.log(`\nAll ${tests.length} tests passed.`);
}

async function createSourcePdf(label, widths) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  widths.forEach((width, index) => {
    const page = pdf.addPage([width, 240]);
    page.drawText(`${label} page ${index + 1}`, {
      x: 24,
      y: 180,
      size: 20,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  return pdf.save();
}
