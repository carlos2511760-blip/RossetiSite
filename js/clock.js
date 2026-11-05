/**
 * Live São Paulo Clock & Pulse Status
 */
export function initClock() {
  const clockEl = document.getElementById('sp-live-clock');
  if (!clockEl) return;

  function update() {
    try {
      const now = new Date();
      const spTime = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      clockEl.textContent = `SP ${spTime}`;
    } catch {
      const now = new Date();
      clockEl.textContent = `SP ${now.toLocaleTimeString('pt-BR')}`;
    }
  }

  update();
  setInterval(update, 1000);
}
