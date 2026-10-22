/**
 * Preloader Module
 * Counter from 0 to 100 with a curtain reveal on every full page load.
 * The curtain and hero entrance share one GSAP timeline and progress curve.
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
    if (onRevealStart) onRevealStart(null, { duration: 0, ease: 'none' });
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

      // Keep a short beat on 100%, then start both motions at timeline position zero.
      window.setTimeout(() => {
        const curtainMotion = {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.85,
          ease: 'expo.inOut',
        };

        if (window.gsap) {
          const revealTimeline = window.gsap.timeline({
            paused: true,
            onComplete: () => {
              preloaderEl.style.display = 'none';
            },
          });

          if (onRevealStart) onRevealStart(revealTimeline, curtainMotion);
          revealTimeline.to(preloaderEl, curtainMotion, 0);
          revealTimeline.play(0);
        } else {
          if (onRevealStart) onRevealStart(null, curtainMotion);
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
