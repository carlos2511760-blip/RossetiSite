/** Scroll progress and visual category previews; both are optional enhancements. */
export function initEditorialInteractions() {
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  const updateProgress = () => {
    queued = false;
    const range = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
  };
  const queueProgress = () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  };
  addEventListener('scroll', queueProgress, { passive: true });
  addEventListener('resize', queueProgress, { passive: true });
  updateProgress();

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const images = {
    musica: 'assets/pulso/events/festival-musica.webp',
    cinema: 'assets/pulso/events/mostra-cinema.webp',
    teatro: 'assets/pulso/events/espetaculo-danca.webp',
    exposicoes: 'assets/pulso/events/tarsila-galeria.webp',
    'cultura-urbana': 'assets/pulso/events/hip-hop-urbano.webp',
    tecnologia: 'assets/pulso/events/emtech-conferencia.webp',
    games: 'assets/pulso/events/valorant-games.webp',
  };
  const preview = document.createElement('div');
  preview.className = 'category-preview';
  preview.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.alt = '';
  preview.append(image);
  document.body.append(preview);
  let frame = 0;
  let point = null;
  const move = () => {
    frame = 0;
    if (!point) return;
    preview.style.left = `${Math.min(innerWidth - 260, point.x + 28)}px`;
    preview.style.top = `${Math.max(90, Math.min(innerHeight - 300, point.y - 120))}px`;
  };
  document.querySelectorAll('.category-card-btn[data-category]').forEach((link) => {
    link.addEventListener('pointerenter', () => {
      image.src = images[link.dataset.category] || '';
      preview.classList.add('is-visible');
    });
    link.addEventListener('pointermove', (event) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(move);
    }, { passive: true });
    link.addEventListener('pointerleave', () => {
      preview.classList.remove('is-visible');
      point = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    });
  });
}
