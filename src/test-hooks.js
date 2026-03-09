/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function installTestApi(config) {
    const {
      handleFiles,
      resetWorkspace,
      state,
      elements,
      getPageById,
      renderPageToCanvas,
      stampEditor,
    } = config;

    globalThis.LocalPdfToolkitTestApi = {
      importFiles: async (files) => handleFiles(files),
      resetWorkspace,
      getSnapshot: () => ({
        sourceCount: state.sourceDocuments.length,
        pageCount: state.pages.length,
        pageIds: state.pages.map((page) => page.id),
        stampedPageIds: state.pages.filter((page) => page.stamp).map((page) => page.id),
        workspaceHidden: elements.workspace.hidden,
        goToEditorDisabled: elements.goToEditorButton.disabled,
        status: elements.status.textContent,
        cardCount: elements.pagesGrid.children.length,
      }),
      applyStampToPage: async (pageId, file) => {
        await stampEditor.open(pageId);
        await stampEditor.handleFile(file);
        stampEditor.save();
      },
      renderPage: async (pageId, scale) => {
        const page = getPageById(pageId);
        if (!page) {
          throw new Error('Page not found for smoke test.');
        }
        const canvas = await renderPageToCanvas(page, scale || 1);
        return { width: canvas.width, height: canvas.height };
      },
    };
  }

  async function runSmokeTest(config) {
    const {
      isSmokeMode,
      setStatus,
    } = config;

    if (!isSmokeMode) {
      return;
    }

    const resultNode = document.createElement('pre');
    resultNode.id = 'smoke-result';
    resultNode.hidden = true;
    document.body.appendChild(resultNode);

    const setSmokeResult = (status, details) => {
      resultNode.dataset.status = status;
      resultNode.textContent = JSON.stringify({ status, ...details }, null, 2);
      document.documentElement.dataset.smokeStatus = status;
    };

    try {
      const pdfFile = await loadSmokeFile('./sample-files/sample-a.pdf', 'sample-a.pdf', 'application/pdf');
      const imageFile = await loadSmokeFile('./sample-files/stamp-sample.jpg', 'stamp-sample.jpg', 'image/jpeg');
      const stampFile = await loadSmokeFile('./sample-files/stamp-sample.png', 'stamp-sample.png', 'image/png');

      await globalThis.LocalPdfToolkitTestApi.importFiles([pdfFile, imageFile]);
      const snapshotAfterImport = globalThis.LocalPdfToolkitTestApi.getSnapshot();
      if (snapshotAfterImport.sourceCount !== 2 || snapshotAfterImport.pageCount < 3 || snapshotAfterImport.cardCount !== snapshotAfterImport.pageCount) {
        throw new Error(`Unexpected import snapshot: ${JSON.stringify(snapshotAfterImport)}`);
      }

      const renderInfo = await globalThis.LocalPdfToolkitTestApi.renderPage(snapshotAfterImport.pageIds[0], 1);
      if (!renderInfo.width || !renderInfo.height) {
        throw new Error(`Render failed: ${JSON.stringify(renderInfo)}`);
      }

      await globalThis.LocalPdfToolkitTestApi.applyStampToPage(snapshotAfterImport.pageIds[0], stampFile);
      const snapshotAfterStamp = globalThis.LocalPdfToolkitTestApi.getSnapshot();
      if (!snapshotAfterStamp.stampedPageIds.includes(snapshotAfterImport.pageIds[0])) {
        throw new Error(`Stamp was not saved: ${JSON.stringify(snapshotAfterStamp)}`);
      }

      setSmokeResult('pass', {
        importedSources: snapshotAfterStamp.sourceCount,
        importedPages: snapshotAfterStamp.pageCount,
        stampedPages: snapshotAfterStamp.stampedPageIds.length,
        renderWidth: renderInfo.width,
        renderHeight: renderInfo.height,
      });
    } catch (error) {
      console.error(error);
      setStatus('error', error.message);
      setSmokeResult('fail', { message: error.message });
    }
  }

  async function loadSmokeFile(relativePath, filename, mimeType) {
    const response = await fetch(relativePath);
    if (!response.ok) {
      throw new Error(`Unable to load smoke fixture: ${relativePath}`);
    }
    const bytes = await response.arrayBuffer();
    return new File([bytes], filename, { type: mimeType });
  }

  globalThis.LocalPdfToolkitTestHooks = {
    installTestApi,
    runSmokeTest,
  };
})();
