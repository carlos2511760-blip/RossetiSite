/** Build the visible page in layers without intercepting scrolling or changing text. */
export function initReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const active = new Map();
  const titles = 'main section:not(.hero-section) h2, .submit-intro-col h3, .footer-heading, .overview-paragraph';
  const layers = '.event-card-item .reveal-clip, .category-card-btn, .region-row-btn, .form-field, .meta-column, .featured-week-content';
  const targets = document.querySelectorAll(`${titles}, ${layers}`);
  const finish = (el) => {
    (active.get(el) || []).forEach(animation => animation.finish());
    active.delete(el);
    el.querySelectorAll(':scope > .build-cursor').forEach(cursor => cursor.remove());
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
      if (!isIntersecting) {
        if (active.has(target)) finish(target);
        return;
      }
      if (target.dataset.built) return;
      target.dataset.built = 'true';
      // Never hide the focused control or interrupt a jump back up the page.
      if (target.contains(document.activeElement) || boundingClientRect.bottom < 60) return;
      const text = target.matches(titles);
      const delay = Number(target.dataset.buildDelay || 0);
      const animations = [];
      if (text) {
        target.classList.add('build-text');
        animations.push(target.animate([
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)' }
        ], { duration: 1150, delay, easing: 'steps(36, end)', fill: 'backwards' }));
        const cursor = document.createElement('span');
        cursor.className = 'build-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        target.append(cursor);
        const travel = cursor.animate([
          { left: '0%', opacity: 1, transform: 'translateY(-3px)' },
          { left: '95%', opacity: 1, transform: 'translateY(3px)' }
        ], { duration: 1150, delay, easing: 'steps(36, end)', fill: 'backwards' });
        travel.onfinish = () => cursor.remove();
        animations.push(travel);
      } else {
        animations.push(target.animate([
          { opacity: .15, transform: 'perspective(1100px) translateY(65px) translateZ(-150px) rotateX(12deg) scale(.9)' },
          { opacity: 1, transform: 'perspective(1100px) translateY(0) translateZ(0) rotateX(0) scale(1)' }
        ], { duration: 900, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
      }
      active.set(target, animations);
      Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => active.delete(target));
    });
  }, { threshold: .08, rootMargin: '0px 0px -35px 0px' });
  targets.forEach((target, index) => {
    target.dataset.buildDelay = String((index % 3) * 100);
    observer.observe(target);
  });
  document.addEventListener('focusin', event => {
    active.forEach((_, target) => { if (target.contains(event.target)) finish(target); });
  });
}
