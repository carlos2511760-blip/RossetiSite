/**
 * Smooth Scroll Module (Lenis + GSAP ScrollTrigger Integration)
 */
let lenis = null;

export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof window.Lenis === 'undefined') {
    // Graceful fallback for reduced motion or missing library
    return null;
  }

  lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out curve
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    lerp: 0.09,
  });

  // Sync Lenis with GSAP ScrollTrigger
  if (window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);

    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    window.gsap.ticker.lagSmoothing(0);
  }

  // Bind back to top button
  const backToTopBtn = document.querySelector('[data-scroll-to-top]');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.5 });
    });
  }

  // Bind header frosted glass on scroll to prevent text collisions
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const checkHeaderScroll = (y) => {
      if (y > 50) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };

    if (lenis) {
      lenis.on('scroll', ({ scroll }) => checkHeaderScroll(scroll));
    } else {
      window.addEventListener('scroll', () => checkHeaderScroll(window.scrollY), { passive: true });
    }
  }

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function stopScroll() {
  if (lenis) lenis.stop();
  document.body.classList.add('no-scroll');
}

export function resumeScroll() {
  if (lenis) lenis.start();
  document.body.classList.remove('no-scroll');
}
