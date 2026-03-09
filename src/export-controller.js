/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function createExportController(config) {
    const {
      state,
      elements,
      getOverlaySettings,
      getSelectedJpegOptions,
      renderPageForJpegExport,
      buildPdfBytes,
      canvasToBlob,
      downloadBlob,
      setStatus,
      applyOverlaysToCanvas,
      onModalOpen,
    } = config;

    function openExportModal(pages, filenameBase, label) {
      state.pendingExport = { pages, filenameBase, label };
      elements.exportModal.hidden = false;
      if (typeof onModalOpen === 'function') {
        void onModalOpen();
      }
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

    return {
      openExportModal,
      closeExportModal,
      confirmExport,
      exportPagesAsPdf,
      exportPagesAsJpeg,
    };
  }

  globalThis.LocalPdfToolkitExportController = {
    createExportController,
  };
})();


