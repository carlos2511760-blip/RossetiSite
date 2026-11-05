/** Pointer-driven depth; no scroll handler or permanent animation loop. */
export function initDepth() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero-cover-wrapper');
  const cards = document.querySelectorAll('.gallery-card.event-card-item');
  const surfaces = hero ? [hero, ...cards] : [...cards];

  surfaces.forEach((surface) => {
    let frame = 0;
    let point = null;
    const update = () => {
      frame = 0;
      if (!point) return;
      const rect = surface.getBoundingClientRect();
      const x = (point.x - rect.left) / rect.width - 0.5;
      const y = (point.y - rect.top) / rect.height - 0.5;
      surface.style.setProperty('--depth-x', `${(y * -7).toFixed(2)}deg`);
      surface.style.setProperty('--depth-y', `${(x * 7).toFixed(2)}deg`);
      surface.style.setProperty('--light-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      surface.style.setProperty('--light-y', `${((y + 0.5) * 100).toFixed(1)}%`);
    };
    surface.addEventListener('pointermove', (event) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
    surface.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      surface.style.removeProperty('--depth-x');
      surface.style.removeProperty('--depth-y');
      surface.style.removeProperty('--light-x');
      surface.style.removeProperty('--light-y');
    });
  });
}
