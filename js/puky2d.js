/**
 * KIDDO - Puky2DController
 * Etapa 1: idle + blink automatico.
 * Recursos: assets/puky2d/frames/ (extension real: .png.png)
 */

class Puky2DController {
  constructor() {
    this._base = 'assets/puky2d/frames/';
    this.frames = {
      idle:    this._base + 'puky-idle.png.png',
      blink:   this._base + 'puky-blink.png.png',
      happy:   this._base + 'puky-happy.png.png',
      petting: this._base + 'puky-petting.png.png',
      wave:    this._base + 'puky-wave.png.png',
    };
    this.state            = 'idle';
    this.imgElement       = null;
    this._blinkTimer      = null;
    this._blinkResetTimer = null;
    this._reducedMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._preloadAll();
  }

  _preloadAll() {
    var f = this.frames;
    Object.keys(f).forEach(function(k) { var i = new Image(); i.src = f[k]; });
  }

  mountTo(containerId) {
    var container = document.getElementById(containerId);
    if (!container) { console.warn('[Puky2D] Contenedor no encontrado:', containerId); return; }
    this._stopBlink();
    container.innerHTML = '';

    var wrapper = document.createElement('div');
    wrapper.id = 'puky2d-wrapper';
    wrapper.setAttribute('aria-label', 'Puky el Koala');
    wrapper.setAttribute('role', 'img');
    wrapper.style.cssText = 'position:relative;width:100%;max-width:200px;margin:0 auto;display:flex;align-items:flex-end;justify-content:center;';

    var img = document.createElement('img');
    img.id        = 'puky2d-img';
    img.src       = this.frames.idle;
    img.alt       = 'Puky el Koala';
    img.draggable = false;
    img.style.cssText = 'width:100%;height:auto;max-height:235px;object-fit:contain;display:block;cursor:pointer;filter:drop-shadow(0 6px 14px rgba(0,0,0,0.08));align-self:flex-end;';

    this.imgElement = img;
    wrapper.appendChild(img);
    container.appendChild(wrapper);

    if (!this._reducedMotion) { this._scheduleBlink(); }
  }

  setState(newState) {
    if (newState === this.state || !this.frames[newState]) return;
    this.state = newState;
    this._applyFrame(this.frames[newState]);
  }

  _applyFrame(src) {
    if (this.imgElement) { this.imgElement.src = src; }
  }

  _scheduleBlink() {
    var self = this;
    var delay = 3000 + Math.random() * 3000;
    this._blinkTimer = setTimeout(function() {
      if (self.state !== 'idle') { self._scheduleBlink(); return; }
      self.state = 'blink';
      self._applyFrame(self.frames.blink);
      self._blinkResetTimer = setTimeout(function() {
        self.state = 'idle';
        self._applyFrame(self.frames.idle);
        self._scheduleBlink();
      }, 120);
    }, delay);
  }

  _stopBlink() {
    if (this._blinkTimer)      { clearTimeout(this._blinkTimer);      this._blinkTimer = null; }
    if (this._blinkResetTimer) { clearTimeout(this._blinkResetTimer); this._blinkResetTimer = null; }
  }

  showHappy(ms)   { this._showTemp('happy',   ms || 2000); }
  showPetting(ms) { this._showTemp('petting', ms || 2000); }
  showWave(ms)    { this._showTemp('wave',    ms || 2500); }

  _showTemp(s, ms) {
    var self = this;
    this._stopBlink();
    this.setState(s);
    setTimeout(function() {
      self.setState('idle');
      if (!self._reducedMotion) self._scheduleBlink();
    }, ms);
  }

  destroy() { this._stopBlink(); this.imgElement = null; }
}

window.puky2D = new Puky2DController();