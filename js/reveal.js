/**
 * ScrollTrigger Reveals and Parallax Module
 * Handles hero mask reveal, gallery clip-path entries, internal parallax, and hairline animations.
 */
export function initReveals(revealTimeline = null, revealMotion = {}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    // Fallback if GSAP is unavailable
    document.querySelectorAll('.reveal-clip, .hairline-draw, .line-mask-inner').forEach((el) => {
      el.style.opacity = '1';
      el.style.clipPath = 'inset(0)';
      el.style.transform = 'none';
    });
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    // Instantly reveal all elements without motion
    gsap.set('.line-mask-inner, .hairline-draw, .reveal-clip, .hero-cover-img', {
      clearProps: 'all',
      opacity: 1,
      clipPath: 'inset(0)',
    });
    return;
  }

  // 1. Hero Title Mask Reveal
  exportHeroEntrance(revealTimeline, revealMotion);

  // The hero depth reacts to the pointer; scrolling stays native.

  // 3. Hairline Divider Animations (scaleX 0 -> 1)
  const hairlines = document.querySelectorAll('.hairline-draw');
  hairlines.forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 4. Text Line Reveals with Overflow Masks
  const textMasks = document.querySelectorAll('.line-mask-container');
  textMasks.forEach((container) => {
    const inners = container.querySelectorAll('.line-mask-inner');
    gsap.fromTo(
      inners,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 5. Gallery Mockups: clip-path inset(100% 0 0 0) -> inset(0) + scale 1.2 -> 1
  const galleryItems = document.querySelectorAll('.gallery-card');
  galleryItems.forEach((card) => {
    const clipContainer = card.querySelector('.reveal-clip');
    if (clipContainer) {
      gsap.fromTo(
        clipContainer,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

  });

  // 6. Viva a Cidade portal and page transition
  const nextSection = document.querySelector('.next-project-section');
  const transitionCurtain = document.querySelector('.page-transition-curtain');

  if (nextSection) {
    nextSection.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const href = nextSection.getAttribute('href') || 'cidade.html';

      if (!transitionCurtain || !window.gsap) {
        window.location.href = href;
        return;
      }

      gsap.to(transitionCurtain, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        ease: 'expo.inOut',
        onComplete: () => window.location.assign(href),
      });
    });
  }

  // Refresh ScrollTrigger once everything is mounted
  ScrollTrigger.refresh();
}

export function exportHeroEntrance(revealTimeline = null, revealMotion = {}) {
  if (typeof window.gsap === 'undefined') return;
  const { gsap } = window;
  const timeline = revealTimeline || gsap.timeline({ paused: true });
  const duration = revealMotion.duration ?? 0.85;
  const ease = revealMotion.ease ?? 'expo.inOut';

  const heroWords = document.querySelectorAll('.hero-title-word');
  if (heroWords.length > 0) {
    timeline.fromTo(
      heroWords,
      { yPercent: 125, rotate: 2 },
      {
        yPercent: 0,
        rotate: 0,
        duration,
        stagger: 0,
        ease,
      },
      0
    );
  }

  const heroSub = document.querySelector('.hero-meta-strip');
  if (heroSub) {
    timeline.fromTo(
      heroSub,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration, ease },
      0
    );
  }

  if (!revealTimeline) timeline.play(0);
  return timeline;
}
