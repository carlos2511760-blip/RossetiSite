/**
 * Preloader Module
 * Counter from 0 to 100 with a curtain reveal on every full page load.
 * The page reveals start as the curtain begins to move so the hero title stays in sync.
 */
export function initPreloader(onRevealStart) {
  const preloaderEl = document.querySelector('.preloader-curtain');
  const countEl = document.querySelector('.preloader-count');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!preloaderEl) {
    if (onRevealStart) onRevealStart();
    return;
  }

  if (prefersReducedMotion) {
    if (countEl) countEl.textContent = '100';
    if (onRevealStart) onRevealStart();
    window.setTimeout(() => {
      preloaderEl.style.display = 'none';
    }, 250);
    return;
  }

  let current = 0;
  const target = 100;
  const duration = 1400;
  const intervalTime = 20;
  const increment = target / (duration / intervalTime);

  const timer = window.setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      window.clearInterval(timer);
      if (countEl) countEl.textContent = '100';

      // Keep a short beat on 100%, then start hero motion with the curtain exit.
      window.setTimeout(() => {
        if (onRevealStart) onRevealStart();

        if (window.gsap) {
          window.gsap.to(preloaderEl, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.85,
            ease: 'expo.inOut',
            onComplete: () => {
              preloaderEl.style.display = 'none';
            },
          });
        } else {
          preloaderEl.style.opacity = '0';
          window.setTimeout(() => {
            preloaderEl.style.display = 'none';
          }, 300);
        }
      }, 150);
    } else if (countEl) {
      countEl.textContent = Math.floor(current).toString().padStart(2, '0');
    }
  }, intervalTime);
}
