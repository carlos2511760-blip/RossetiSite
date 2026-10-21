/**
 * Kinetic Marquee Module
 * Supports scroll-velocity acceleration and direction inversion on scroll up/down.
 */
export function initMarquees() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const marqueeElements = document.querySelectorAll('.marquee-block');

  if (marqueeElements.length === 0) return;

  if (prefersReducedMotion) {
    // Keep text visible without animation
    return;
  }

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollDirection = 1; // 1 for down, -1 for up

  // Monitor scroll velocity
  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollDirection = delta >= 0 ? 1 : -1;
      scrollVelocity = Math.min(Math.abs(delta), 50);
      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  marqueeElements.forEach((container) => {
    const track = container.querySelector('.marquee-track');
    if (!track) return;

    // Duplicate track children to guarantee gapless wrap
    const originalContent = track.innerHTML;
    track.innerHTML = originalContent + originalContent + originalContent;

    const baseSpeed = parseFloat(container.getAttribute('data-base-speed')) || 1.2;
    const reverse = container.getAttribute('data-reverse') === 'true';
    let xOffset = 0;

    function animate() {
      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      const dynamicSpeed = baseSpeed + scrollVelocity * 0.18;
      const effectiveDirection = (reverse ? -1 : 1) * scrollDirection;

      xOffset -= dynamicSpeed * effectiveDirection;

      const singleWidth = track.scrollWidth / 3;

      // Wrap-around calculations
      if (xOffset <= -singleWidth) {
        xOffset += singleWidth;
      } else if (xOffset >= 0) {
        xOffset -= singleWidth;
      }

      track.style.transform = `translate3d(${xOffset}px, 0, 0)`;

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
}
