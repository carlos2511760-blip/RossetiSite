/** Reveal content immediately so the first interaction never waits for a counter. */
export function initPreloader(onRevealStart) {
  const preloader = document.querySelector('.preloader-curtain');
  if (preloader) preloader.style.display = 'none';
  if (onRevealStart) onRevealStart();
}
