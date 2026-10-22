/**
 * Main Application Orchestrator — Pulso SP
 * Coordinates Smooth Scroll, Custom Cursor, Infinite Marquees, Fullscreen Menu,
 * Preloader, Interactive Events Engine, and ScrollTrigger Animations.
 */
import { initSmoothScroll } from './smooth-scroll.js';
import { initCursor } from './cursor.js';
import { initMarquees } from './marquee.js';
import { initMenu } from './menu.js';
import { initPreloader } from './preloader.js';
import { initReveals } from './reveal.js';
import { initEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize custom kinetic cursor
  initCursor();

  // 2. Initialize smooth scroll (Lenis)
  initSmoothScroll();

  // 3. Initialize fullscreen menu
  initMenu();

  // 4. Initialize velocity-reactive marquees
  initMarquees();

  // 5. Initialize interactive events engine (filters, localStorage, form)
  initEvents();

  // 6. Initialize the preloader and start reveals with the curtain exit
  initPreloader(() => {
    initReveals();
  });
});
