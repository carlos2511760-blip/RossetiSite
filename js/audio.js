/**
 * Tactical Sound Design Module — Pulso SP
 * Uses Web Audio API synthesis for zero-latency, asset-free tactile audio feedback.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch {
      // AudioContext not supported or restricted
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.ensureContext();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playTone(880, 0.05, 'sine', 0.06);
      setTimeout(() => this.playTone(1320, 0.06, 'sine', 0.08), 60);
    }
    return this.enabled;
  }

  playTone(freq, duration = 0.04, type = 'sine', volume = 0.04) {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback failed silently
    }
  }

  playHover() {
    // Subtle, high-frequency micro-click
    this.playTone(1600, 0.025, 'triangle', 0.018);
  }

  playClick() {
    // Satisfying mechanical shutter/snap
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(t + 0.045);
    } catch {
      // Ignore
    }
  }

  playTransition() {
    // Soft acoustic whoosh for filters and dialogs
    this.playTone(420, 0.08, 'sine', 0.04);
  }
}

export const sound = new SoundEngine();

export function initAudio() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundLabel = soundBtn?.querySelector('.sound-label');

  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isNowEnabled = sound.toggle();
      soundBtn.classList.toggle('is-active', isNowEnabled);
      soundBtn.setAttribute('aria-pressed', String(isNowEnabled));
      if (soundLabel) {
        soundLabel.textContent = isNowEnabled ? 'SOM: ON' : 'SOM: OFF';
      }
    });
  }

  // Bind subtle tactile sounds to key interactive elements
  const interactiveSelectors = [
    'button',
    'a',
    '.filter-pill',
    '.region-pill',
    '.category-card-btn',
    '.region-row-btn',
    '.event-card-item'
  ];

  document.addEventListener('pointerenter', (event) => {
    if (!sound.enabled) return;
    const target = event.target.closest(interactiveSelectors.join(','));
    if (target && target !== soundBtn) {
      sound.playHover();
    }
  }, { capture: true, passive: true });

  document.addEventListener('click', (event) => {
    if (!sound.enabled) return;
    const target = event.target.closest(interactiveSelectors.join(','));
    if (target && target !== soundBtn) {
      sound.playClick();
    }
  }, { capture: true, passive: true });
}
