/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  const { PDFDocument, StandardFonts, degrees } = globalThis.PDFLib;
  const pdfjsLib = globalThis['pdfjs-dist/build/pdf'];
  const { clamp, trimExtension, sanitize, normalizeRotation, escapeHtml, getCardMidpoint } = globalThis.LocalPdfToolkitCommonHelpers;
  const { isPdfFile, isImageFile, isSupportedFile, detectImageMime } = globalThis.LocalPdfToolkitFileHelpers;
  const { loadImageSize, loadImageElement, importImageBitmapFromSource } = globalThis.LocalPdfToolkitImageHelpers;
  const { applyOverlaysToCanvas, applyOverlaysToPdfPage } = globalThis.LocalPdfToolkitOverlayHelpers;
  const { parseSplitSpec } = globalThis.LocalPdfToolkitSplitHelpers;
  const { cloneStamp, getStampRenderRect } = globalThis.LocalPdfToolkitStampHelpers;
  const { createStampEditor } = globalThis.LocalPdfToolkitStampEditor;
  const { getJpegPresetOptions, formatJpegDetails } = globalThis.LocalPdfToolkitJpegHelpers;
  const { canvasToBlob, downloadBlob } = globalThis.LocalPdfToolkitExportHelpers;

  const state = {
    sourceDocuments: [],
    pages: [],
    selectedPageIds: new Set(),
    draggingPageId: null,
    pendingExport: null,
    overlays: {
      watermarkText: '',
      watermarkPreset: 'center-diagonal',
      pageNumbersEnabled: false,
      pageNumberFormat: 'number',
      pageNumberPreset: 'bottom-right',
    },
    stampEditor: {
      pageId: null,
      stamp: null,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      canvasRect: null,
      originalObjectUrl: null,
    },
  };

  let sourceSequence = 0;
  let pageSequence = 0;
  let previewObserver = null;
  const previewCache = new Map();

  const elements = {
    landing: document.getElementById('landing'),
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('file-input'),
    workspace: document.getElementById('workspace'),
    landingActions: document.getElementById('landing-actions'),
    goToEditorButton: document.getElementById('go-to-editor-button'),
    summary: document.getElementById('summary'),
    status: document.getElementById('status'),
    pagesGrid: document.getElementById('pages-grid'),
    exportAllButton: document.getElementById('export-all-button'),
    exportSelectedButton: document.getElementById('export-selected-button'),
    rotateLeftButton: document.getElementById('rotate-left-button'),
    rotateRightButton: document.getElementById('rotate-right-button'),
    deleteSelectedButton: document.getElementById('delete-selected-button'),
    splitToggleButton: document.getElementById('split-toggle-button'),
    splitPanel: document.getElementById('split-panel'),
    splitInput: document.getElementById('split-input'),
    splitButton: document.getElementById('split-button'),
    overlayToggleButton: document.getElementById('overlay-toggle-button'),
    overlayPanel: document.getElementById('overlay-panel'),
    watermarkTextInput: document.getElementById('watermark-text-input'),
    watermarkPresetSelect: document.getElementById('watermark-preset-select'),
    pageNumbersEnabledInput: document.getElementById('page-numbers-enabled-input'),
    pageNumberFormatSelect: document.getElementById('page-number-format-select'),
    pageNumberPresetSelect: document.getElementById('page-number-preset-select'),
    resetWorkspaceButton: document.getElementById('reset-workspace-button'),
    exportModal: document.getElementById('export-modal'),
    exportModalBackdrop: document.getElementById('export-modal-backdrop'),
    exportJpegQualitySelect: document.getElementById('export-jpeg-quality-select'),
    exportJpegDetails: document.getElementById('export-jpeg-details'),
    exportModalPdf: document.getElementById('export-modal-pdf'),
    exportModalJpeg: document.getElementById('export-modal-jpeg'),
    exportModalCancel: document.getElementById('export-modal-cancel'),
    stampModal: document.getElementById('stamp-modal'),
    stampModalBackdrop: document.getElementById('stamp-modal-backdrop'),
    stampModalClose: document.getElementById('stamp-modal-close'),
    stampFileInput: document.getElementById('stamp-file-input'),
    stampSizeInput: document.getElementById('stamp-size-input'),
    stampSizeLabel: document.getElementById('stamp-size-label'),
    stampRemoveButton: document.getElementById('stamp-remove-button'),
    stampEditorCanvas: document.getElementById('stamp-editor-canvas'),
    stampModalStatus: document.getElementById('stamp-modal-status'),
    stampSaveButton: document.getElementById('stamp-save-button'),
  };

  const stampEditor = createStampEditor({
    state,
    elements,
    cloneStamp,
    getStampRenderRect,
    loadImageSize,
    loadImageElement,
    detectImageMime,
    isImageFile,
    clamp,
    getPageById,
    renderPageToCanvas,
    previewCache,
    render,
    setStatus,
  });

  bindEvents();
  syncOverlayControls();
  render();
  init();

  function init() {
    if (!pdfjsLib) {
      setStatus('error', 'PDF preview engine failed to initialize.');
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.js';
    setStatus('idle', '');
  }

  function bindEvents() {
    elements.dropzone.addEventListener('click', () => {
      elements.fileInput.click();
    });

    elements.dropzone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        elements.fileInput.click();
      }
    });

    elements.fileInput.addEventListener('change', async (event) => {
      await handleFiles(event.target.files);
      event.target.value = '';
    });

    elements.dropzone.addEventListener('dragenter', (event) => {
      event.preventDefault();
      elements.dropzone.dataset.dragging = 'true';
    });

    elements.dropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      elements.dropzone.dataset.dragging = 'true';
    });

    elements.dropzone.addEventListener('dragleave', () => {
      elements.dropzone.dataset.dragging = 'false';
    });

    elements.dropzone.addEventListener('drop', async (event) => {
      event.preventDefault();
      elements.dropzone.dataset.dragging = 'false';
      await handleFiles(event.dataTransfer.files);
    });

    elements.exportAllButton.addEventListener('click', () => {
      if (!state.pages.length) {
        setStatus('warning', 'There are no pages to export.');
        return;
      }
      openExportModal(state.pages, buildFilename('export'), 'Export all pages');
    });

    elements.exportSelectedButton.addEventListener('click', () => {
      const selectedPages = getSelectedPages();
      if (!selectedPages.length) {
        setStatus('warning', 'Select at least one page first.');
        return;
      }
      openExportModal(selectedPages, buildFilename('selected'), 'Export selected pages');
    });

    elements.rotateLeftButton.addEventListener('click', () => rotateSelected(-90));
    elements.rotateRightButton.addEventListener('click', () => rotateSelected(90));
    elements.deleteSelectedButton.addEventListener('click', deleteSelected);
    elements.goToEditorButton.addEventListener('click', scrollToWorkspace);
    elements.splitToggleButton.addEventListener('click', toggleSplitPanel);
    elements.splitButton.addEventListener('click', splitWorkspace);
    elements.overlayToggleButton.addEventListener('click', toggleOverlayPanel);
    elements.resetWorkspaceButton.addEventListener('click', resetWorkspace);

    elements.watermarkTextInput.addEventListener('input', () => {
      state.overlays.watermarkText = elements.watermarkTextInput.value;
    });
    elements.watermarkPresetSelect.addEventListener('change', () => {
      state.overlays.watermarkPreset = elements.watermarkPresetSelect.value;
    });
    elements.pageNumbersEnabledInput.addEventListener('change', () => {
      state.overlays.pageNumbersEnabled = elements.pageNumbersEnabledInput.checked;
      syncOverlayControls();
    });
    elements.pageNumberFormatSelect.addEventListener('change', () => {
      state.overlays.pageNumberFormat = elements.pageNumberFormatSelect.value;
    });
    elements.pageNumberPresetSelect.addEventListener('change', () => {
      state.overlays.pageNumberPreset = elements.pageNumberPresetSelect.value;
    });

    elements.exportModalPdf.addEventListener('click', async () => {
      await confirmExport('pdf');
    });
    elements.exportModalJpeg.addEventListener('click', async () => {
      await confirmExport('jpeg');
    });
    elements.exportModalCancel.addEventListener('click', closeExportModal);
    elements.exportModalBackdrop.addEventListener('click', closeExportModal);
    elements.exportJpegQualitySelect.addEventListener('change', () => {
      void refreshExportModalJpegDetails();
    });

    elements.stampModalClose.addEventListener('click', stampEditor.close);
    elements.stampModalBackdrop.addEventListener('click', stampEditor.close);
    elements.stampSaveButton.addEventListener('click', stampEditor.save);
    elements.stampRemoveButton.addEventListener('click', stampEditor.remove);
    elements.stampFileInput.addEventListener('change', async (event) => {
      await stampEditor.handleFile(event.target.files?.[0]);
      event.target.value = '';
    });
    elements.stampSizeInput.addEventListener('input', (event) => {
      stampEditor.updateSize(Number(event.target.value));
    });
    elements.stampEditorCanvas.addEventListener('pointerdown', stampEditor.onPointerDown);
    elements.stampEditorCanvas.addEventListener('pointermove', stampEditor.onPointerMove);
    elements.stampEditorCanvas.addEventListener('pointerup', stampEditor.onPointerUp);
    elements.stampEditorCanvas.addEventListener('pointercancel', stampEditor.onPointerUp);
    elements.stampEditorCanvas.addEventListener('pointerleave', stampEditor.onPointerUp);
  }

  function syncOverlayControls() {
    elements.watermarkTextInput.value = state.overlays.watermarkText;
    elements.watermarkPresetSelect.value = state.overlays.watermarkPreset;
    elements.pageNumbersEnabledInput.checked = state.overlays.pageNumbersEnabled;
    elements.pageNumberFormatSelect.value = state.overlays.pageNumberFormat;
    elements.pageNumberPresetSelect.value = state.overlays.pageNumberPreset;
    elements.pageNumberFormatSelect.disabled = !state.overlays.pageNumbersEnabled;
    elements.pageNumberPresetSelect.disabled = !state.overlays.pageNumbersEnabled;
  }

  async function handleFiles(fileList) {
    if (!pdfjsLib) {
      setStatus('error', 'PDF preview engine is not available in this build.');
      return;
    }

    const files = Array.from(fileList || []).filter(isSupportedFile);
    if (!files.length) {
      setStatus('warning', 'No supported files found. Use PDF, JPG or PNG.');
      return;
    }

    setStatus('idle', `Importing ${files.length} file${files.length === 1 ? '' : 's'}...`);
    let importedCount = 0;
    const failures = [];

    for (const file of files) {
      try {
        if (isPdfFile(file)) {
          await importPdf(file);
        } else {
          await importImage(file);
        }
        importedCount += 1;
      } catch (error) {
        console.error(error);
        failures.push(`${file.name}: ${error.message}`);
      }
    }

    render();

    if (!importedCount) {
      setStatus('error', `Import failed. ${failures.join(' | ')}`);
      return;
    }

    if (failures.length) {
      setStatus('warning', `Imported ${importedCount} of ${files.length}. Failed: ${failures.join(' | ')}`);
      return;
    }

    setStatus('success', `Imported ${importedCount} file${importedCount === 1 ? '' : 's'}.`);
    scrollToWorkspace();
  }

  async function importPdf(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdfLibDoc = await PDFDocument.load(bytes);
    const pdfjsDoc = await pdfjsLib.getDocument({
      data: bytes,
      disableWorker: false,
      isEvalSupported: false,
      useWorkerFetch: false,
      useSystemFonts: true,
    }).promise;

    const sourceId = `source-${++sourceSequence}`;
    state.sourceDocuments.push({
      id: sourceId,
      type: 'pdf',
      name: file.name,
      bytes,
      pdfjsDoc,
      pageCount: pdfLibDoc.getPageCount(),
    });

    for (let index = 0; index < pdfLibDoc.getPageCount(); index += 1) {
      const page = pdfLibDoc.getPage(index);
      const rotation = page.getRotation().angle || 0;
      state.pages.push({
        id: `page-${++pageSequence}`,
        sourceDocId: sourceId,
        sourceType: 'pdf',
        sourceName: file.name,
        sourcePageIndex: index,
        baseRotation: rotation,
        rotation: 0,
      });
    }
  }

  async function importImage(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = new Blob([bytes], { type: file.type || detectImageMime(file.name) });
    const objectUrl = URL.createObjectURL(blob);
    const imageSize = await loadImageSize(objectUrl);

    const sourceId = `source-${++sourceSequence}`;
    state.sourceDocuments.push({
      id: sourceId,
      type: 'image',
      name: file.name,
      bytes,
      mimeType: blob.type || detectImageMime(file.name),
      objectUrl,
      pageCount: 1,
      width: imageSize.width,
      height: imageSize.height,
    });

    state.pages.push({
      id: `page-${++pageSequence}`,
      sourceDocId: sourceId,
      sourceType: 'image',
      sourceName: file.name,
      sourcePageIndex: 0,
      baseRotation: 0,
      rotation: 0,
    });
  }

  function render() {
    const hasPages = state.pages.length > 0;
    elements.landing.hidden = false;
    elements.landingActions.hidden = false;
    elements.goToEditorButton.disabled = !hasPages;
    elements.goToEditorButton.dataset.active = hasPages ? 'true' : 'false';
    elements.workspace.hidden = !hasPages;

    if (!hasPages) {
      elements.summary.textContent = '';
      elements.pagesGrid.innerHTML = '';
      updateButtons();
      return;
    }

    const selectedCount = state.selectedPageIds.size;
    elements.summary.textContent = `${state.sourceDocuments.length} file${state.sourceDocuments.length === 1 ? '' : 's'} · ${state.pages.length} page${state.pages.length === 1 ? '' : 's'}${selectedCount ? ` · ${selectedCount} selected` : ''}`;
    updateButtons();
    renderPages();
  }

  function updateButtons() {
    const hasPages = state.pages.length > 0;
    const hasSelection = state.selectedPageIds.size > 0;
    elements.exportAllButton.disabled = !hasPages;
    elements.exportSelectedButton.disabled = !hasSelection;
    elements.rotateLeftButton.disabled = !hasSelection;
    elements.rotateRightButton.disabled = !hasSelection;
    elements.deleteSelectedButton.disabled = !hasSelection;
    elements.splitToggleButton.disabled = !hasPages;
    elements.splitButton.disabled = !hasPages;
    elements.overlayToggleButton.disabled = !hasPages;
    elements.resetWorkspaceButton.disabled = !hasPages;
  }

  function renderPages() {
    disconnectPreviewObserver();
    elements.pagesGrid.innerHTML = '';
    previewObserver = new IntersectionObserver(onPreviewIntersection, { rootMargin: '220px' });

    state.pages.forEach((page, index) => {
      const card = document.createElement('article');
      card.className = 'page-card';
      card.draggable = true;
      card.dataset.pageId = page.id;
      card.dataset.selected = state.selectedPageIds.has(page.id) ? 'true' : 'false';

      card.addEventListener('dragstart', () => {
        state.draggingPageId = page.id;
        card.dataset.dragging = 'true';
      });

      card.addEventListener('dragend', () => {
        state.draggingPageId = null;
        card.dataset.dragging = 'false';
        clearDropTargets();
      });

      card.addEventListener('dragover', (event) => {
        event.preventDefault();
        card.dataset.dropTarget = event.clientX < getCardMidpoint(card) ? 'before' : 'after';
      });

      card.addEventListener('dragleave', () => {
        card.dataset.dropTarget = '';
      });

      card.addEventListener('drop', (event) => {
        event.preventDefault();
        const dropPosition = card.dataset.dropTarget === 'after' ? 'after' : 'before';
        card.dataset.dropTarget = '';
        if (!state.draggingPageId || state.draggingPageId === page.id) {
          return;
        }
        state.pages = movePageRelative(state.pages, state.draggingPageId, page.id, dropPosition);
        render();
        setStatus('success', 'Page order updated.');
      });

      const preview = document.createElement('div');
      preview.className = 'page-card__preview';
      const canvas = document.createElement('canvas');
      canvas.className = 'page-card__canvas';
      canvas.dataset.pageId = page.id;
      preview.appendChild(canvas);

      const meta = document.createElement('div');
      meta.className = 'page-card__meta';
      meta.innerHTML = `
        <div class="page-card__row">
          <div class="page-card__title">Page ${index + 1}</div>
          <input class="page-card__checkbox" type="checkbox" ${state.selectedPageIds.has(page.id) ? 'checked' : ''}>
        </div>
        <div class="page-card__actions">
          <button class="icon-button" type="button" data-action="move-left" title="Move left">←</button>
          <button class="icon-button" type="button" data-action="move-right" title="Move right">→</button>
          <button class="icon-button" type="button" data-action="rotate-left" title="Rotate left">↺</button>
          <button class="icon-button" type="button" data-action="rotate-right" title="Rotate right">↻</button>
          <button class="icon-button" type="button" data-action="stamp" title="Image stamp">◎</button>
          <button class="icon-button icon-button--accent" type="button" data-action="extract" title="Extract page">⇩</button>
          <button class="icon-button icon-button--danger" type="button" data-action="delete" title="Delete page">✕</button>
        </div>
        <div class="page-card__sub">${escapeHtml(page.sourceName)}${page.sourceType === 'pdf' ? ` · source page ${page.sourcePageIndex + 1}` : ' · image source'}</div>
        <div class="page-card__sub">Rotation ${normalizeRotation(page.baseRotation + page.rotation)}°</div>
      `;
      card.addEventListener('click', (event) => {
        if (event.target.closest('button') || event.target.closest('input')) {
          return;
        }
        toggleSelection(page.id);
      });

      meta.querySelector('.page-card__checkbox').addEventListener('change', () => {
        toggleSelection(page.id);
      });

      meta.querySelector('[data-action="move-left"]').addEventListener('click', () => moveSinglePage(page.id, -1));
      meta.querySelector('[data-action="move-right"]').addEventListener('click', () => moveSinglePage(page.id, 1));
      meta.querySelector('[data-action="rotate-left"]').addEventListener('click', () => rotateOnePage(page.id, -90));
      meta.querySelector('[data-action="rotate-right"]').addEventListener('click', () => rotateOnePage(page.id, 90));
      meta.querySelector('[data-action="stamp"]').addEventListener('click', () => stampEditor.open(page.id));
      meta.querySelector('[data-action="extract"]').addEventListener('click', () => openExportModal([page], buildFilename(`page-${index + 1}`), `Export page ${index + 1}`));
      meta.querySelector('[data-action="delete"]').addEventListener('click', () => deleteOnePage(page.id));

      card.append(preview, meta);
      elements.pagesGrid.appendChild(card);
      previewObserver.observe(canvas);
    });
  }


  function getPageById(pageId) {
    return state.pages.find((page) => page.id === pageId) || null;
  }

  function openExportModal(pages, filenameBase, label) {
    state.pendingExport = { pages, filenameBase, label };
    elements.exportModal.hidden = false;
    void refreshExportModalJpegDetails();
  }

  function closeExportModal() {
    state.pendingExport = null;
    elements.exportModal.hidden = true;
  }

  async function confirmExport(format) {
    if (!state.pendingExport) {
      closeExportModal();
      return;
    }

    const { pages, filenameBase } = state.pendingExport;
    closeExportModal();

    if (format === 'pdf') {
      await exportPagesAsPdf(pages, filenameBase);
      return;
    }

    await exportPagesAsJpeg(pages, filenameBase, false, getSelectedJpegOptions());
  }

  async function exportPagesAsPdf(pages, filenameBase, silent) {
    if (!pages.length) {
      setStatus('warning', 'There are no pages to export.');
      return;
    }

    try {
      const bytes = await buildPdfBytes(pages);
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${filenameBase}.pdf`);
      if (!silent) {
        setStatus('success', `Saved ${filenameBase}.pdf`);
      }
    } catch (error) {
      console.error(error);
      setStatus('error', `Export failed: ${error.message}`);
    }
  }

  async function exportPagesAsJpeg(pages, filenameBase, silent, jpegOptions) {
    if (!pages.length) {
      setStatus('warning', 'There are no pages to export.');
      return;
    }

    try {
      for (let index = 0; index < pages.length; index += 1) {
        const page = pages[index];
        const options = jpegOptions || getSelectedJpegOptions();
        const canvas = await renderPageForJpegExport(page, options);
        applyOverlaysToCanvas(canvas, index, pages.length, getOverlaySettings());
        const blob = await canvasToBlob(canvas, 'image/jpeg', options.quality);
        const suffix = pages.length === 1 ? '' : `-${index + 1}`;
        downloadBlob(blob, `${filenameBase}${suffix}.jpg`);
      }
      if (!silent) {
        setStatus('success', pages.length === 1 ? `Saved ${filenameBase}.jpg` : `Saved ${pages.length} JPEG files.`);
      }
    } catch (error) {
      console.error(error);
      setStatus('error', `JPEG export failed: ${error.message}`);
    }
  }

  async function refreshExportModalJpegDetails() {
    if (!state.pendingExport || !state.pendingExport.pages.length) {
      elements.exportJpegDetails.textContent = '';
      return;
    }

    const firstPage = state.pendingExport.pages[0];
    const options = getSelectedJpegOptions();
    const size = await getExportPixelSize(firstPage, options);
    elements.exportJpegDetails.textContent = `${options.label}: about ${size.width} x ${size.height} px for the first page, JPEG quality ${options.qualityPercent}. Exact file size depends on page content.`;
  }

  function getSelectedJpegOptions() {
    const preset = elements.exportJpegQualitySelect.value || 'high';
    return getJpegPresetOptions(preset);
  }

  async function renderPageForJpegExport(page, jpegOptions) {
    const options = jpegOptions || getSelectedJpegOptions();
    const scale = page.sourceType === 'pdf' ? options.pdfScale : options.imageScale;
    return renderPageToCanvas(page, scale);
  }

  async function getExportPixelSize(page, jpegOptions) {
    const options = jpegOptions || getSelectedJpegOptions();
    const source = state.sourceDocuments.find((item) => item.id === page.sourceDocId);
    if (!source) {
      return { width: 0, height: 0 };
    }

    if (source.type === 'pdf') {
      const pageProxy = await source.pdfjsDoc.getPage(page.sourcePageIndex + 1);
      const viewport = pageProxy.getViewport({
        scale: options.pdfScale,
        rotation: normalizeRotation(page.baseRotation + page.rotation),
      });
      pageProxy.cleanup();
      return { width: Math.ceil(viewport.width), height: Math.ceil(viewport.height) };
    }

    const rotated = Math.abs(normalizeRotation(page.rotation) % 180) === 90;
    const baseWidth = rotated ? source.height : source.width;
    const baseHeight = rotated ? source.width : source.height;
    return {
      width: Math.round(baseWidth * options.imageScale),
      height: Math.round(baseHeight * options.imageScale),
    };
  }

  async function handleFilesSplitExport(groups) {
    for (let index = 0; index < groups.length; index += 1) {
      const groupPages = groups[index].map((pageIndex) => state.pages[pageIndex]);
      await exportPagesAsPdf(groupPages, buildFilename(`part-${index + 1}`), true);
    }
    setStatus('success', `Exported ${groups.length} split PDF file${groups.length === 1 ? '' : 's'}.`);
  }

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

  function clearDropTargets() {
    document.querySelectorAll('[data-drop-target]').forEach((element) => {
      element.dataset.dropTarget = '';
    });
  }

  function toggleSelection(pageId) {
    if (state.selectedPageIds.has(pageId)) {
      state.selectedPageIds.delete(pageId);
    } else {
      state.selectedPageIds.add(pageId);
    }
    render();
  }

  function getSelectedPages() {
    return state.pages.filter((page) => state.selectedPageIds.has(page.id));
  }

  function rotateSelected(delta) {
    if (!state.selectedPageIds.size) {
      setStatus('warning', 'Select at least one page first.');
      return;
    }

    state.pages = state.pages.map((page) => state.selectedPageIds.has(page.id)
      ? { ...page, rotation: normalizeRotation(page.rotation + delta) }
      : page);

    previewCache.clear();
    render();
    setStatus('success', 'Rotation updated.');
  }

  function rotateOnePage(pageId, delta) {
    state.pages = state.pages.map((page) => page.id === pageId
      ? { ...page, rotation: normalizeRotation(page.rotation + delta) }
      : page);

    previewCache.clear();
    render();
    setStatus('success', 'Page rotated.');
  }

  function moveSinglePage(pageId, direction) {
    const index = state.pages.findIndex((page) => page.id === pageId);
    const targetIndex = index + direction;
    if (index === -1 || targetIndex < 0 || targetIndex >= state.pages.length) {
      return;
    }

    const nextPages = state.pages.slice();
    const [page] = nextPages.splice(index, 1);
    nextPages.splice(targetIndex, 0, page);
    state.pages = nextPages;
    render();
    setStatus('success', direction < 0 ? 'Page moved left.' : 'Page moved right.');
  }

  function deleteOnePage(pageId) {
    state.pages = state.pages.filter((page) => page.id !== pageId);
    state.selectedPageIds.delete(pageId);
    render();
    setStatus('success', 'Page deleted.');
  }

  function deleteSelected() {
    if (!state.selectedPageIds.size) {
      setStatus('warning', 'Select at least one page first.');
      return;
    }

    const removedCount = state.selectedPageIds.size;
    state.pages = state.pages.filter((page) => !state.selectedPageIds.has(page.id));
    state.selectedPageIds.clear();
    render();
    setStatus('success', `Deleted ${removedCount} page${removedCount === 1 ? '' : 's'}.`);
  }

  function toggleSplitPanel() {
    elements.splitPanel.hidden = !elements.splitPanel.hidden;
    if (!elements.splitPanel.hidden) {
      elements.splitInput.focus();
    }
  }

  function toggleOverlayPanel() {
    elements.overlayPanel.hidden = !elements.overlayPanel.hidden;
    if (!elements.overlayPanel.hidden) {
      elements.watermarkTextInput.focus();
    }
  }

  async function splitWorkspace() {
    if (!state.pages.length) {
      setStatus('warning', 'Import PDF or image files first.');
      return;
    }

    let groups;
    try {
      groups = parseSplitSpec(elements.splitInput.value, state.pages.length);
    } catch (error) {
      setStatus('error', error.message);
      return;
    }

    await handleFilesSplitExport(groups);
  }

  async function buildPdfBytes(pages) {
    const outputPdf = await PDFDocument.create();
    const loadedPdfSources = new Map();
    const sourceMap = new Map(state.sourceDocuments.map((source) => [source.id, source]));
    const helvetica = await outputPdf.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await outputPdf.embedFont(StandardFonts.HelveticaBold);

    for (let index = 0; index < pages.length; index += 1) {
      const pageRef = pages[index];
      const source = sourceMap.get(pageRef.sourceDocId);
      if (!source) {
        throw new Error('Missing source document.');
      }

      if (source.type === 'pdf') {
        let sourcePdf = loadedPdfSources.get(source.id);
        if (!sourcePdf) {
          sourcePdf = await PDFDocument.load(source.bytes);
          loadedPdfSources.set(source.id, sourcePdf);
        }

        const [copiedPage] = await outputPdf.copyPages(sourcePdf, [pageRef.sourcePageIndex]);
        copiedPage.setRotation(degrees(normalizeRotation((pageRef.baseRotation || 0) + (pageRef.rotation || 0))));
        outputPdf.addPage(copiedPage);
        await applyStampToPdfPage(outputPdf, copiedPage, pageRef.stamp);
        applyOverlaysToPdfPage(copiedPage, helvetica, helveticaBold, index, pages.length, getOverlaySettings());
        continue;
      }

      const imageBytes = source.bytes;
      const embeddedImage = source.mimeType === 'image/png'
        ? await outputPdf.embedPng(imageBytes)
        : await outputPdf.embedJpg(imageBytes);
      const imageDims = embeddedImage.scale(1);
      const page = outputPdf.addPage([imageDims.width, imageDims.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imageDims.width,
        height: imageDims.height,
        rotate: degrees(normalizeRotation(pageRef.rotation || 0)),
      });
      await applyStampToPdfPage(outputPdf, page, pageRef.stamp);
      applyOverlaysToPdfPage(page, helvetica, helveticaBold, index, pages.length, getOverlaySettings());
    }

    return outputPdf.save();
  }


  async function applyStampToPdfPage(outputPdf, page, stamp) {
    if (!stamp || !stamp.bytes) {
      return;
    }
    const { width, height } = page.getSize();
    const rect = getStampRenderRect(stamp, width, height);
    if (!rect) {
      return;
    }
    const embeddedImage = stamp.mimeType === 'image/png'
      ? await outputPdf.embedPng(stamp.bytes)
      : await outputPdf.embedJpg(stamp.bytes);
    page.drawImage(embeddedImage, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }
  function getOverlaySettings() {
    return {
      watermarkText: (state.overlays.watermarkText || '').trim(),
      watermarkPreset: state.overlays.watermarkPreset,
      pageNumbersEnabled: state.overlays.pageNumbersEnabled,
      pageNumberFormat: state.overlays.pageNumberFormat,
      pageNumberPreset: state.overlays.pageNumberPreset,
    };
  }

  function buildFilename(suffix) {
    const base = state.sourceDocuments.length === 1 ? trimExtension(state.sourceDocuments[0].name) : 'workspace';
    return sanitize(`${base}-${suffix}`);
  }

  async function onPreviewIntersection(entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      const canvas = entry.target;
      previewObserver.unobserve(canvas);
      const page = state.pages.find((item) => item.id === canvas.dataset.pageId);
      if (!page) {
        continue;
      }

      const rendered = await renderPageToCanvas(page, 1);
      canvas.width = rendered.width;
      canvas.height = rendered.height;
      const context = canvas.getContext('2d');
      context.drawImage(rendered, 0, 0);
    }
  }

  async function renderPageToCanvas(page, scaleMultiplier, options) {
    const renderOptions = options || {}; 
    const cacheKey = scaleMultiplier === 1 && !page.stamp ? `${page.id}:${normalizeRotation(page.baseRotation + page.rotation)}` : null;
    if (cacheKey && previewCache.has(cacheKey)) {
      const cached = previewCache.get(cacheKey);
      const image = await loadImageElement(cached.dataUrl);
      const canvas = document.createElement('canvas');
      canvas.width = cached.width;
      canvas.height = cached.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas;
    }

    const source = state.sourceDocuments.find((item) => item.id === page.sourceDocId);
    if (!source) {
      throw new Error('Missing preview source.');
    }

    if (source.type === 'pdf') {
      const pageProxy = await source.pdfjsDoc.getPage(page.sourcePageIndex + 1);
      const viewport = pageProxy.getViewport({
        scale: 0.62 * scaleMultiplier,
        rotation: normalizeRotation(page.baseRotation + page.rotation),
      });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      await pageProxy.render({ canvasContext: context, viewport }).promise;
      if (cacheKey) {
        previewCache.set(cacheKey, {
          width: canvas.width,
          height: canvas.height,
          dataUrl: canvas.toDataURL('image/webp', 0.92),
        });
      }
      pageProxy.cleanup();
      if (page.stamp && renderOptions.includeStamp !== false) {
        await stampEditor.drawStampOnCanvas(canvas, page.stamp);
      }
      return canvas;
    }

    const image = await importImageBitmapFromSource(source);
    const radians = normalizeRotation(page.rotation) * Math.PI / 180;
    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const rotated = Math.abs(normalizeRotation(page.rotation) % 180) === 90;
    const width = rotated ? sourceHeight : sourceWidth;
    const height = rotated ? sourceWidth : sourceHeight;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scaleMultiplier);
    canvas.height = Math.round(height * scaleMultiplier);
    const context = canvas.getContext('2d');
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(radians);
    context.drawImage(
      image,
      -sourceWidth * scaleMultiplier / 2,
      -sourceHeight * scaleMultiplier / 2,
      sourceWidth * scaleMultiplier,
      sourceHeight * scaleMultiplier
    );
    context.restore();
    if (page.stamp && renderOptions.includeStamp !== false) {
      await stampEditor.drawStampOnCanvas(canvas, page.stamp);
    }
    if (cacheKey) {
      previewCache.set(cacheKey, {
        width: canvas.width,
        height: canvas.height,
        dataUrl: canvas.toDataURL('image/webp', 0.92),
      });
    }
    return canvas;
  }

  function scrollToWorkspace() {
    if (elements.workspace.hidden) {
      return;
    }
    elements.workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function disconnectPreviewObserver() {
    if (previewObserver) {
      previewObserver.disconnect();
      previewObserver = null;
    }
  }

  function resetWorkspace() {
    disconnectPreviewObserver();
    for (const source of state.sourceDocuments) {
      if (source.type === 'pdf' && source.pdfjsDoc && typeof source.pdfjsDoc.destroy === 'function') {
        source.pdfjsDoc.destroy();
      }
      if (source.type === 'image' && source.objectUrl) {
        URL.revokeObjectURL(source.objectUrl);
      }
    }

    state.sourceDocuments = [];
    state.pages = [];
    state.selectedPageIds.clear();
    state.draggingPageId = null;
    state.pendingExport = null;
    state.stampEditor = { pageId: null, stamp: null, dragging: false, dragOffsetX: 0, dragOffsetY: 0, canvasRect: null, originalObjectUrl: null };
    previewCache.clear();
    elements.splitPanel.hidden = true;
    elements.overlayPanel.hidden = true;
    elements.splitInput.value = '';
    closeExportModal();
    render();
    setStatus('idle', '');
  }

  

  function setStatus(kind, message) {
    elements.status.dataset.kind = kind;
    elements.status.textContent = message;
  }

  })();




