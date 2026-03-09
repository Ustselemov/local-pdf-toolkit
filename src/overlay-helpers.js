/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  const { rgb, degrees } = globalThis.PDFLib;
  const { clamp } = globalThis.LocalPdfToolkitCommonHelpers;

  function formatPageNumber(index, total, format) {
    if (format === 'page-of-total') {
      return `Page ${index} of ${total}`;
    }
    return String(index);
  }

  function drawPdfWatermark(page, font, text, preset, width, height) {
    const size = clamp(Math.min(width, height) * 0.12, 28, 88);
    const textWidth = font.widthOfTextAtSize(text, size);
    const base = {
      size,
      font,
      color: rgb(0.32, 0.37, 0.4),
      opacity: 0.16,
      rotate: degrees(0),
      x: (width - textWidth) / 2,
      y: (height - size) / 2,
    };

    if (preset === 'center-diagonal') {
      base.rotate = degrees(-32);
    }

    if (preset === 'top-center') {
      base.y = height - size - clamp(height * 0.06, 18, 42);
    }

    if (preset === 'bottom-center') {
      base.y = clamp(height * 0.06, 18, 42);
    }

    page.drawText(text, base);
  }

  function drawPdfPageNumber(page, font, label, preset, width, height) {
    const size = clamp(Math.min(width, height) * 0.03, 12, 24);
    const textWidth = font.widthOfTextAtSize(label, size);
    const marginX = clamp(width * 0.05, 16, 40);
    const marginY = clamp(height * 0.04, 14, 30);
    let x = width - marginX - textWidth;
    let y = marginY;

    if (preset === 'bottom-center') {
      x = (width - textWidth) / 2;
    }

    if (preset === 'top-right') {
      y = height - marginY - size;
    }

    page.drawText(label, {
      x,
      y,
      size,
      font,
      color: rgb(0.2, 0.23, 0.26),
      opacity: 0.86,
    });
  }

  function applyOverlaysToCanvas(canvas, exportIndex, totalPages, settings) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (settings.watermarkText) {
      const size = clamp(Math.min(width, height) * 0.12, 34, 140);
      context.save();
      context.fillStyle = 'rgba(44, 52, 58, 0.15)';
      context.font = `700 ${size}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      if (settings.watermarkPreset === 'center-diagonal') {
        context.translate(width / 2, height / 2);
        context.rotate(-Math.PI / 5.8);
        context.fillText(settings.watermarkText, 0, 0);
      }

      if (settings.watermarkPreset === 'top-center') {
        context.fillText(settings.watermarkText, width / 2, clamp(height * 0.1, 42, 90));
      }

      if (settings.watermarkPreset === 'bottom-center') {
        context.fillText(settings.watermarkText, width / 2, height - clamp(height * 0.1, 42, 90));
      }

      context.restore();
    }

    if (settings.pageNumbersEnabled) {
      const label = formatPageNumber(exportIndex + 1, totalPages, settings.pageNumberFormat);
      const size = clamp(Math.min(width, height) * 0.032, 18, 34);
      const marginX = clamp(width * 0.05, 20, 48);
      const marginY = clamp(height * 0.045, 20, 42);
      let x = width - marginX;
      let y = height - marginY;
      let align = 'right';

      if (settings.pageNumberPreset === 'bottom-center') {
        x = width / 2;
        align = 'center';
      }

      if (settings.pageNumberPreset === 'top-right') {
        y = marginY + size;
      }

      context.save();
      context.fillStyle = 'rgba(28, 32, 36, 0.88)';
      context.font = `500 ${size}px Arial`;
      context.textAlign = align;
      context.textBaseline = 'alphabetic';
      context.fillText(label, x, y);
      context.restore();
    }
  }

  function applyOverlaysToPdfPage(page, font, boldFont, exportIndex, totalPages, settings) {
    const { width, height } = page.getSize();

    if (settings.watermarkText) {
      drawPdfWatermark(page, boldFont, settings.watermarkText, settings.watermarkPreset, width, height);
    }

    if (settings.pageNumbersEnabled) {
      const label = formatPageNumber(exportIndex + 1, totalPages, settings.pageNumberFormat);
      drawPdfPageNumber(page, font, label, settings.pageNumberPreset, width, height);
    }
  }

  globalThis.LocalPdfToolkitOverlayHelpers = {
    formatPageNumber,
    drawPdfWatermark,
    drawPdfPageNumber,
    applyOverlaysToCanvas,
    applyOverlaysToPdfPage,
  };
})();
