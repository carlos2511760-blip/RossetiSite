/**
 * Cinematic Image Effects — Pulso SP
 * Parallax, magnetic tilt, clip-path reveals, and grain overlay.
 */
export function initImageEffects() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── 1. Parallax on scroll for all .parallax-img ──
  const parallaxImages = document.querySelectorAll('.parallax-img');
  let ticking = false;

  function updateParallax() {
    ticking = false;
    const viewH = window.innerHeight;
    parallaxImages.forEach(img => {
      const container = img.closest('.reveal-clip') || img.parentElement;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewH + 100) return;
      const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
      const shift = progress * -40; // ±40px movement
      img.style.transform = `translateY(${shift}px) scale(1.12)`;
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
  }, { passive: true });
  updateParallax();

  // ── 2. Magnetic Tilt 3D on event cards ──
  const isDesktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop) {
    const cards = document.querySelectorAll('.event-card-item');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * -8;  // ±4 degrees
        const tiltY = (x - 0.5) * 8;
        const lightX = x * 100;
        const lightY = y * 100;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.02)`;
        card.style.setProperty('--light-x', `${lightX}%`);
        card.style.setProperty('--light-y', `${lightY}%`);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });

    // ── 3. Category preview image with tilt ──
    const catBtns = document.querySelectorAll('.category-card-btn[data-category]');
    catBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        btn.style.setProperty('--cat-light', `${x * 100}%`);
      }, { passive: true });
    });
  }

  // ── 4. Intersection Observer clip-path stagger reveals ──
  const revealTargets = document.querySelectorAll('.event-card-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.imageRevealed) return;
        el.dataset.imageRevealed = '1';

        const img = el.querySelector('.reveal-clip');
        if (img) {
          img.classList.add('img-reveal-active');
        }
        el.classList.add('card-reveal-active');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(t => revealObserver.observe(t));

  // ── 5. Hero cover cinematic zoom on scroll ──
  const heroCover = document.querySelector('.hero-cover-img');
  if (heroCover) {
    let heroTicking = false;
    window.addEventListener('scroll', () => {
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(() => {
        heroTicking = false;
        const scrolled = Math.min(1, window.scrollY / (window.innerHeight * 1.2));
        const scale = 1.035 + scrolled * 0.12;
        const blur = scrolled * 2;
        heroCover.style.transform = `scale(${scale})`;
        heroCover.style.filter = `saturate(${0.75 + scrolled * 0.5}) contrast(${1.13 - scrolled * 0.1}) blur(${blur}px)`;
      });
    }, { passive: true });
  }

  // ── 6. Featured section Ken Burns ──
  const featuredBg = document.querySelector('.featured-week-bg');
  if (featuredBg) {
    featuredBg.classList.add('ken-burns-active');
  }

  // ── 7. Grain overlay for editorial atmosphere ──
  const grain = document.createElement('div');
  grain.className = 'film-grain-overlay';
  grain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(grain);
}
