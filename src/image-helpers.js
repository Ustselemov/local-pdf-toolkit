/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function loadImageSize(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error('Unable to read image size.'));
      image.src = url;
    });
  }

  function loadImageElement(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load image.'));
      image.src = url;
    });
  }

  async function importImageBitmapFromSource(source) {
    const blob = new Blob([source.bytes], { type: source.mimeType });
    if (typeof createImageBitmap === 'function') {
      return createImageBitmap(blob);
    }

    return loadImageElement(URL.createObjectURL(blob));
  }

  globalThis.LocalPdfToolkitImageHelpers = {
    loadImageSize,
    loadImageElement,
    importImageBitmapFromSource,
  };
})();
