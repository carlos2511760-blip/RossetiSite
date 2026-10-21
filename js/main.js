/**
 * Main Application Orchestrator
 * Coordinates Smooth Scroll, Custom Cursor, Infinite Marquees, Fullscreen Menu,
 * Preloader, and ScrollTrigger Animations.
 */
import { initSmoothScroll } from './smooth-scroll.js';
import { initCursor } from './cursor.js';
import { initMarquees } from './marquee.js';
import { initMenu } from './menu.js';
import { initPreloader } from './preloader.js';
import { initReveals } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize custom kinetic cursor
  initCursor();

  // 2. Initialize smooth scroll (Lenis)
  initSmoothScroll();

  // 3. Initialize fullscreen menu
  initMenu();

  // 4. Initialize velocity-reactive marquees
  initMarquees();

  // 5. Initialize preloader curtain and run reveals upon completion
  initPreloader(() => {
    initReveals();
  });
});
