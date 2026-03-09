/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function cloneStamp(stamp) {
    return stamp ? { ...stamp } : null;
  }

  function getStampRenderRect(stamp, pageWidth, pageHeight) {
    if (!stamp) {
      return null;
    }

    const targetWidth = pageWidth * stamp.widthRatio;
    const targetHeight = targetWidth * (stamp.height / stamp.width);
    const centerX = pageWidth * stamp.xRatio;
    const centerY = pageHeight * stamp.yRatio;

    return {
      x: centerX - targetWidth / 2,
      y: centerY - targetHeight / 2,
      width: targetWidth,
      height: targetHeight,
    };
  }

  globalThis.LocalPdfToolkitStampHelpers = {
    cloneStamp,
    getStampRenderRect,
  };
})();
