// tooltip.js
// Handles toggling of tooltip visibility and closing when clicking outside.

(function () {
  // If this file is loaded in a non-DOM environment (for example Node),
  // avoid running any DOM code. This makes the module safe to require/run
  // during tooling or tests.
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  document.addEventListener('DOMContentLoaded', function () {
    const infoIcons = Array.from(document.querySelectorAll('.info-icon'));

    function closeAllTooltips() {
      document.querySelectorAll('.tooltip.open').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-hidden', 'true');
        const trigger = t.closest('.info-icon');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    // Toggle tooltip when clicking the info icon
    infoIcons.forEach(icon => {
      const tooltip = icon.querySelector('.tooltip');
      if (!tooltip) return;

      // Add ARIA attributes
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-expanded', 'false');
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');

      // Open/close when clicking the icon
      icon.addEventListener('click', function (ev) {
        ev.stopPropagation(); // Prevent the click from reaching parent .card
        // Close other tooltips first
        const isOpen = tooltip.classList.contains('open');
        closeAllTooltips();
        if (!isOpen) {
          tooltip.classList.add('open');
          tooltip.setAttribute('aria-hidden', 'false');
          icon.setAttribute('aria-expanded', 'true');
          // move focus into tooltip for keyboard users (if focusable element exists, focus first link)
          const firstFocusable = tooltip.querySelector('a, button, [tabindex]');
          if (firstFocusable) firstFocusable.focus();
          else tooltip.focus && tooltip.focus();
        } else {
          icon.focus();
        }
      });

      // Also allow keyboard users to toggle via Enter/Space
      icon.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          icon.click();
        }
      });

      // Prevent clicks inside tooltip from closing it or causing navigation to parent
      tooltip.addEventListener('click', function (ev) {
        ev.stopPropagation();
        // Let links inside tooltips function normally by not calling preventDefault
      });
    });

    // Use capture-phase click handler to intercept clicks before card handlers run
    document.addEventListener('click', function (ev) {
      // If any tooltip is open, we should decide whether to allow navigation
      const openTooltip = document.querySelector('.tooltip.open');
      if (!openTooltip) return; // nothing to do

      // If the click target is an <a> inside the open tooltip, allow navigation but close tooltips
      const anchor = ev.target.closest && ev.target.closest('a');
      if (anchor && anchor.closest && anchor.closest('.tooltip')) {
        closeAllTooltips();
        // allow navigation to proceed
        return;
      }

      // For all other clicks when a tooltip is open, close tooltips and stop propagation
      // to prevent underlying .card onclick handlers from firing (which would navigate)
      ev.stopPropagation();
      ev.preventDefault && ev.preventDefault();
      closeAllTooltips();
    }, true); // capture = true

    // If user presses Escape, close tooltips
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeAllTooltips();
    });
  });
})();
