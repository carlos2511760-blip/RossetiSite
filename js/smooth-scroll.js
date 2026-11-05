/** Native scrolling keeps wheel, trackpad and touch input responsive. */
export function initSmoothScroll() {
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 50);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  document.querySelector('[data-scroll-to-top]')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  return null;
}
export function getLenis() { return null; }
export function stopScroll() { document.body.classList.add('no-scroll'); }
export function resumeScroll() { document.body.classList.remove('no-scroll'); }
