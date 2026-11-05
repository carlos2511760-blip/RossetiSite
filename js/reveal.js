/** Native, one-shot reveals. Content remains visible if the observer is unavailable. */
export function initReveals() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.line-mask-inner, .category-card-btn, .region-row-btn');
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('in-view');
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach((target) => {
      target.classList.add('observe-reveal');
      observer.observe(target);
    });
  }
}
