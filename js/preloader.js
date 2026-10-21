/**
 * Preloader Module
 * Numerical counter (0-100) with curtain clip-path reveal and sessionStorage caching.
 */
export function initPreloader(onComplete) {
  const preloaderEl = document.querySelector('.preloader-curtain');
  const countEl = document.querySelector('.preloader-count');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!preloaderEl) {
    if (onComplete) onComplete();
    return;
  }

  const hasVisited = sessionStorage.getItem('visited_case_study');

  if (hasVisited || prefersReducedMotion) {
    // Quick exit for repeat visitors or reduced motion
    preloaderEl.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  sessionStorage.setItem('visited_case_study', 'true');

  let current = 0;
  const target = 100;
  const duration = 1400; // ms
  const intervalTime = 20;
  const increment = target / (duration / intervalTime);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
      if (countEl) countEl.textContent = '100';

      // Curtain slide-up reveal
      setTimeout(() => {
        if (window.gsap) {
          window.gsap.to(preloaderEl, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.85,
            ease: 'expo.inOut',
            onComplete: () => {
              preloaderEl.style.display = 'none';
              if (onComplete) onComplete();
            },
          });
        } else {
          preloaderEl.style.opacity = '0';
          setTimeout(() => {
            preloaderEl.style.display = 'none';
            if (onComplete) onComplete();
          }, 300);
        }
      }, 150);
    } else {
      if (countEl) countEl.textContent = Math.floor(current).toString().padStart(2, '0');
    }
  }, intervalTime);
}
