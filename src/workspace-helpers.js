/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function movePageRelative(pages, movingPageId, targetPageId, position) {
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
    const baseTargetIndex = movingIndex < targetIndex ? targetIndex - 1 : targetIndex;
    const insertIndex = position === 'after' ? baseTargetIndex + 1 : baseTargetIndex;
    nextPages.splice(insertIndex, 0, movingPage);
    return nextPages;
  }

  function toggleSelection(selectedPageIds, pageId) {
    if (selectedPageIds.has(pageId)) {
      selectedPageIds.delete(pageId);
    } else {
      selectedPageIds.add(pageId);
    }
    return selectedPageIds;
  }

  function getSelectedPages(pages, selectedPageIds) {
    return pages.filter((page) => selectedPageIds.has(page.id));
  }

  function rotatePages(pages, selectedPageIds, delta, normalizeRotation) {
    return pages.map((page) => selectedPageIds.has(page.id)
      ? { ...page, rotation: normalizeRotation(page.rotation + delta) }
      : page);
  }

  function rotateOnePage(pages, pageId, delta, normalizeRotation) {
    return pages.map((page) => page.id === pageId
      ? { ...page, rotation: normalizeRotation(page.rotation + delta) }
      : page);
  }

  function moveSinglePage(pages, pageId, direction) {
    const index = pages.findIndex((page) => page.id === pageId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= pages.length) {
      return pages.slice();
    }

    const nextPages = pages.slice();
    const [page] = nextPages.splice(index, 1);
    nextPages.splice(targetIndex, 0, page);
    return nextPages;
  }

  function deleteOnePage(pages, selectedPageIds, pageId) {
    selectedPageIds.delete(pageId);
    return pages.filter((page) => page.id !== pageId);
  }

  function deleteSelectedPages(pages, selectedPageIds) {
    return pages.filter((page) => !selectedPageIds.has(page.id));
  }

  function buildFilename(sourceDocuments, trimExtension, sanitize, suffix) {
    const base = sourceDocuments.length === 1 ? trimExtension(sourceDocuments[0].name) : 'workspace';
    return sanitize(`${base}-${suffix}`);
  }

  globalThis.LocalPdfToolkitWorkspaceHelpers = {
    movePageRelative,
    toggleSelection,
    getSelectedPages,
    rotatePages,
    rotateOnePage,
    moveSinglePage,
    deleteOnePage,
    deleteSelectedPages,
    buildFilename,
  };
})();
