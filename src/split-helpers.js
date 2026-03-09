/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function parseSplitSpec(value, totalPages) {
    const input = (value || '').trim();
    if (!input) {
      throw new Error('Enter split ranges like 1-3|4-6|7.');
    }

    const groups = input.split('|').map((part) => part.trim()).filter(Boolean);
    if (!groups.length) {
      throw new Error('No split ranges found.');
    }

    return groups.map((group) => parseGroup(group, totalPages));
  }

  function parseGroup(group, totalPages) {
    const result = [];
    const seen = new Set();
    const parts = group.split(',').map((part) => part.trim()).filter(Boolean);
    if (!parts.length) {
      throw new Error('Each split group must contain at least one page.');
    }

    for (const part of parts) {
      const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
      const singleMatch = part.match(/^(\d+)$/);

      if (singleMatch) {
        pushPage(result, seen, Number(singleMatch[1]), totalPages);
        continue;
      }

      if (!rangeMatch) {
        throw new Error(`Invalid split token: ${part}`);
      }

      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start > end) {
        throw new Error(`Invalid range: ${part}`);
      }

      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        pushPage(result, seen, pageNumber, totalPages);
      }
    }

    return result;
  }

  function pushPage(result, seen, pageNumber, totalPages) {
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`Page ${pageNumber} is out of range. Valid pages: 1-${totalPages}.`);
    }

    const pageIndex = pageNumber - 1;
    if (seen.has(pageIndex)) {
      return;
    }
    seen.add(pageIndex);
    result.push(pageIndex);
  }

  globalThis.LocalPdfToolkitSplitHelpers = {
    parseSplitSpec,
  };
})();
