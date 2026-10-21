/**
 * Fullscreen Editorial Menu Module
 * Includes focus trap, roll text effect, ESC key support, and scroll lock.
 */
import { stopScroll, resumeScroll } from './smooth-scroll.js';

export function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle-btn');
  const menuOverlay = document.querySelector('.menu-fullscreen');
  const menuItems = document.querySelectorAll('.menu-nav-item');
  const menuLinks = document.querySelectorAll('.menu-roll-link');
  const closeTriggers = document.querySelectorAll('[data-close-menu]');
  const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

  if (!menuToggle || !menuOverlay) return;

  let isOpen = false;
  let previousActiveElement = null;

  function openMenu() {
    isOpen = true;
    previousActiveElement = document.activeElement;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');

    stopScroll();

    // GSAP staggered entrance animation
    if (window.gsap) {
      window.gsap.fromTo(
        '.menu-roll-text',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.2,
        }
      );

      window.gsap.fromTo(
        '.menu-footer-content',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: 0.5 }
      );
    }

    // Set focus to the first focusable item inside menu
    const focusable = menuOverlay.querySelectorAll(focusableSelector);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');

    resumeScroll();

    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  // Toggle button click
  menuToggle.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close triggers (e.g. clicking a link)
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }

    // Focus Trap inside menu
    if (e.key === 'Tab' && isOpen) {
      const focusable = Array.from(menuOverlay.querySelectorAll(focusableSelector));
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // Roll effect and dimming non-hovered items
  menuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      menuLinks.forEach((otherLink) => {
        if (otherLink !== link) {
          otherLink.style.opacity = '0.28';
        }
      });
    });

    link.addEventListener('mouseleave', () => {
      menuLinks.forEach((otherLink) => {
        otherLink.style.opacity = '1';
      });
    });
  });

  // Language selector interactive state
  const langButtons = document.querySelectorAll('.menu-lang-btn');
  langButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      langButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}
