/**
 * KIDDO — PukyWardrobeManager
 * Vestidor interactivo: 4 categorías en pestañas, selección exclusiva, persistencia localStorage.
 * Barra compacta horizontal desplegable en zona media-baja.
 * Sistema de capas preparado para PNG futuros.
 */
(function () {
  "use strict";

  // ── CATÁLOGO ─────────────────────────────────────────────────────────────
  var CATALOG = {
    ropa: [
      { id:"ropa-ninguna",              name:"Ninguna",           icon:"✕",  layer:40, imagePath:null,                                                                 scale:1.0,  offsetX:0, offsetY:0,   enabled:true, isPlaceholder:false },
      { id:"ropa-remera-futbol",        name:"Remera fútbol",     icon:"⚽",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/remera-futbol.png.png",                  scale:0.42, offsetX:0, offsetY:40,  enabled:true, isPlaceholder:false },
      { id:"ropa-remera-nubes",         name:"Remera nubes",      icon:"☁️",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/remera-nubes.png.png",                   scale:0.42, offsetX:0, offsetY:40,  enabled:true, isPlaceholder:false },
      { id:"ropa-remera-aventura",      name:"Remera aventura",   icon:"🧭",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/remera-aventura.png.png",                scale:0.53, offsetX:0, offsetY:30,  enabled:true, isPlaceholder:false },
      { id:"ropa-buzo-negro-koala",     name:"Buzo koala",        icon:"🐨",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/buzo-negro-koala.png.png",               scale:0.465, offsetX:0, offsetY:42,  enabled:true, isPlaceholder:false },
      { id:"ropa-campera-azul",         name:"Campera azul",      icon:"🧥",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/campera-azul.png.png",                   scale:0.465, offsetX:0, offsetY:39,  enabled:true, isPlaceholder:false },
      { id:"ropa-chaleco-verde",        name:"Chaleco verde",     icon:"🦺",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/chaleco-verde.png.png",                  scale:0.4, offsetX:0, offsetY:40,  enabled:true, isPlaceholder:false },
      { id:"ropa-sueter-azul",          name:"Suéter azul",       icon:"🧶",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/sueter-azul.png.png",                    scale:0.5, offsetX:0, offsetY:38,  enabled:true, isPlaceholder:false },
      { id:"ropa-saco-playa",           name:"Saco de playa",     icon:"🏖️",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/saco-playa.png.png",                     scale:0.4, offsetX:0, offsetY:44,  enabled:true, isPlaceholder:false },
      { id:"ropa-pintor",               name:"Pintor",            icon:"🎨",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/pintor.png.png",                         scale:0.42, offsetX:0, offsetY:48,  enabled:true, isPlaceholder:false },
      { id:"ropa-impermeable-amarillo", name:"Impermeable",       icon:"🌧️",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/impermeable-amarillo.png.png",           scale:0.8, offsetX:0, offsetY:-10,  enabled:true, isPlaceholder:false },
      { id:"ropa-traje-superheroe",     name:"Traje superhéroe",  icon:"🦸",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/traje-superheroe.png.png",               scale:0.56, offsetX:0, offsetY:50,  enabled:true, isPlaceholder:false },
      { id:"ropa-traje-dinosaurio",     name:"Traje dinosaurio",  icon:"🦕",  layer:40, imagePath:"assets/Puky-vestimenta/ropa/traje-dinosaurio.png.png",               scale:0.85, offsetX:0, offsetY:6,  enabled:true, isPlaceholder:false }
    ],
    pantalones: [
      { id:"pant-ninguno",              name:"Ninguno",           icon:"✕",  layer:30, imagePath:null,                                                                 scale:1.0,  offsetX:0, offsetY:0,   enabled:true, isPlaceholder:false },
      { id:"pant-short-jean",           name:"Short de jean",     icon:"👖",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-jean.png.png",               scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-short-jean-marron",    name:"Short jean marrón", icon:"🪵",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-jean-marron.png.png",        scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-short-marron-claro",   name:"Short marrón claro",icon:"🟫",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-marron-claro.png.png",     scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-short-marron",         name:"Short marrón",      icon:"🤎",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-marron.png.png",             scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-short-azul-oscuro",    name:"Short azul oscuro", icon:"🫐",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-azul-oscuro.png.png",        scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-short-deportivo",      name:"Short deportivo",   icon:"⚽",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/short-deportivo.png.png",          scale:0.42, scaleX:0.75, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-jean-verde",           name:"Jean verde",        icon:"💚",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/jean-verde.png.png",               scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false },
      { id:"pant-pantalon-nubes",       name:"Pantalón nubes",    icon:"☁️",  layer:30, imagePath:"assets/Puky-vestimenta/pantalones/pantalon-nubes.png.png",          scale:0.42, scaleX:0.78, offsetX:0, offsetY:72, enabled:true, isPlaceholder:false }
    ],
    zapatillas: [
      { id:"zap-ninguna",               name:"Ninguno",           icon:"✕",  layer:20, imagePath:null,                                                                 scale:1.0,  offsetX:0, offsetY:0,   enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-azules",     name:"Zapatillas azules", icon:"👟",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas azules.png.png",        scale:0.38, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-rojas",      name:"Zapatillas rojas",  icon:"❤️",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas-rojas.png.png",         scale:0.38, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-rojas-blancas", name:"Rojas y blancas",icon:"🤍",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas-rojas-blancas.png.png", scale:0.38, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-verdes",     name:"Zapatillas verdes", icon:"💚",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas-verdes.png.png",        scale:0.38, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-negras",     name:"Zapatillas negras", icon:"🖤",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas-negras.png.png",        scale:0.38, offsetX:0, offsetY:100, enabled:true, isPlaceholder:false },
      { id:"zap-zapatillas-marrones",   name:"Zapatillas marrón", icon:"🪵",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/zapatillas-marrones.png.png",      scale:0.40, offsetX:0, offsetY:95, enabled:true, isPlaceholder:false },
      { id:"zap-botas-azules",          name:"Botas azules",      icon:"💙",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/botas-azules.png.png",             scale:0.38, offsetX:0, offsetY:90, enabled:true, isPlaceholder:false },
      { id:"zap-botas-amarillas",       name:"Botas amarillas",   icon:"💛",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/botas-amarillas.png.png",          scale:0.40, offsetX:0, offsetY:96, enabled:true, isPlaceholder:false },
      { id:"zap-botas-marrones",        name:"Botas marrones",    icon:"🥾",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/botas-marrones.png.png",           scale:0.34, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false },
      { id:"zap-sandalias-azules",      name:"Sandalias azules",  icon:"👡",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/sandalias-azules.png.png",         scale:0.30, offsetX:0, offsetY:100, enabled:true, isPlaceholder:false },
      { id:"zap-pantuflas-koala",       name:"Pantuflas koala",   icon:"🐨",  layer:20, imagePath:"assets/Puky-vestimenta/zapatillas/pantuflas-koala.png.png",          scale:0.35, offsetX:0, offsetY:92, enabled:true, isPlaceholder:false }
    ],
    accesorios: [
      { id:"acc-ninguno",               name:"Ninguno",           icon:"✕",  layer:50, imagePath:null,                                                                 scale:1.0,  offsetX:0, offsetY:0,    enabled:true, isPlaceholder:false },
      { id:"acc-boina-roja",            name:"Boina roja",        icon:"🎩",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/boina-roja.png.png",     scale:0.50, offsetX:-10, offsetY:-85, enabled:true, isPlaceholder:false },
      { id:"acc-gorra-negra-blanca",    name:"Gorra negra",       icon:"🧢",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/gorra-negra-blanca.png.png", scale:0.55, offsetX:8, offsetY:-70, enabled:true, isPlaceholder:false },
      { id:"acc-gorra-verde",           name:"Gorra verde",       icon:"💚",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/gorra-verde.png.png",    scale:0.50, offsetX:6, offsetY:-84, enabled:true, isPlaceholder:false },
      { id:"acc-gorro-azul",            name:"Gorro azul",        icon:"💙",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/gorro-azul.png.png",     scale:0.51, offsetX:7, offsetY:-100, enabled:true, isPlaceholder:false },
      { id:"acc-gorro-blanco",          name:"Gorro blanco",      icon:"⬜",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/gorro-blanco.png.png",   scale:0.50, offsetX:2.5, offsetY:-90, enabled:true, isPlaceholder:false },
      { id:"acc-gorro-nubes",           name:"Gorro nubes",       icon:"😴",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/gorro-nubes.png.png",    scale:0.60, offsetX:23, offsetY:-68, enabled:true, isPlaceholder:false },
      { id:"acc-sombrero-playa",        name:"Sombrero playa",    icon:"🏖️",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/sombrero-playa.png.png", scale:0.625, offsetX:5, offsetY:-68, enabled:true, isPlaceholder:false },
      { id:"acc-sombrero-aventura",     name:"Sombrero aventura", icon:"🤠",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/sombrero-aventura.png.png", scale:0.62, offsetX:2.75, offsetY:-75, enabled:true, isPlaceholder:false },
      { id:"acc-bufanda-blanca-azul",   name:"Bufanda azul",      icon:"🧣",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/bufanda-blanca-azul.png.png", scale:0.38, offsetX:2, offsetY:25,   enabled:true, isPlaceholder:false },
      { id:"acc-bufanda-blanca",        name:"Bufanda blanca",    icon:"🤍",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/bufanda-blanca.png.png", scale:0.35, offsetX:0, offsetY:25,   enabled:true, isPlaceholder:false },
      { id:"acc-capa-roja",             name:"Capa roja",         icon:"🦸",  layer:50, imagePath:"assets/Puky-vestimenta/categoria.accesorios/capa-roja.png.png",      scale:0.70, offsetX:0, offsetY:58,   enabled:true, isPlaceholder:false }
    ]
  };

  var LABELS = {
    ropa:       { label:"Ropa",       icon:"👕" },
    pantalones: { label:"Pantalones", icon:"👖" },
    zapatillas: { label:"Zapatillas", icon:"👟" },
    accesorios: { label:"Accesorios", icon:"🧢" }
  };

  var NONE_IDS = {
    ropa:"ropa-ninguna", pantalones:"pant-ninguno",
    zapatillas:"zap-ninguna", accesorios:"acc-ninguno"
  };

  // Mapa de migración de IDs antiguos de localStorage hacia los nuevos IDs del vestidor
  var MIGRATION_MAP = {
    "ropa-remera-de-futbol": "ropa-remera-futbol",
    "ropa-remera-de-pijama": "ropa-remera-nubes",
    "ropa-buzo-koala": "ropa-buzo-negro-koala",
    "ropa-camisa-marron": "ropa-remera-aventura",
    "ropa-pintor-azul": "ropa-pintor",
    "ropa-saco-de-playa": "ropa-saco-playa",
    "ropa-sueter-azul": "ropa-sueter-azul",
    "ropa-dino": "ropa-traje-dinosaurio",
    "ropa-superheroe": "ropa-traje-superheroe",
    "ropa-impermeable": "ropa-impermeable-amarillo",
    "pant-marron": "pant-short-jean-marron",
    "pant-pijama": "pant-pantalon-nubes",
    "pant-short-azul": "pant-short-jean",
    "pant-short-celeste": "pant-short-deportivo",
    "pant-short-verde": "pant-jean-verde",
    "pant-short-marron": "pant-short-marron",
    "pant-short-azul-osc": "pant-short-azul-oscuro",
    "zap-azules": "zap-zapatillas-azules",
    "zap-rojas": "zap-zapatillas-rojas",
    "zap-marrones": "zap-zapatillas-marrones",
    "zap-negras": "zap-zapatillas-negras",
    "zap-pantuflas-koala": "zap-pantuflas-koala",
    "zap-sandalias": "zap-sandalias-azules",
    "acc-gorra-negra": "acc-gorra-negra-blanca",
    "acc-bufanda-azul": "acc-bufanda-blanca-azul",
    "acc-gorro-dormir": "acc-gorro-nubes",
    "acc-sombrero-playa": "acc-sombrero-playa",
    "acc-sombrero-marron": "acc-sombrero-aventura"
  };

  // ── PERSISTENCIA ─────────────────────────────────────────────────────────
  var STORAGE_KEY = "kiddo_wardrobe_v1";

  function storageKey() {
    var pid = "";
    try {
      if (window.kiddoApp && window.kiddoApp.activeProfileId) pid = "_" + window.kiddoApp.activeProfileId;
      else { var r = localStorage.getItem("kiddo_active_profile"); if (r) pid = "_" + r; }
    } catch(e) {}
    return STORAGE_KEY + pid;
  }

  function loadState() {
    try { var r = localStorage.getItem(storageKey()); if (r) return JSON.parse(r); } catch(e) {}
    return { ropa:NONE_IDS.ropa, pantalones:NONE_IDS.pantalones, zapatillas:NONE_IDS.zapatillas, accesorios:NONE_IDS.accesorios };
  }

  function saveState(s) {
    try { localStorage.setItem(storageKey(), JSON.stringify(s)); } catch(e) {}
  }

  // ── MANAGER ──────────────────────────────────────────────────────────────
  function WardrobeManager() {
    this.state = loadState();
    this.activeCategory = "ropa";
    this._validate();
  }

  WardrobeManager.prototype._validate = function() {
    var self = this;
    Object.keys(NONE_IDS).forEach(function(cat) {
      if (self.state[cat] && MIGRATION_MAP[self.state[cat]]) {
        self.state[cat] = MIGRATION_MAP[self.state[cat]];
      }
      if (!self._find(cat, self.state[cat])) self.state[cat] = NONE_IDS[cat];
    });
  };

  WardrobeManager.prototype._find = function(cat, id) {
    var list = CATALOG[cat] || [];
    for (var i=0;i<list.length;i++) if (list[i].id===id && list[i].enabled) return list[i];
    return null;
  };

  WardrobeManager.prototype.switchCategory = function(cat) {
    if (!CATALOG[cat]) return;
    this.activeCategory = cat;
    this.renderWardrobe();
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  };

  WardrobeManager.prototype.select = function(cat, id) {
    if (!CATALOG[cat]) return;
    var item = this._find(cat, id);
    if (!item) return;
    this.state[cat] = id;
    saveState(this.state);
    this._updateLayer(cat, item);
    this.renderWardrobe();
    if (id !== NONE_IDS[cat]) {
      if (window.puky2D) window.puky2D.showHappy(1500);
    }
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  };

  WardrobeManager.prototype._updateLayer = function(cat, item) {
    var el = document.getElementById("puky-layer-" + cat);
    if (!el) return;
    if (!item || !item.imagePath || item.id === NONE_IDS[cat]) {
      el.style.opacity = "0";
      el.style.backgroundImage = "none";
      el.setAttribute("data-active", "false");
      return;
    }

    var scale = (typeof item.scale === "number") ? item.scale : 1;
    var ox = (typeof item.offsetX === "number") ? item.offsetX + "px" : (item.offsetX || "0px");
    var oy = (typeof item.offsetY === "number") ? item.offsetY + "px" : (item.offsetY || "0px");
    var sx = (typeof item.scaleX === "number") ? " scaleX(" + item.scaleX + ")" : "";

    el.style.transformOrigin = "center center";
    el.style.transform = "translate(" + ox + ", " + oy + ") scale(" + scale + ")" + sx;

    var img = new Image();
    img.onload = function() {
      el.style.backgroundImage = 'url("' + item.imagePath + '")';
      el.style.opacity = "1";
      el.setAttribute("data-active", "true");
    };
    img.onerror = function() {
      el.style.opacity = "0";
      el.setAttribute("data-active", "false");
    };
    img.src = item.imagePath;
  };

  WardrobeManager.prototype.mountLayers = function(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    var zMap = { zapatillas: 20, pantalones: 30, ropa: 40, accesorios: 50 };
    ["zapatillas", "pantalones", "ropa", "accesorios"].forEach(function(cat) {
      var d = document.getElementById("puky-layer-" + cat);
      if (!d) {
        d = document.createElement("div");
        d.id = "puky-layer-" + cat;
        d.setAttribute("aria-hidden", "true");
        d.setAttribute("data-active", "false");
        d.style.cssText = "position:absolute;inset:0;width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:center;pointer-events:none;opacity:0;transition:opacity 0.25s ease;transform-origin:center center;z-index:" + zMap[cat];
        wrapper.appendChild(d);
      } else if (d.parentElement !== wrapper) {
        wrapper.appendChild(d);
      }
    });
    var self = this;
    Object.keys(NONE_IDS).forEach(function(cat) {
      var item = self._find(cat, self.state[cat]);
      if (item) self._updateLayer(cat, item);
    });
  };

  WardrobeManager.prototype.renderWardrobe = function() {
    var container = document.getElementById("puky-wardrobe-panel");
    if (!container) return;
    var self = this;
    var activeCat = self.activeCategory || "ropa";
    if (!CATALOG[activeCat]) activeCat = "ropa";

    var html = '<div class="wd-compact-bar">';

    // 1. BARRA DE CATEGORÍAS (Pestañas horizontales + Botón cerrar ✕)
    html += '<div class="wd-bar-header">';
    html += '<div class="wd-tabs-nav" role="tablist" aria-label="Categorías del vestidor">';
    Object.keys(LABELS).forEach(function(cat) {
      var meta = LABELS[cat];
      var isActive = (cat === activeCat);
      var selItem = self._find(cat, self.state[cat]);
      var isEquipped = selItem && selItem.id !== NONE_IDS[cat];

      html += '<button class="wd-tab-btn' + (isActive ? ' active' : '') + '" ';
      html += 'onclick="window.pukyWardrobe.switchCategory(\'' + cat + '\')" ';
      html += 'role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '" ';
      html += 'aria-label="Categoría ' + meta.label + '">';
      html += '<span class="wd-tab-icon">' + meta.icon + '</span>';
      html += '<span class="wd-tab-text">' + meta.label + '</span>';
      if (isEquipped) {
        html += '<span class="wd-tab-dot" aria-hidden="true" title="Prenda seleccionada"></span>';
      }
      html += '</button>';
    });
    html += '</div>';

    // Botón de cerrar ✕
    html += '<button class="wd-bar-close-btn" ';
    html += 'onclick="(window.kiddoApp && window.kiddoApp.closePukyWardrobe) ? window.kiddoApp.closePukyWardrobe() : window.pukyWardrobe.close()" ';
    html += 'aria-label="Cerrar vestidor" title="Cerrar">✕</button>';
    html += '</div>';

    // 2. SELECTOR DE PRENDAS (Fila horizontal desplazable de la categoría activa)
    var items = CATALOG[activeCat] || [];
    var selId = self.state[activeCat];

    html += '<div class="wd-items-scroll-row" role="region" aria-label="Prendas disponibles de ' + LABELS[activeCat].label + '">';
    items.forEach(function(item) {
      if (!item.enabled) return;
      var isSel = (item.id === selId);
      var isNone = (item.id === NONE_IDS[activeCat]);
      var cls = "wd-item-btn" + (isSel ? " wd-item-selected" : "") + (isNone ? " wd-item-none" : "") + (item.isPlaceholder ? " wd-item-placeholder" : "");

      html += '<button class="' + cls + '" ';
      html += 'onclick="window.pukyWardrobe.select(\'' + activeCat + '\',\'' + item.id + '\')" ';
      html += 'aria-label="' + item.name + (isSel ? ' seleccionada' : '') + '" ';
      html += 'title="' + item.name + '">';
      html += '<span class="wd-item-icon">' + item.icon + '</span>';
      html += '<span class="wd-item-label">' + item.name + '</span>';
      if (item.isPlaceholder && !isNone) {
        html += '<span class="wd-placeholder-badge">Pronto</span>';
      }
      if (isSel) {
        html += '<span class="wd-selected-check" aria-hidden="true">✓</span>';
      }
      html += '</button>';
    });
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  };

  WardrobeManager.prototype.init = function() { this.renderWardrobe(); };

  WardrobeManager.prototype.close = function() {
    if (window.kiddoApp && typeof window.kiddoApp.closePukyWardrobe === 'function') {
      window.kiddoApp.closePukyWardrobe();
      return;
    }
    var panel = document.getElementById('puky-wardrobe-inline');
    var btn = document.getElementById('puky-btn-vestimenta');
    var scene = document.getElementById('puky-scene-wrapper');
    if (panel) {
      panel.classList.remove('visible');
      panel.setAttribute('aria-hidden', 'true');
    }
    if (btn) btn.style.background = '#F0FDF4';
    if (scene) scene.classList.remove('wardrobe-active');
  };

  WardrobeManager.prototype.getSummary = function() {
    var self = this; var s = {};
    Object.keys(NONE_IDS).forEach(function(cat) {
      var item = self._find(cat, self.state[cat]);
      s[cat] = item ? item.name : "Ninguno";
    });
    return s;
  };

  // Soporte de scroll horizontal con la rueda del ratón en escritorio
  if (typeof document !== "undefined") {
    document.addEventListener("wheel", function(e) {
      var row = e.target.closest && e.target.closest(".wd-items-scroll-row, .wd-tabs-nav");
      if (row && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        row.scrollLeft += e.deltaY;
      }
    }, { passive: true });
  }

  window.pukyWardrobe = new WardrobeManager();
})();

