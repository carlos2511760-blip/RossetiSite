/**
 * Custom Kinetic Cursor Module
 * Features smooth lerp physics, contextual text labels, and touch detection.
 */
export function initCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  const cursorEl = document.querySelector('.custom-cursor');
  const cursorLabel = document.querySelector('.custom-cursor-label');

  if (isTouch || !cursorEl) {
    if (cursorEl) cursorEl.style.display = 'none';
    document.body.classList.remove('has-custom-cursor');
    return;
  }

  document.body.classList.add('has-custom-cursor');

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { x: mouse.x, y: mouse.y };
  const speed = 0.15; // Lerp factor
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // RAF loop for smooth lerp position
  function render() {
    pos.x += (mouse.x - pos.x) * speed;
    pos.y += (mouse.y - pos.y) * speed;

    cursorEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Targets with contextual text labels
  const interactiveTargets = document.querySelectorAll('[data-cursor]');
  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      const label = target.getAttribute('data-cursor') || '';
      cursorEl.classList.add('is-active');
      if (cursorLabel) {
        cursorLabel.textContent = label;
      }
    });

    target.addEventListener('mouseleave', () => {
      cursorEl.classList.remove('is-active');
      if (cursorLabel) {
        cursorLabel.textContent = '';
      }
    });
  });

  // Standard interactive links/buttons (simple scale without text)
  const regularLinks = document.querySelectorAll('a:not([data-cursor]), button:not([data-cursor])');
  regularLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      cursorEl.classList.add('is-hover-link');
    });
    link.addEventListener('mouseleave', () => {
      cursorEl.classList.remove('is-hover-link');
    });
  });

  // Hide cursor when leaving viewport
  document.addEventListener('mouseleave', () => {
    cursorEl.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorEl.style.opacity = '1';
  });
}
