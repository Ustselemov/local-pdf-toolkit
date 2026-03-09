/*
 * Local PDF Toolkit
 * Generated with the assistance of Codex AI
 * Prompted by Ustselemov
 */
(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function trimExtension(name) {
    return name.replace(/\.[^.]+$/i, '');
  }

  function sanitize(name) {
    return name.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'file';
  }

  function normalizeRotation(angle) {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCardMidpoint(card) {
    const rect = card.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  globalThis.LocalPdfToolkitCommonHelpers = {
    clamp,
    trimExtension,
    sanitize,
    normalizeRotation,
    escapeHtml,
    getCardMidpoint,
  };
})();
