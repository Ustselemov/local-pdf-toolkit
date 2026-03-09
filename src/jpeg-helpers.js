/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function getJpegPresetOptions(preset) {
    if (preset === 'max') {
      return { preset, label: 'Maximum', quality: 1, qualityPercent: '100%', pdfScale: 6.5, imageScale: 2 };
    }

    if (preset === 'medium') {
      return { preset, label: 'Medium', quality: 0.92, qualityPercent: '92%', pdfScale: 3, imageScale: 1 };
    }

    return { preset: 'high', label: 'High', quality: 0.98, qualityPercent: '98%', pdfScale: 4.5, imageScale: 1.5 };
  }

  function formatJpegDetails(options, size) {
    return `${options.label}: about ${size.width} x ${size.height} px for the first page, JPEG quality ${options.qualityPercent}. Exact file size depends on page content.`;
  }

  globalThis.LocalPdfToolkitJpegHelpers = {
    getJpegPresetOptions,
    formatJpegDetails,
  };
})();
