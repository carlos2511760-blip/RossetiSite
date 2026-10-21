(function () {
  "use strict";
  var header = document.getElementById("site-header");
  var menuButton = document.querySelector(".menu-button");
  var filterButtons = document.querySelectorAll(".filter-button");
  var regionButtons = document.querySelectorAll(".region-button");
  var eventsGrid = document.getElementById("events-grid");
  var resultCount = document.getElementById("result-count");
  var emptyState = document.getElementById("empty-state");
  var form = document.getElementById("event-form");
  var toast = document.getElementById("toast");
  var activeFilter = "all";
  var activeRegion = "all";
  var storageKey = "pulso-sp-events-v1";

  window.addEventListener("scroll", function () { header.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  menuButton.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Fechar" : "Menu";
  });
  document.querySelectorAll(".desktop-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    });
  });

  function categoryMatches(category, filter) {
    if (filter === "all") return true;
    if (filter === "arte") return ["teatro", "exposicoes", "cultura"].indexOf(category) !== -1;
    return category === filter;
  }
  function applyFilters() {
    var visible = 0;
    document.querySelectorAll(".event-card").forEach(function (card) {
      var categoryOk = activeFilter === "free" ? card.dataset.price === "free" : categoryMatches(card.dataset.category, activeFilter);
      var regionOk = activeRegion === "all" || card.dataset.region === activeRegion;
      var show = categoryOk && regionOk;
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    resultCount.textContent = visible + (visible === 1 ? " evento encontrado" : " eventos encontrados");
    emptyState.classList.toggle("visible", visible === 0);
  }
  function setFilter(filter) {
    activeFilter = filter;
    var hasButton = Boolean(document.querySelector('.filter-button[data-filter="' + filter + '"]'));
    filterButtons.forEach(function (button) {
      var active = button.dataset.filter === filter || (!hasButton && button.dataset.filter === "all");
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    applyFilters();
  }
  filterButtons.forEach(function (button) { button.addEventListener("click", function () { setFilter(button.dataset.filter); }); });
  regionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeRegion = button.dataset.region;
      regionButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
      document.getElementById("eventos").scrollIntoView({ behavior: "smooth" });
    });
  });
  document.querySelectorAll(".category-button").forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.dataset.categoryTarget);
      document.getElementById("eventos").scrollIntoView({ behavior: "smooth" });
    });
  });

  function escapeHtml(value) {
    var span = document.createElement("span");
    span.textContent = value || "";
    return span.innerHTML;
  }
  function categoryLabel(value) { return ({ musica:"Música",cinema:"Cinema",teatro:"Teatro",exposicoes:"Exposição",cultura:"Cultura urbana",tecnologia:"Tecnologia",games:"Games" })[value] || value; }
  function regionLabel(value) { return ({ centro:"Centro",norte:"Zona Norte",sul:"Zona Sul",leste:"Zona Leste",oeste:"Zona Oeste" })[value] || value; }
  function createSavedCard(data) {
    var date = new Date(data.date + "T12:00:00");
    var day = String(date.getDate()).padStart(2, "0");
    var month = date.toLocaleDateString("pt-BR", { month:"short" }).replace(".", "").toUpperCase();
    var free = !data.price || /gr[aá]tis|^0$/i.test(data.price.trim());
    var article = document.createElement("article");
    article.className = "event-card reveal visible";
    article.dataset.category = data.category;
    article.dataset.price = free ? "free" : "paid";
    article.dataset.region = data.region;
    article.innerHTML = '<div class="event-image-wrap saved-cover"><span>SP</span><time class="event-date" datetime="' + escapeHtml(data.date) + '"><strong>' + day + '</strong><small>' + month + '</small></time><span class="event-badge">' + escapeHtml(data.price || "Grátis") + '</span></div><div class="event-info"><div class="event-meta"><span>' + escapeHtml(categoryLabel(data.category)) + ' / Comunidade</span><span>' + escapeHtml(data.rating || "Livre") + '</span></div><h3 class="event-title">' + escapeHtml(data.name) + '</h3><div class="event-details"><span>' + escapeHtml(data.location) + '</span><span>' + escapeHtml(regionLabel(data.region)) + '</span><span>' + escapeHtml(data.time) + '</span></div></div>';
    eventsGrid.insertBefore(article, emptyState);
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(function () { toast.classList.remove("show"); }, 3000);
  }
  try {
    var storedEvents = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(storedEvents)) storedEvents.forEach(createSavedCard);
  } catch (error) { localStorage.removeItem(storageKey); }
  applyFilters();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) saved = [];
      saved.push(data);
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch (error) { showToast("Não foi possível salvar neste navegador."); return; }
    createSavedCard(data);
    form.reset();
    activeFilter = activeRegion = "all";
    filterButtons.forEach(function (item, index) { item.classList.toggle("active", index === 0); item.setAttribute("aria-pressed", String(index === 0)); });
    regionButtons.forEach(function (item, index) { item.classList.toggle("active", index === 0); item.setAttribute("aria-pressed", String(index === 0)); });
    applyFilters();
    showToast("Evento adicionado à agenda.");
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold:.08 });
  document.querySelectorAll(".reveal").forEach(function (element) { observer.observe(element); });
}());
