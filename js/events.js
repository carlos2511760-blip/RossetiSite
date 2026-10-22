const STORAGE_KEY = 'pulso_sp_user_events_v2';
const FREE_PRICE_VALUES = new Set(['gratuito', 'grátis', 'gratis', 'free']);

export function initEvents() {
  const categoryPills = document.querySelectorAll('.filter-pill[data-filter]');
  const pricePills = document.querySelectorAll('.price-pill[data-price-filter]');
  const regionPills = document.querySelectorAll('.region-pill');
  const categoryCards = document.querySelectorAll('.category-card-btn');
  const regionRows = document.querySelectorAll('.region-row-btn[data-region-jump]');
  const resultCounter = document.getElementById('filter-result-count');
  const eventForm = document.getElementById('submit-event-form');
  const toastEl = document.getElementById('pulso-toast');
  const emptyStateEl = document.getElementById('events-empty-state');
  const resetBtn = document.getElementById('btn-reset-empty-filters');
  const eventsSection = document.getElementById('eventos');
  const dialog = document.getElementById('event-detail-dialog');

  let activeCategory = 'all';
  let activePrice = 'all';
  let activeRegion = 'all';

  loadStoredEvents();
  document.querySelectorAll('.event-card-item').forEach(prepareEventCard);

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActivePill(categoryPills, pill);
      activeCategory = pill.dataset.filter || 'all';
      applyFilters();
    });
  });

  pricePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActivePill(pricePills, pill);
      activePrice = pill.dataset.priceFilter || 'all';
      applyFilters();
    });
  });

  regionPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      setActivePill(regionPills, pill);
      activeRegion = pill.dataset.region || 'all';
      applyFilters();
    });
  });

  regionRows.forEach((button) => {
    button.addEventListener('click', () => {
      const region = button.dataset.regionJump;
      document.querySelector(`.region-pill[data-region="${CSS.escape(region)}"]`)?.click();
      eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  categoryCards.forEach((categoryCard) => {
    categoryCard.addEventListener('click', (event) => {
      event.preventDefault();
      const category = categoryCard.dataset.category || 'all';
      activeCategory = category;
      activePrice = 'all';
      activeRegion = 'all';
      setActiveValue(categoryPills, 'data-filter', category);
      setActiveValue(pricePills, 'data-price-filter', 'all');
      setActiveValue(regionPills, 'data-region', 'all');
      applyFilters();
      eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  resetBtn?.addEventListener('click', () => {
    activeCategory = 'all';
    activePrice = 'all';
    activeRegion = 'all';
    setActiveValue(categoryPills, 'data-filter', 'all');
    setActiveValue(pricePills, 'data-price-filter', 'all');
    setActiveValue(regionPills, 'data-region', 'all');
    applyFilters();
  });

  const requestedRegion = new URLSearchParams(window.location.search).get('regiao');
  const validRegions = new Set(['centro', 'norte', 'sul', 'leste', 'oeste']);
  if (validRegions.has(requestedRegion)) {
    activeRegion = requestedRegion;
    setActiveValue(regionPills, 'data-region', activeRegion);
  }

  eventsSection?.addEventListener('click', (event) => {
    const card = event.target.closest('.event-card-item');
    if (!card || event.target.closest('a, button')) return;
    openEventDetails(card);
  });

  eventsSection?.addEventListener('keydown', (event) => {
    const card = event.target.closest('.event-card-item');
    if (!card || event.target !== card || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    openEventDetails(card);
  });

  dialog?.querySelector('[data-close-event-dialog]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Run after loading localStorage and reading ?regiao= so the first count is accurate.
  applyFilters();

  if (eventForm) {
    eventForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = {
        name: document.getElementById('field-event-name'),
        date: document.getElementById('field-event-date'),
        location: document.getElementById('field-event-location'),
        region: document.getElementById('field-event-region'),
        category: document.getElementById('field-event-category'),
        price: document.getElementById('field-event-price'),
        rating: document.getElementById('field-event-rating'),
        image: document.getElementById('field-event-image'),
        description: document.getElementById('field-event-desc')
      };
      const required = [fields.name, fields.date, fields.location, fields.price, fields.description];
      const missing = required.find((field) => !field?.value.trim());
      if (missing) {
        showToast('Preencha os campos obrigatórios antes de salvar.');
        missing?.focus();
        return;
      }

      const newEvent = {
        id: `evt_${Date.now()}`,
        name: fields.name.value.trim(),
        date: fields.date.value.trim(),
        location: fields.location.value.trim(),
        region: fields.region.value,
        category: fields.category.value,
        price: fields.price.value.trim(),
        rating: fields.rating.value,
        description: fields.description.value.trim(),
        image: normalizeImageUrl(fields.image.value.trim()),
        isCustom: true
      };

      if (!saveEventToStorage(newEvent)) {
        showToast('Não foi possível salvar neste navegador.');
        return;
      }

      renderEventCard(newEvent, true);
      showToast(`“${newEvent.name}” foi salvo neste navegador; não foi publicado no site.`);
      eventForm.reset();
      applyFilters();
      eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function setActivePill(pills, activePill) {
    pills.forEach((pill) => {
      const isActive = pill === activePill;
      pill.classList.toggle('is-active', isActive);
      pill.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setActiveValue(elements, attribute, value) {
    elements.forEach((element) => {
      const isActive = element.getAttribute(attribute) === value;
      element.classList.toggle('is-active', isActive);
      element.setAttribute('aria-pressed', String(isActive));
    });
  }

  function isFreePrice(value) {
    const normalized = (value || '').trim().toLowerCase();
    return FREE_PRICE_VALUES.has(normalized);
  }

  function isRegionMatch(cardRegion, region) {
    return region === 'all' || cardRegion === 'all' || cardRegion.toLowerCase() === region.toLowerCase();
  }

  function applyFilters() {
    const cards = document.querySelectorAll('.event-card-item');
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCategory = card.dataset.category || '';
      const cardPrice = card.dataset.price || '';
      const cardRegion = card.dataset.region || '';
      const matchCategory = activeCategory === 'all' || cardCategory.toLowerCase() === activeCategory.toLowerCase();
      const isFree = isFreePrice(cardPrice);
      const matchPrice = activePrice === 'all' ||
        (activePrice === 'gratis' && isFree) ||
        (activePrice === 'pago' && !isFree);
      const matchRegion = isRegionMatch(cardRegion, activeRegion);
      const isVisible = matchCategory && matchPrice && matchRegion;

      card.style.display = isVisible ? '' : 'none';
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    document.querySelectorAll('.gallery-container, .comp-fullwidth').forEach((container) => {
      const cardsInside = container.querySelectorAll('.event-card-item');
      if (cardsInside.length) {
        container.style.display = Array.from(cardsInside).some((card) => card.style.display !== 'none') ? '' : 'none';
      }
    });

    const midMarquee = document.querySelector('.mid-gallery-marquee-wrap');
    if (midMarquee) midMarquee.style.display = visibleCount > 2 ? '' : 'none';
    if (emptyStateEl) emptyStateEl.style.display = visibleCount === 0 ? 'flex' : 'none';

    if (resultCounter) {
      const regionNames = {
        centro: 'no Centro',
        norte: 'na Zona Norte',
        sul: 'na Zona Sul',
        leste: 'na Zona Leste',
        oeste: 'na Zona Oeste'
      };
      const regionText = activeRegion === 'all' ? '' : ` ${regionNames[activeRegion] || activeRegion}`;
      resultCounter.textContent = `${visibleCount} evento${visibleCount === 1 ? '' : 's'} encontrado${visibleCount === 1 ? '' : 's'}${regionText}`;
    }

    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function prepareEventCard(card) {
    const name = card.querySelector('.card-event-title')?.textContent.trim() || 'evento cultural';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Ver detalhes de ${name}`);
    if (!card.dataset.cursor) card.dataset.cursor = 'Ver detalhes';
  }

  function openEventDetails(card) {
    if (!dialog) return;
    const name = card.querySelector('.card-event-title')?.textContent.trim() || 'Evento cultural';
    const image = card.querySelector('img');
    const meta = card.querySelector('.card-event-meta');
    const date = meta?.querySelector('strong')?.textContent.trim() || '';
    const metaText = meta?.textContent.replace(date, '').replace(/^\s*[•·–—-]+\s*/, '').trim() || '';
    const category = card.querySelector('.badge-category')?.textContent.trim() || 'Cultura';
    const price = card.querySelector('.badge-price')?.textContent.trim() || '';
    const region = card.querySelector('.badge-region')?.textContent.trim() || '';
    const description = card.querySelector('.card-event-desc')?.textContent.trim() || 'Consulte a fonte antes de sair.';

    dialog.querySelector('#event-detail-title').textContent = name;
    dialog.querySelector('#event-detail-category').textContent = category;
    dialog.querySelector('#event-detail-date').textContent = date || 'Consulte a programação';
    dialog.querySelector('#event-detail-location').textContent = metaText || region || 'São Paulo';
    dialog.querySelector('#event-detail-price').textContent = price || 'Consulte a fonte';
    dialog.querySelector('#event-detail-description').textContent = description;
    dialog.querySelector('#event-detail-verification-note').hidden = card.classList.contains('verified-event');

    const dialogImage = dialog.querySelector('#event-detail-image');
    if (image && dialogImage) {
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt || `Imagem ilustrativa de ${name}`;
    }

    const imageCredit = dialog.querySelector('#event-detail-image-credit');
    const imageCreditLink = dialog.querySelector('#event-detail-image-credit-link');
    const imageLicenseLink = dialog.querySelector('#event-detail-image-license-link');
    const imageSourceUrl = safeHttpUrl(card.dataset.imageSourceUrl);
    const imageLicenseUrl = safeHttpUrl(card.dataset.imageLicenseUrl);
    imageCredit.hidden = !(card.dataset.imageCredit && imageSourceUrl && imageLicenseUrl);
    if (!imageCredit.hidden) {
      imageCreditLink.href = imageSourceUrl;
      imageCreditLink.textContent = card.dataset.imageCredit;
      imageLicenseLink.href = imageLicenseUrl;
      imageLicenseLink.textContent = card.dataset.imageLicense || 'Licença';
    }

    const mapLink = dialog.querySelector('#event-detail-map');
    const mapQuery = card.dataset.mapQuery || `${name} ${metaText} São Paulo`;
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    const primarySource = dialog.querySelector('#event-detail-source');
    const sourceUrl = safeHttpUrl(card.dataset.sourceUrl);
    if (sourceUrl) {
      primarySource.href = sourceUrl;
      primarySource.textContent = card.dataset.sourceLabel || 'Fonte do evento';
    } else {
      primarySource.href = `https://www.google.com/search?q=${encodeURIComponent(`${name} ${metaText} São Paulo evento`)}`;
      primarySource.textContent = 'Pesquisar este evento';
    }

    const secondarySource = dialog.querySelector('#event-detail-source-secondary');
    const secondaryUrl = safeHttpUrl(card.dataset.secondarySourceUrl);
    secondarySource.hidden = !secondaryUrl;
    if (secondaryUrl) {
      secondarySource.href = secondaryUrl;
      secondarySource.textContent = card.dataset.secondarySourceLabel || 'Informações adicionais';
    }

    if (!dialog.open) dialog.showModal();
  }

  function loadStoredEvents() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(stored)) stored.forEach((item) => renderEventCard(item, false));
    } catch (error) {
      console.warn('Não foi possível ler os eventos salvos neste navegador:', error);
    }
  }

  function saveEventToStorage(eventObject) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const events = Array.isArray(stored) ? stored : [];
      events.unshift(eventObject);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (error) {
      console.warn('Não foi possível salvar no localStorage:', error);
      return false;
    }
  }

  function renderEventCard(data, prepend = true) {
    const container = document.querySelector('.comp-triple-phones') || eventsSection;
    if (!container) return;

    const article = document.createElement('article');
    const normalizedPrice = isFreePrice(data.price) ? 'gratuito' : 'pago';
    const imageUrl = normalizeImageUrl(data.image);
    article.className = 'gallery-card phone-card phone-card-1 event-card-item is-community-event';
    article.dataset.category = data.category;
    article.dataset.price = normalizedPrice;
    article.dataset.region = data.region;
    article.dataset.mapQuery = data.location;
    article.dataset.cursor = 'Ver detalhes';

    article.innerHTML = `
      <div class="reveal-clip">
        <img class="parallax-img" src="${escapeHtml(imageUrl)}" alt="Imagem ilustrativa enviada junto à sugestão de ${escapeHtml(data.name)}" loading="lazy" decoding="async">
      </div>
      <div class="card-event-badge-strip">
        <span class="badge-tag badge-category">${escapeHtml(data.category)}</span>
        <span class="badge-tag badge-price ${normalizedPrice === 'gratuito' ? 'is-free' : ''}">${escapeHtml(data.price)}</span>
        <span class="badge-tag badge-region">${escapeHtml(regionLabel(data.region))}</span>
      </div>
      <div class="card-event-info">
        <h3 class="card-event-title">${escapeHtml(data.name)}</h3>
        <p class="card-event-meta"><strong>${escapeHtml(data.date)}</strong> &bull; ${escapeHtml(data.location)} &bull; Classificação: ${escapeHtml(data.rating)}</p>
        <p class="card-event-desc">${escapeHtml(data.description)}</p>
      </div>
    `;

    prepareEventCard(article);
    if (prepend && container.firstChild) container.insertBefore(article, container.firstChild);
    else container.appendChild(article);
  }

  function regionLabel(region) {
    const labels = { centro: 'Centro', norte: 'Zona Norte', sul: 'Zona Sul', leste: 'Zona Leste', oeste: 'Zona Oeste' };
    return labels[region] || region;
  }

  function normalizeImageUrl(value) {
    if (!value) return 'assets/pulso/festival-sp.webp';
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : 'assets/pulso/festival-sp.webp';
    } catch {
      return 'assets/pulso/festival-sp.webp';
    }
  }

  function safeHttpUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function showToast(message) {
    if (!toastEl) return;
    const text = toastEl.querySelector('.toast-text');
    if (text) text.textContent = message;
    toastEl.classList.add('is-visible');
    window.setTimeout(() => toastEl.classList.remove('is-visible'), 4500);
  }
}
