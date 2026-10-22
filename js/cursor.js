/**
 * Custom Kinetic Cursor Module
 * Smooth lerp motion with delegated target detection (including cards added later).
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
  let position = { x: mouse.x, y: mouse.y };
  let activeTarget = null;
  let activeRegularLink = null;
  const speed = 0.15;

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  function render() {
    position.x += (mouse.x - position.x) * speed;
    position.y += (mouse.y - position.y) * speed;
    cursorEl.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Delegation keeps cursor labels working for event cards created after page initialization.
  document.addEventListener('pointerover', (event) => {
    const target = event.target.closest?.('[data-cursor]');
    if (target && target !== activeTarget) {
      activeTarget = target;
      cursorEl.classList.remove('is-hover-link');
      cursorEl.classList.add('is-active');
      if (cursorLabel) cursorLabel.textContent = target.getAttribute('data-cursor') || '';
    }

    const regularLink = event.target.closest?.('a:not([data-cursor]), button:not([data-cursor])');
    if (regularLink && regularLink !== activeRegularLink) {
      activeRegularLink = regularLink;
      cursorEl.classList.remove('is-active');
      cursorEl.classList.add('is-hover-link');
      if (cursorLabel) cursorLabel.textContent = '';
    }
  });

  document.addEventListener('pointerout', (event) => {
    if (activeTarget && event.target.closest?.('[data-cursor]') === activeTarget &&
        !activeTarget.contains(event.relatedTarget)) {
      activeTarget = null;
      cursorEl.classList.remove('is-active');
      if (cursorLabel) cursorLabel.textContent = '';
    }

    if (activeRegularLink && event.target.closest?.('a:not([data-cursor]), button:not([data-cursor])') === activeRegularLink &&
        !activeRegularLink.contains(event.relatedTarget)) {
      activeRegularLink = null;
      cursorEl.classList.remove('is-hover-link');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorEl.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorEl.style.opacity = '1';
  });
}
