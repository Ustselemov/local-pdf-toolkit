/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to encode image.'));
          return;
        }
        resolve(blob);
      }, type, quality);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  globalThis.LocalPdfToolkitExportHelpers = {
    canvasToBlob,
    downloadBlob,
  };
})();
