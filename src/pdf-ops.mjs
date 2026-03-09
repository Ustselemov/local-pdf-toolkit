export function normalizeRotation(angle) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function movePageBefore(pages, movingPageId, targetPageId) {
  if (movingPageId === targetPageId) {
    return pages.slice();
  }

  const nextPages = pages.slice();
  const movingIndex = nextPages.findIndex((page) => page.id === movingPageId);
  const targetIndex = nextPages.findIndex((page) => page.id === targetPageId);

  if (movingIndex === -1 || targetIndex === -1) {
    return nextPages;
  }

  const [movingPage] = nextPages.splice(movingIndex, 1);
  const adjustedTargetIndex = movingIndex < targetIndex ? targetIndex - 1 : targetIndex;
  nextPages.splice(adjustedTargetIndex, 0, movingPage);
  return nextPages;
}

export function parseSplitSpec(input, totalPages) {
  const raw = input.trim();

  if (!raw) {
    throw new Error('Enter at least one page range. Example: 1-3|4-6|7');
  }

  const groups = raw
    .split('|')
    .map((group) => group.trim())
    .filter(Boolean);

  if (!groups.length) {
    throw new Error('No valid split groups were found.');
  }

  return groups.map((group) => parseSingleGroup(group, totalPages));
}

function parseSingleGroup(group, totalPages) {
  const pages = [];
  const seen = new Set();
  const tokens = group
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    throw new Error('Each split group must contain at least one page reference.');
  }

  for (const token of tokens) {
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = token.match(/^(\d+)$/);

    if (singleMatch) {
      const pageNumber = parsePageNumber(Number.parseInt(singleMatch[1], 10), totalPages);
      pushUniquePage(pages, seen, pageNumber - 1);
      continue;
    }

    if (!rangeMatch) {
      throw new Error(`Invalid page token: "${token}".`);
    }

    const start = parsePageNumber(Number.parseInt(rangeMatch[1], 10), totalPages);
    const end = parsePageNumber(Number.parseInt(rangeMatch[2], 10), totalPages);

    if (start > end) {
      throw new Error(`Invalid range "${token}": start must be less than or equal to end.`);
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pushUniquePage(pages, seen, pageNumber - 1);
    }
  }

  return pages;
}

function parsePageNumber(pageNumber, totalPages) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    throw new Error(`Page ${pageNumber} is out of range. Valid pages: 1-${totalPages}.`);
  }

  return pageNumber;
}

function pushUniquePage(pages, seen, pageIndex) {
  if (seen.has(pageIndex)) {
    return;
  }

  seen.add(pageIndex);
  pages.push(pageIndex);
}

export async function buildPdfBytes({ pdfLib, sourceDocuments, pages }) {
  if (!pages.length) {
    throw new Error('There are no pages to export.');
  }

  const { PDFDocument, degrees } = pdfLib;
  const outputPdf = await PDFDocument.create();
  const sourceMap = toSourceDocumentMap(sourceDocuments);
  const loadedSources = new Map();

  for (const pageRef of pages) {
    const source = sourceMap.get(pageRef.sourceDocId);

    if (!source) {
      throw new Error(`Missing source document for page ${pageRef.id}.`);
    }

    let sourcePdf = loadedSources.get(source.id);
    if (!sourcePdf) {
      sourcePdf = await PDFDocument.load(source.bytes);
      loadedSources.set(source.id, sourcePdf);
    }

    const [copiedPage] = await outputPdf.copyPages(sourcePdf, [pageRef.sourcePageIndex]);
    const finalRotation = normalizeRotation((pageRef.baseRotation || 0) + (pageRef.rotation || 0));
    copiedPage.setRotation(degrees(finalRotation));
    outputPdf.addPage(copiedPage);
  }

  return outputPdf.save();
}

export function getSelectedPagesInOrder(pages, selectedPageIds) {
  const selection = new Set(selectedPageIds);
  return pages.filter((page) => selection.has(page.id));
}

function toSourceDocumentMap(sourceDocuments) {
  if (sourceDocuments instanceof Map) {
    return sourceDocuments;
  }

  const map = new Map();
  for (const source of sourceDocuments) {
    map.set(source.id, source);
  }
  return map;
}
