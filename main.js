// main.js
// Delegated handlers for card navigation and other page-level behaviors

(function () {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  document.addEventListener('DOMContentLoaded', function () {
    // Delegate clicks on cards
    document.addEventListener('click', function (ev) {
      // Ignore clicks that already stopped propagation
      const card = ev.target.closest && ev.target.closest('.card.clickable');
      if (!card) return;

      // If the click was inside an info-icon or tooltip, ignore (tooltip logic handles it)
      if (ev.target.closest('.info-icon') || ev.target.closest('.tooltip')) return;

      const href = card.getAttribute('data-href');
      if (!href) return;

      const target = card.getAttribute('data-target');
      if (target === '_blank') {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
    });

    // Make keyboard accessible: Enter on the card should also activate it
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      const active = document.activeElement;
      if (!active) return;
      const card = active.closest && active.closest('.card.clickable');
      if (!card) return;

      // If focus is inside tooltip or info icon, do nothing
      if (document.activeElement.closest('.info-icon') || document.activeElement.closest('.tooltip')) return;

      const href = card.getAttribute('data-href');
      if (!href) return;
      const target = card.getAttribute('data-target');
      if (target === '_blank') window.open(href, '_blank');
      else window.location.href = href;
    });
  });
})();
