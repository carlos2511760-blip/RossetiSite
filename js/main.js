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
import { initDepth } from './depth.js';
import { initEditorialInteractions } from './editorial-interactions.js';
import { initHeroScene } from './scene3d.js';
import { initAudio } from './audio.js';
import { initClock } from './clock.js';
import { initImageEffects } from './image-effects.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize custom kinetic cursor
  initCursor();

  // 2. Tactical Audio & Live Clock
  initAudio();
  initClock();

  // 3. Native scroll and lightweight depth effects
  initSmoothScroll();
  initDepth();
  initEditorialInteractions();
  initHeroScene();

  // 4. Initialize fullscreen menu
  initMenu();

  // 5. Initialize velocity-reactive marquees
  initMarquees();

  // 6. Initialize interactive events engine (filters, localStorage, form)
  initEvents();

  // 7. Initialize the preloader and start reveals with the curtain exit
  initPreloader((revealTimeline, revealMotion) => {
    initReveals(revealTimeline, revealMotion);
  });

  // 8. Cinematic image effects (parallax, tilt, grain, reveals)
  initImageEffects();
});
