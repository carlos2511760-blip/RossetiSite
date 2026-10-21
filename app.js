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
  var cursor = document.querySelector(".custom-cursor");
  var preloaderCount = document.getElementById("preloader-count");
  var activeFilter = "all";
  var activeRegion = "all";
  var storageKey = "pulso-sp-events-v1";

  window.addEventListener("load", function () {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var seen = sessionStorage.getItem("pulso-preloader-seen");
    var duration = reduced || seen ? 180 : 1500;
    var started = performance.now();
    function count(now) {
      var progress = Math.min(1, (now - started) / duration);
      preloaderCount.textContent = String(Math.round(progress * 100));
      if (progress < 1) window.requestAnimationFrame(count);
      else {
        sessionStorage.setItem("pulso-preloader-seen", "1");
        document.documentElement.classList.add("page-ready");
      }
    }
    window.requestAnimationFrame(count);
  });

  if (window.matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("has-cursor");
    var cursorX = -100;
    var cursorY = -100;
    var drawnX = -100;
    var drawnY = -100;
    document.addEventListener("mousemove", function (event) {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.classList.add("visible");
    });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("visible"); });
    document.querySelectorAll("a, button, [data-cursor], .event-card").forEach(function (target) {
      target.addEventListener("mouseenter", function () {
        cursor.classList.add("active");
        cursor.querySelector("span").textContent = target.dataset.cursor || (target.classList.contains("event-card") ? "VER" : "IR");
      });
      target.addEventListener("mouseleave", function () { cursor.classList.remove("active"); });
    });
    (function drawCursor() {
      drawnX += (cursorX - drawnX) * 0.18;
      drawnY += (cursorY - drawnY) * 0.18;
      cursor.style.transform = "translate3d(" + drawnX + "px," + drawnY + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(drawCursor);
    }());
  }

  var nav = document.getElementById("main-nav");
  var menuLabel = menuButton.querySelector("em");
  var focusBeforeMenu = null;
  var lastScrollY = window.scrollY;
  var marqueeTimer;
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 40);
    var delta = window.scrollY - lastScrollY;
    document.querySelectorAll(".velocity-marquee").forEach(function (marquee) {
      marquee.classList.toggle("reverse", delta < 0);
      marquee.style.setProperty("--marquee-duration", Math.max(8, 23 - Math.abs(delta) * 0.32) + "s");
    });
    window.clearTimeout(marqueeTimer);
    marqueeTimer = window.setTimeout(function () {
      document.querySelectorAll(".velocity-marquee").forEach(function (marquee) { marquee.style.setProperty("--marquee-duration", "23s"); });
    }, 140);
    lastScrollY = window.scrollY;
  }, { passive: true });
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menuLabel.textContent = open ? "Fechar" : "Menu";
    nav.setAttribute("aria-hidden", String(!open));
    nav.inert = !open;
    if (open) {
      focusBeforeMenu = document.activeElement;
      window.setTimeout(function () { nav.querySelector("a").focus(); }, 150);
    } else if (focusBeforeMenu) focusBeforeMenu.focus();
  }
  menuButton.addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  document.querySelectorAll(".desktop-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });
  nav.addEventListener("click", function (event) { if (event.target === nav) setMenu(false); });
  document.addEventListener("keydown", function (event) {
    if (!document.body.classList.contains("menu-open")) return;
    if (event.key === "Escape") { setMenu(false); return; }
    if (event.key !== "Tab") return;
    var focusable = Array.from(nav.querySelectorAll("a"));
    focusable.push(menuButton);
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
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

  var imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold:0.12 });
  document.querySelectorAll(".image-reveal").forEach(function (element) { imageObserver.observe(element); });
  function revealImagesInViewport() {
    document.querySelectorAll(".image-reveal:not(.in-view)").forEach(function (element) {
      var rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) element.classList.add("in-view");
    });
  }
  window.addEventListener("scroll", revealImagesInViewport, { passive:true });
  revealImagesInViewport();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var parallaxItems = document.querySelectorAll("[data-parallax]");
    var parallaxQueued = false;
    function drawParallax() {
      parallaxItems.forEach(function (item) {
        var rect = item.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          var offset = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) * Number(item.dataset.parallax);
          item.style.transform = "translate3d(0," + offset.toFixed(2) + "px,0) scale(1.08)";
        }
      });
      parallaxQueued = false;
    }
    window.addEventListener("scroll", function () {
      if (!parallaxQueued) { parallaxQueued = true; window.requestAnimationFrame(drawParallax); }
    }, { passive:true });
    drawParallax();

    document.querySelectorAll(".round-link").forEach(function (item) {
      item.addEventListener("mousemove", function (event) {
        var rect = item.getBoundingClientRect();
        item.style.transform = "translate(" + ((event.clientX - rect.left - rect.width / 2) * 0.16) + "px," + ((event.clientY - rect.top - rect.height / 2) * 0.16) + "px) rotate(-6deg)";
      });
      item.addEventListener("mouseleave", function () { item.style.transform = ""; });
    });
  }
}());
