/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function createStampEditor(config) {
    const {
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
    } = config;

    async function open(pageId) {
      const page = getPageById(pageId);
      if (!page) {
        return;
      }
      state.stampEditor.pageId = pageId;
      state.stampEditor.stamp = cloneStamp(page.stamp || null);
      state.stampEditor.dragging = false;
      state.stampEditor.originalObjectUrl = page.stamp?.objectUrl || null;
      elements.stampSizeInput.value = String(Math.round((state.stampEditor.stamp?.widthRatio || 0.22) * 100));
      updateSizeLabel();
      elements.stampModal.hidden = false;
      await renderCanvas();
    }

    function close() {
      const currentObjectUrl = state.stampEditor.stamp?.objectUrl || null;
      if (currentObjectUrl && currentObjectUrl !== state.stampEditor.originalObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
      state.stampEditor.pageId = null;
      state.stampEditor.stamp = null;
      state.stampEditor.dragging = false;
      state.stampEditor.originalObjectUrl = null;
      elements.stampModal.hidden = true;
      elements.stampEditorCanvas.dataset.dragging = 'false';
      elements.stampModalStatus.textContent = 'Upload a PNG or JPG and drag it to the required position.';
    }

    function save() {
      const pageId = state.stampEditor.pageId;
      if (!pageId) {
        close();
        return;
      }
      state.pages = state.pages.map((page) => page.id === pageId ? { ...page, stamp: cloneStamp(state.stampEditor.stamp) } : page);
      previewCache.clear();
      render();
      state.stampEditor.originalObjectUrl = state.stampEditor.stamp?.objectUrl || null;
      close();
      setStatus('success', state.pages.find((page) => page.id === pageId)?.stamp ? 'Stamp saved.' : 'Stamp removed.');
    }

    async function handleFile(file) {
      if (!file) {
        return;
      }
      if (!isImageFile(file)) {
        elements.stampModalStatus.textContent = 'Use PNG or JPG for the stamp image.';
        return;
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const mimeType = file.type || detectImageMime(file.name);
      const blob = new Blob([bytes], { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);
      const size = await loadImageSize(objectUrl);
      if (state.stampEditor.stamp?.objectUrl && state.stampEditor.stamp.objectUrl !== state.stampEditor.originalObjectUrl) {
        URL.revokeObjectURL(state.stampEditor.stamp.objectUrl);
      }
      state.stampEditor.stamp = {
        bytes,
        mimeType,
        objectUrl,
        width: size.width,
        height: size.height,
        xRatio: 0.5,
        yRatio: 0.5,
        widthRatio: Number(elements.stampSizeInput.value) / 100,
      };
      elements.stampModalStatus.textContent = 'Drag the stamp to position it on the page.';
      await renderCanvas();
    }

    function updateSize(value) {
      if (!state.stampEditor.stamp) {
        updateSizeLabel();
        return;
      }
      state.stampEditor.stamp.widthRatio = clamp(value / 100, 0.08, 0.6);
      updateSizeLabel();
      void renderCanvas();
    }

    function updateSizeLabel() {
      elements.stampSizeLabel.textContent = `${elements.stampSizeInput.value}% page width`;
    }

    async function renderCanvas() {
      const page = getPageById(state.stampEditor.pageId);
      if (!page) {
        return;
      }
      const canvas = await renderPageToCanvas(page, 1.6, { includeStamp: false });
      await drawStampOnCanvas(canvas, state.stampEditor.stamp);
      elements.stampEditorCanvas.width = canvas.width;
      elements.stampEditorCanvas.height = canvas.height;
      elements.stampEditorCanvas.dataset.dragging = state.stampEditor.dragging ? 'true' : 'false';
      const context = elements.stampEditorCanvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(canvas, 0, 0);
    }

    async function drawStampOnCanvas(canvas, stamp) {
      if (!stamp || !stamp.objectUrl) {
        return;
      }
      const rect = getStampRenderRect(stamp, canvas.width, canvas.height);
      if (!rect) {
        return;
      }
      const context = canvas.getContext('2d');
      const image = await loadImageElement(stamp.objectUrl);
      context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    }

    function onPointerDown(event) {
      const stamp = state.stampEditor.stamp;
      if (!stamp) {
        return;
      }
      const rect = elements.stampEditorCanvas.getBoundingClientRect();
      const scaleX = elements.stampEditorCanvas.width / rect.width;
      const scaleY = elements.stampEditorCanvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      const stampRect = getStampRenderRect(stamp, elements.stampEditorCanvas.width, elements.stampEditorCanvas.height);
      if (!stampRect || x < stampRect.x || x > stampRect.x + stampRect.width || y < stampRect.y || y > stampRect.y + stampRect.height) {
        return;
      }
      state.stampEditor.dragging = true;
      state.stampEditor.dragOffsetX = x - stampRect.x;
      state.stampEditor.dragOffsetY = y - stampRect.y;
      elements.stampEditorCanvas.dataset.dragging = 'true';
      elements.stampEditorCanvas.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (!state.stampEditor.dragging || !state.stampEditor.stamp) {
        return;
      }
      const rect = elements.stampEditorCanvas.getBoundingClientRect();
      const scaleX = elements.stampEditorCanvas.width / rect.width;
      const scaleY = elements.stampEditorCanvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      const width = elements.stampEditorCanvas.width;
      const height = elements.stampEditorCanvas.height;
      const stampRect = getStampRenderRect(state.stampEditor.stamp, width, height);
      const centerX = clamp(x - state.stampEditor.dragOffsetX + stampRect.width / 2, stampRect.width / 2, width - stampRect.width / 2);
      const centerY = clamp(y - state.stampEditor.dragOffsetY + stampRect.height / 2, stampRect.height / 2, height - stampRect.height / 2);
      state.stampEditor.stamp.xRatio = centerX / width;
      state.stampEditor.stamp.yRatio = centerY / height;
      void renderCanvas();
    }

    function onPointerUp(event) {
      if (!state.stampEditor.dragging) {
        return;
      }
      state.stampEditor.dragging = false;
      elements.stampEditorCanvas.dataset.dragging = 'false';
      if (elements.stampEditorCanvas.hasPointerCapture(event.pointerId)) {
        elements.stampEditorCanvas.releasePointerCapture(event.pointerId);
      }
    }

    function remove() {
      if (state.stampEditor.stamp?.objectUrl && state.stampEditor.stamp.objectUrl !== state.stampEditor.originalObjectUrl) {
        URL.revokeObjectURL(state.stampEditor.stamp.objectUrl);
      }
      state.stampEditor.stamp = null;
      elements.stampModalStatus.textContent = 'Stamp removed. Save to apply the removal.';
      void renderCanvas();
    }

    return {
      open,
      close,
      save,
      handleFile,
      updateSize,
      updateSizeLabel,
      renderCanvas,
      drawStampOnCanvas,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      remove,
    };
  }

  globalThis.LocalPdfToolkitStampEditor = {
    createStampEditor,
  };
})();
