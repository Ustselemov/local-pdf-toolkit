/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function isPdfFile(file) {
    return file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));
  }

  function isImageFile(file) {
    return file && ((file.type === 'image/png' || file.type === 'image/jpeg') || /\.(png|jpe?g)$/i.test(file.name || ''));
  }

  function isSupportedFile(file) {
    return isPdfFile(file) || isImageFile(file);
  }

  function detectImageMime(filename) {
    return /\.png$/i.test(filename || '') ? 'image/png' : 'image/jpeg';
  }

  globalThis.LocalPdfToolkitFileHelpers = {
    isPdfFile,
    isImageFile,
    isSupportedFile,
    detectImageMime,
  };
})();
