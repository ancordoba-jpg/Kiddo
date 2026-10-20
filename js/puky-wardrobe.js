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
      { id:"ropa-ninguna",  name:"Ninguna",  icon:"✕", layer:40, imagePath:null, enabled:true, isPlaceholder:false },
      { id:"ropa-remera",   name:"Remera",   icon:"👕", layer:40, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"ropa-buzo",    name:"Buzo",     icon:"🧥", layer:40, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"ropa-campera", name:"Campera",  icon:"🦺", layer:40, imagePath:null, enabled:true, isPlaceholder:true  }
    ],
    pantalones: [
      { id:"pant-ninguno", name:"Ninguno",  icon:"✕", layer:30, imagePath:null, enabled:true, isPlaceholder:false },
      { id:"pant-largo",   name:"Pantalón", icon:"👖", layer:30, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"pant-short",   name:"Short",    icon:"🩳", layer:30, imagePath:null, enabled:true, isPlaceholder:true  }
    ],
    zapatillas: [
      { id:"zap-ninguna",   name:"Ninguno",    icon:"✕", layer:20, imagePath:null, enabled:true, isPlaceholder:false },
      { id:"zap-deportiva", name:"Zapatillas", icon:"👟", layer:20, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"zap-botita",    name:"Botitas",    icon:"👢", layer:20, imagePath:null, enabled:true, isPlaceholder:true  }
    ],
    accesorios: [
      { id:"acc-ninguno", name:"Ninguno", icon:"✕", layer:50, imagePath:null, enabled:true, isPlaceholder:false },
      { id:"acc-gorra",   name:"Gorra",   icon:"🧢", layer:50, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"acc-lentes",  name:"Lentes",  icon:"👓", layer:50, imagePath:null, enabled:true, isPlaceholder:true  },
      { id:"acc-mono",    name:"Moño",    icon:"🎀", layer:50, imagePath:null, enabled:true, isPlaceholder:true  }
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

  WardrobeManager.prototype.close = function() {
    var panel = document.getElementById("puky-wardrobe-inline");
    if (panel) {
      panel.classList.remove("visible");
      panel.setAttribute("aria-hidden", "true");
    }
    var btn = document.getElementById("puky-btn-vestimenta");
    if (btn) btn.style.background = "#F0FDF4";
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  };

  WardrobeManager.prototype._updateLayer = function(cat, item) {
    var el = document.getElementById("puky-layer-" + cat);
    if (!el) return;
    if (!item.imagePath || item.id === NONE_IDS[cat]) {
      el.style.opacity = "0"; el.setAttribute("data-active","false"); return;
    }
    var img = new Image();
    img.onload = function() { el.style.backgroundImage = 'url("'+item.imagePath+'")'; el.style.opacity = "1"; el.setAttribute("data-active","true"); };
    img.onerror = function() { el.style.opacity = "0"; el.setAttribute("data-active","false"); };
    img.src = item.imagePath;
  };

  WardrobeManager.prototype.mountLayers = function(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    var zMap = { pantalones:30, zapatillas:20, ropa:40, accesorios:50 };
    ["pantalones","zapatillas","ropa","accesorios"].forEach(function(cat) {
      if (document.getElementById("puky-layer-"+cat)) return;
      var d = document.createElement("div");
      d.id = "puky-layer-" + cat;
      d.setAttribute("aria-hidden","true");
      d.setAttribute("data-active","false");
      d.style.cssText = "position:absolute;inset:0;width:100%;height:100%;background-size:contain;background-repeat:no-repeat;background-position:bottom center;pointer-events:none;opacity:0;transition:opacity 0.3s ease;z-index:"+zMap[cat];
      wrapper.appendChild(d);
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

  window.pukyWardrobe = new WardrobeManager();
})();
