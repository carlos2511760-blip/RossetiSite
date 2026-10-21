/**
 * Pulso SP — Events Engine & Interactive Filters Module
 * Handles category filtering, price filtering (Gratuito), region filtering,
 * and user event submission with localStorage persistence.
 */

const STORAGE_KEY = 'pulso_sp_user_events_v2';

export function initEvents() {
  const eventsGrid = document.getElementById('events-gallery-grid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const regionPills = document.querySelectorAll('.region-pill');
  const categoryCards = document.querySelectorAll('.category-card-btn');
  const resultCounter = document.getElementById('filter-result-count');
  const eventForm = document.getElementById('submit-event-form');
  const toastEl = document.getElementById('pulso-toast');

  let activeCategory = 'all';
  let activePrice = 'all';
  let activeRegion = 'all';

  // 1. Load custom events from localStorage
  loadStoredEvents();

  // 2. Bind filter pills
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const filterType = pill.getAttribute('data-filter');
      if (filterType === 'gratis') {
        activePrice = 'gratis';
        activeCategory = 'all';
      } else {
        activePrice = 'all';
        activeCategory = filterType || 'all';
      }

      applyFilters();
    });
  });

  // 3. Bind region selector buttons
  regionPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      regionPills.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      activeRegion = btn.getAttribute('data-region') || 'all';
      applyFilters();
    });
  });

  // 4. Bind Category section cards
  categoryCards.forEach((catCard) => {
    catCard.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = catCard.getAttribute('data-category');

      // Update filter pills active state
      filterPills.forEach((p) => {
        if (p.getAttribute('data-filter') === cat) {
          p.classList.add('is-active');
        } else {
          p.classList.remove('is-active');
        }
      });

      activeCategory = cat;
      activePrice = 'all';
      applyFilters();

      // Smooth scroll to events section
      const eventsSection = document.getElementById('eventos');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. Filter algorithm
  function applyFilters() {
    const cards = document.querySelectorAll('.event-card-item');
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardPrice = card.getAttribute('data-price') || '';
      const cardRegion = card.getAttribute('data-region') || '';

      const matchCategory =
        activeCategory === 'all' ||
        cardCategory.toLowerCase() === activeCategory.toLowerCase();

      const matchPrice =
        activePrice === 'all' ||
        (activePrice === 'gratis' && (cardPrice.toLowerCase() === 'gratuito' || cardPrice.toLowerCase() === 'gratis'));

      const matchRegion =
        activeRegion === 'all' ||
        cardRegion.toLowerCase() === activeRegion.toLowerCase();

      if (matchCategory && matchPrice && matchRegion) {
        card.style.display = '';
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('is-hidden');
      }
    });

    if (resultCounter) {
      resultCounter.textContent = `${visibleCount} evento${visibleCount === 1 ? '' : 's'} encontrado${visibleCount === 1 ? '' : 's'}`;
    }

    // Refresh ScrollTrigger to adjust image parallax offsets
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  // 6. Handle Form Submission
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('field-event-name').value.trim();
      const date = document.getElementById('field-event-date').value.trim();
      const location = document.getElementById('field-event-location').value.trim();
      const region = document.getElementById('field-event-region').value;
      const category = document.getElementById('field-event-category').value;
      const price = document.getElementById('field-event-price').value.trim();
      const rating = document.getElementById('field-event-rating').value;
      const description = document.getElementById('field-event-desc').value.trim();
      const image = document.getElementById('field-event-image').value.trim() ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';

      if (!name || !date || !location) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
      }

      const newEvent = {
        id: 'evt_' + Date.now(),
        name,
        date,
        location,
        region,
        category,
        price,
        rating,
        description,
        image,
        isCustom: true
      };

      // Save to localStorage
      saveEventToStorage(newEvent);

      // Render into DOM
      renderEventCard(newEvent, true);

      // Show toast
      showToast(`"${name}" foi publicado com sucesso!`);

      // Reset form
      eventForm.reset();

      // Recalculate and scroll to events
      applyFilters();
      const eventsSection = document.getElementById('eventos');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function saveEventToStorage(eventObj) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.unshift(eventObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (err) {
      console.warn('Não foi possível salvar no localStorage:', err);
    }
  }

  function loadStoredEvents() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.forEach((item) => {
        renderEventCard(item, false);
      });
    } catch (err) {
      console.warn('Erro ao carregar do localStorage:', err);
    }
  }

  function renderEventCard(data, prepend = true) {
    const container = document.getElementById('events-gallery-grid');
    if (!container) return;

    const article = document.createElement('article');
    article.className = 'gallery-card card-tablet event-card-item is-community-event';
    article.setAttribute('data-category', data.category);
    article.setAttribute('data-price', data.price.toLowerCase().includes('gratu') || data.price.toLowerCase().includes('grátis') ? 'gratuito' : 'pago');
    article.setAttribute('data-region', data.region);
    article.setAttribute('data-cursor', 'Ver Evento');

    article.innerHTML = `
      <div class="reveal-clip">
        <img
          class="parallax-img"
          src="${data.image}"
          alt="${data.name}"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="card-event-badge-strip">
        <span class="badge-tag badge-category">${data.category}</span>
        <span class="badge-tag badge-price ${data.price.toLowerCase().includes('gratu') ? 'is-free' : ''}">${data.price}</span>
        <span class="badge-tag badge-region">${data.region.toUpperCase()}</span>
      </div>
      <div class="card-event-info">
        <h3 class="card-event-title">${data.name}</h3>
        <p class="card-event-meta">
          <strong>${data.date}</strong> &bull; ${data.location} (${data.rating})
        </p>
        <p class="card-event-desc">${data.description}</p>
      </div>
    `;

    if (prepend && container.firstChild) {
      container.insertBefore(article, container.firstChild);
    } else {
      container.appendChild(article);
    }
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.querySelector('.toast-text').textContent = message;
    toastEl.classList.add('is-visible');

    setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 4000);
  }
}
