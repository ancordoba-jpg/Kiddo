/**
 * KIDDO — MÓDULO DE CONTROL PARENTAL Y AJUSTES
 * Pantalla de Ajustes ilustrada (3 tarjetas), Puerta de Seguridad con SHA-256,
 * Límite Diario de Tiempo, Horario Permitido, Bloqueo Automático y Reautenticación Obligatoria.
 */

class KiddoParentalManager {
  constructor() {
    this.isUnlocked = false;
    this.enteredPin = '';
    this.openFromLockout = false;
    this.loadSettings();
  }

  // Cargar configuración guardada en localStorage
  loadSettings() {
    try {
      const saved = localStorage.getItem('kiddo_parental_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.dailyLimitMinutes === 'number') {
          KIDDO_DATA.parentalSettings.dailyLimitMinutes = parsed.dailyLimitMinutes;
        }
        if (parsed.allowedTimeRange) {
          KIDDO_DATA.parentalSettings.allowedTimeRange = {
            start: parsed.allowedTimeRange.start || '08:00',
            end: parsed.allowedTimeRange.end || '20:00',
            enabled: parsed.allowedTimeRange.enabled === true  // solo true si fue guardado explícitamente
          };
        }
        if (typeof parsed.enableMusic === 'boolean') KIDDO_DATA.parentalSettings.enableMusic = parsed.enableMusic;
        if (typeof parsed.enableVideos === 'boolean') KIDDO_DATA.parentalSettings.enableVideos = parsed.enableVideos;
        if (typeof parsed.enableGames === 'boolean') KIDDO_DATA.parentalSettings.enableGames = parsed.enableGames;
        if (typeof parsed.enableStories === 'boolean') KIDDO_DATA.parentalSettings.enableStories = parsed.enableStories;
      }
      const savedAvatar = localStorage.getItem('kiddo_user_avatar');
      if (savedAvatar) {
        KIDDO_DATA.user.avatar = savedAvatar;
      } else if (!KIDDO_DATA.user.avatar) {
        KIDDO_DATA.user.avatar = 'nino';
      }
    } catch (e) {
      console.warn('Error al cargar configuraciones parentales:', e);
    }
  }

  // Guardar configuración en localStorage
  saveSettings() {
    try {
      const payload = {
        dailyLimitMinutes: KIDDO_DATA.parentalSettings.dailyLimitMinutes,
        allowedTimeRange: KIDDO_DATA.parentalSettings.allowedTimeRange,
        enableMusic: KIDDO_DATA.parentalSettings.enableMusic,
        enableVideos: KIDDO_DATA.parentalSettings.enableVideos,
        enableGames: KIDDO_DATA.parentalSettings.enableGames,
        enableStories: KIDDO_DATA.parentalSettings.enableStories
      };
      localStorage.setItem('kiddo_parental_settings', JSON.stringify(payload));
      if (KIDDO_DATA.user.avatar) {
        localStorage.setItem('kiddo_user_avatar', KIDDO_DATA.user.avatar);
      }
    } catch (e) {
      console.warn('Error al guardar configuraciones parentales:', e);
    }
  }

  // Función criptográfica para hash SHA-256 con salt (Web Crypto API)
  async hashPinWithSalt(pin, salt) {
    const enc = new TextEncoder();
    const data = enc.encode('kiddo_puky_' + salt + '_' + pin);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Validar contraseña sin almacenar texto plano
  async verifyPassword(inputPin) {
    if (!inputPin) return false;
    let storedHash = localStorage.getItem('kiddo_parent_pwd_hash');
    let salt = localStorage.getItem('kiddo_parent_pwd_salt');

    // Inicialización si aún no existe hash en localStorage
    if (!storedHash || !salt) {
      salt = 'salt_' + Math.random().toString(36).substring(2, 10);
      const initialPin = KIDDO_DATA.user.parentPin || '1234';
      storedHash = await this.hashPinWithSalt(initialPin, salt);
      localStorage.setItem('kiddo_parent_pwd_hash', storedHash);
      localStorage.setItem('kiddo_parent_pwd_salt', salt);
      // Eliminar texto plano de memoria si existiera
      delete KIDDO_DATA.user.parentPin;
    }

    const testHash = await this.hashPinWithSalt(inputPin, salt);
    return testHash === storedHash;
  }

  // Actualizar contraseña con hash seguro
  async updateParentPin(newPin) {
    if (!newPin || newPin.length < 4) {
      return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
    }
    const salt = 'salt_' + Math.random().toString(36).substring(2, 10);
    const hash = await this.hashPinWithSalt(newPin, salt);
    localStorage.setItem('kiddo_parent_pwd_hash', hash);
    localStorage.setItem('kiddo_parent_pwd_salt', salt);
    return { success: true, message: '¡Contraseña actualizada correctamente!' };
  }

  // ==========================================================
  // RENDERIZADO DE LA PANTALLA PRINCIPAL DE AJUSTES
  // ==========================================================
  renderSettingsScreen() {
    const container = document.getElementById('screen-ajustes');
    if (!container) return;

    if (!this.isUnlocked) {
      this.renderSettingsOverview(container);
    } else {
      this.renderParentDashboard(container);
    }
  }

  // Vista inicial de Ajustes: Banner superior + 3 tarjetas principales
  renderSettingsOverview(container) {
    const user = KIDDO_DATA.user;
    const avatarType = user.avatar === 'nina' ? 'nina' : 'nino';
    const avatarSrc = `assets/ajustes/avatar-${avatarType}.png`;

    container.innerHTML = `
      <div class="settings-overview-view">
        <!-- Banner Superior Ilustrado -->
        <div class="settings-banner-card">
          <img src="assets/ajustes/banner-ajustes.png" 
               alt="Ajustes y Configuración - Opciones de la aplicación y modo exclusivo para adultos" 
               class="settings-banner-img"
               onerror="this.src='assets/ajustes/banner-ajustes.png.png'">
        </div>

        <!-- TARJETA A: MODO PADRES / CONTROL PARENTAL -->
        <div class="settings-card card-parental" onclick="window.kiddoParental.openPinPrompt()">
          <div class="settings-card-left">
            <div class="settings-card-badge">🔒 EXCLUSIVO ADULTOS</div>
            <h3 class="settings-card-title">Modo Padres / Control Parental</h3>
            <p class="settings-card-desc">Supervisá el tiempo de pantalla, las actividades y los límites de uso.</p>
            <button class="settings-btn-parental" onclick="event.stopPropagation(); window.kiddoParental.openPinPrompt()">
              <span class="btn-lock-icon">🔒</span>
              <span>Acceder con contraseña</span>
              <span class="btn-arrow">➔</span>
            </button>
          </div>
          <div class="settings-card-visual">
            <img src="assets/ajustes/escudo-parental.png" 
                 alt="Escudo de Control Parental" 
                 class="settings-card-img shield-img"
                 onerror="this.src='assets/ajustes/escudo-parental.png.png'">
          </div>
        </div>

        <!-- TARJETA B: INFORMACIÓN DE LA APLICACIÓN -->
        <div class="settings-card card-app-info">
          <div class="settings-card-left">
            <h3 class="settings-card-title">Información de la Aplicación</h3>
            <div class="settings-info-list">
              <div class="info-row">
                <span class="info-label">📱 Nombre:</span>
                <span class="info-value">Kiddo</span>
              </div>
              <div class="info-row">
                <span class="info-label">🐨 Personaje:</span>
                <span class="info-value">Puky el Koala</span>
              </div>
              <div class="info-row">
                <span class="info-label">🚀 Versión:</span>
                <span class="info-value">1.0.0 (Kiddo Web PWA)</span>
              </div>
              <div class="info-row">
                <span class="info-label">🎨 Estilo visual:</span>
                <span class="info-value">Pastel Infantil Armonioso</span>
              </div>
            </div>
          </div>
          <div class="settings-card-visual">
            <img src="assets/ajustes/telefono-kiddo.png" 
                 alt="Ilustración Teléfono Kiddo" 
                 class="settings-card-img phone-img"
                 onerror="this.src='assets/ajustes/telefono-kiddo.png.png'">
          </div>
        </div>

        <!-- TARJETA C: SESIÓN DE USUARIO -->
        <div class="settings-card card-user-session">
          <div class="settings-card-left">
            <h3 class="settings-card-title">Sesión de Usuario</h3>
            <div class="session-user-meta">
              <span class="session-label">Perfil activo:</span>
              <strong class="session-user-name">${user.name || 'Mateo'}</strong>
              <span class="session-user-badge">${avatarType === 'nina' ? '👧 Niña' : '👦 Niño'}</span>
            </div>
            <div class="session-actions-row">
              <button class="settings-btn-logout" onclick="window.kiddoApp.logout()">
                <span>🚪 Cerrar sesión</span>
              </button>
              <button class="settings-btn-avatar-switch" onclick="window.kiddoParental.toggleAvatarGender()" title="Cambiar avatar niño / niña">
                <span>🔄 Cambiar avatar</span>
              </button>
            </div>
          </div>
          <div class="settings-card-visual">
            <img src="${avatarSrc}" 
                 alt="Avatar del perfil activo" 
                 class="settings-card-img avatar-img"
                 id="settings-avatar-img"
                 onerror="this.src='assets/ajustes/avatar-${avatarType}.png.png'">
          </div>
        </div>
      </div>
    `;
  }

  // Alternar avatar entre niño y niña con persistencia inmediata
  toggleAvatarGender() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const current = KIDDO_DATA.user.avatar || 'nino';
    KIDDO_DATA.user.avatar = (current === 'nino') ? 'nina' : 'nino';
    this.saveSettings();
    this.renderSettingsScreen();
  }

  // ==========================================================
  // PUERTA DE ACCESO POR CONTRASEÑA / PIN
  // ==========================================================
  openPinPrompt(isModal = false) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.enteredPin = '';
    this.openFromLockout = isModal;

    const htmlContent = `
      <div class="parent-gate-card">
        <button class="parent-gate-back-btn" onclick="window.kiddoParental.cancelPinPrompt()">
          ← Volver
        </button>
        <div class="parent-gate-icon">
          <img src="assets/ajustes/escudo-parental.png" alt="Seguridad Parental" class="gate-shield-img">
        </div>
        <h2>Modo Padres</h2>
        <p class="parent-gate-desc">
          Introduce la contraseña del adulto para acceder a los controles y límites de uso.
        </p>

        <div class="pin-display-wrapper">
          <div class="pin-dots">
            <span class="pin-dot" id="pdot-1"></span>
            <span class="pin-dot" id="pdot-2"></span>
            <span class="pin-dot" id="pdot-3"></span>
            <span class="pin-dot" id="pdot-4"></span>
          </div>
        </div>

        <!-- Teclado numérico táctil seguro -->
        <div class="pin-keypad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
            <button class="pin-key-btn" onclick="window.kiddoParental.enterDigit('${n}')">${n}</button>
          `).join('')}
          <button class="pin-key-btn key-clear" onclick="window.kiddoParental.clearPin()">Borrar</button>
          <button class="pin-key-btn" onclick="window.kiddoParental.enterDigit('0')">0</button>
          <button class="pin-key-btn key-submit" onclick="window.kiddoParental.verifyPin()">Entrar ➔</button>
        </div>

        <div id="pin-error-msg" class="pin-error-banner" style="display: none;">
          ⚠️ Contraseña incorrecta. Inténtalo de nuevo.
        </div>
      </div>
    `;

    if (isModal) {
      const modalContainer = document.getElementById('parental-modal-container');
      const modal = document.getElementById('kiddo-parental-modal');
      if (modalContainer && modal) {
        modalContainer.innerHTML = htmlContent;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    } else {
      const container = document.getElementById('screen-ajustes');
      if (container) container.innerHTML = htmlContent;
    }
  }

  cancelPinPrompt() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.enteredPin = '';
    if (this.openFromLockout) {
      const modal = document.getElementById('kiddo-parental-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    } else {
      const container = document.getElementById('screen-ajustes');
      if (container) this.renderSettingsOverview(container);
    }
  }

  enterDigit(digit) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += digit;
      this.updatePinDots();
      if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
      if (this.enteredPin.length === 4) {
        setTimeout(() => this.verifyPin(), 220);
      }
    }
  }

  clearPin() {
    this.enteredPin = '';
    this.updatePinDots();
    const errMsg = document.getElementById('pin-error-msg');
    if (errMsg) errMsg.style.display = 'none';
  }

  updatePinDots() {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`pdot-${i}`);
      if (dot) {
        if (i <= this.enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    }
  }

  async verifyPin() {
    const isValid = await this.verifyPassword(this.enteredPin);
    if (isValid) {
      this.isUnlocked = true;
      this.enteredPin = '';
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();

      if (this.openFromLockout) {
        // Renderizar dentro del modal sobre el bloqueo
        const modalContainer = document.getElementById('parental-modal-container');
        if (modalContainer) {
          this.renderParentDashboard(modalContainer, true);
        }
      } else {
        const container = document.getElementById('screen-ajustes');
        if (container) this.renderParentDashboard(container, false);
      }
    } else {
      const errMsg = document.getElementById('pin-error-msg');
      if (errMsg) {
        errMsg.style.display = 'block';
        errMsg.classList.add('shake-anim');
        setTimeout(() => errMsg.classList.remove('shake-anim'), 500);
      }
      this.enteredPin = '';
      this.updatePinDots();
    }
  }

  // ==========================================================
  // REAUTENTICACIÓN OBLIGATORIA / CIERRE DE SESIÓN PARENTAL
  // ==========================================================
  lockParentalMode() {
    this.isUnlocked = false;
    this.enteredPin = '';
    this.openFromLockout = false;

    // Cerrar modal parental si estuviera abierto
    const modal = document.getElementById('kiddo-parental-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }

    // Si estamos en la pantalla de ajustes, volver al overview
    if (window.kiddoApp && window.kiddoApp.currentScreen === 'ajustes') {
      const container = document.getElementById('screen-ajustes');
      if (container) this.renderSettingsOverview(container);
    }

    // Re-evaluar bloqueo global de Kiddo
    if (window.kiddoApp && typeof window.kiddoApp.evaluateUsageRestrictions === 'function') {
      window.kiddoApp.evaluateUsageRestrictions();
    }
  }

  // Acceso para adultos disparado desde la pantalla de bloqueo
  openParentalFromLockout() {
    this.openPinPrompt(true);
  }

  // ==========================================================
  // PANEL PRINCIPAL DE PADRES / CONTROL PARENTAL (DESBLOQUEADO)
  // ==========================================================
  renderParentDashboard(container, isModal = false) {
    const user = KIDDO_DATA.user;
    const settings = KIDDO_DATA.parentalSettings;
    const todayMins = Math.floor(KIDDO_DATA.user.todayScreenTimeMinutes || 0);
    const limit = settings.dailyLimitMinutes || 0;
    const remainingMins = limit > 0 ? Math.max(0, limit - todayMins) : 'Ilimitado';
    const percentUsed = limit > 0 ? Math.min(100, Math.round((todayMins / limit) * 100)) : 0;

    const schedule = settings.allowedTimeRange || { start: '08:00', end: '20:00', enabled: true };
    const scheduleActiveText = schedule.enabled
      ? `✅ Activo: ${schedule.start} a ${schedule.end}`
      : '⏸️ Restricción horaria desactivada';

    container.innerHTML = `
      <div class="parent-dashboard-wrapper">
        <!-- Cabecera Superior del Panel Parental -->
        <div class="parent-dash-header">
          <div class="parent-dash-title-wrap">
            <span class="parent-badge">🛡️ PANEL DE CONTROL PARENTAL</span>
            <h2>Supervisión y Control</h2>
            <p>Perfil de: <strong>${user.name}</strong> • ${user.avatar === 'nina' ? '👧 Niña' : '👦 Niño'}</p>
          </div>
          <button class="parent-exit-btn" onclick="window.kiddoParental.lockParentalMode()" aria-label="Cerrar Panel Parental">
            <span>Cerrar Panel 🔒</span>
          </button>
        </div>

        <!-- 1. SECCIÓN: TIEMPO DE PANTALLA -->
        <div class="parent-panel-card">
          <div class="parent-panel-card-header">
            <span class="parent-card-icon">⏱️</span>
            <div>
              <h3>Tiempo de Pantalla</h3>
              <p>Monitorea y configura el límite diario de uso en Kiddo.</p>
            </div>
          </div>

          <!-- Métricas del día -->
          <div class="screen-time-stats-row">
            <div class="time-stat-pill">
              <span class="stat-pill-label">Tiempo usado hoy:</span>
              <strong class="stat-pill-val">${todayMins} min</strong>
            </div>
            <div class="time-stat-pill">
              <span class="stat-pill-label">Tiempo restante:</span>
              <strong class="stat-pill-val ${remainingMins === 0 ? 'text-danger' : 'text-success'}">
                ${limit > 0 ? remainingMins + ' min' : 'Sin límite'}
              </strong>
            </div>
            <div class="time-stat-pill">
              <span class="stat-pill-label">Límite diario:</span>
              <strong class="stat-pill-val">${limit > 0 ? limit + ' min' : 'Sin límite'}</strong>
            </div>
          </div>

          <!-- Barra de progreso visual suave -->
          <div class="time-progress-container">
            <div class="time-progress-bar-bg">
              <div class="time-progress-bar-fill ${percentUsed >= 90 ? 'progress-warning' : ''}" 
                   style="width: ${limit > 0 ? percentUsed : 0}%;"></div>
            </div>
            <span class="time-progress-percent">${limit > 0 ? percentUsed + '% usado' : 'Ilimitado'}</span>
          </div>

          <!-- Selector de opciones de límite -->
          <div class="limit-presets-area">
            <span class="presets-title">Elige un límite diario predeterminado:</span>
            <div class="limit-chips-grid">
              ${[
                { label: 'Sin límite', val: 0 },
                { label: '15 min', val: 15 },
                { label: '30 min', val: 30 },
                { label: '45 min', val: 45 },
                { label: '1 hora', val: 60 },
                { label: '1 h 30 m', val: 90 },
                { label: '2 horas', val: 120 }
              ].map(opt => `
                <button class="limit-chip-btn ${limit === opt.val ? 'active' : ''}" 
                        onclick="window.kiddoParental.updateDailyLimit(${opt.val})">
                  ${opt.label}
                </button>
              `).join('')}
            </div>

            <!-- Entrada personalizada -->
            <div class="custom-limit-row">
              <label for="custom-limit-input">Tiempo personalizado (en minutos):</label>
              <div class="custom-limit-inputs">
                <input type="number" id="custom-limit-input" min="5" max="360" step="5" 
                       value="${limit > 0 ? limit : 45}" class="kiddo-num-input" placeholder="Minutos">
                <button class="kiddo-btn-apply" onclick="window.kiddoParental.applyCustomLimit()">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. SECCIÓN: HORARIO DE USO PERMITIDO -->
        <div class="parent-panel-card">
          <div class="parent-panel-card-header">
            <span class="parent-card-icon">🕒</span>
            <div>
              <h3>Horario de uso permitido</h3>
              <p>Kiddo solamente podrá utilizarse dentro de este rango horario.</p>
            </div>
          </div>

          <div class="schedule-status-banner">
            <span class="schedule-badge">${scheduleActiveText}</span>
          </div>

          <div class="schedule-controls-box">
            <div class="schedule-toggle-row">
              <label class="switch-toggle" for="schedule-enabled-check">
                <input type="checkbox" id="schedule-enabled-check" ${schedule.enabled ? 'checked' : ''} 
                       onchange="window.kiddoParental.toggleScheduleRestriction(this.checked)">
                <span class="slider-round"></span>
              </label>
              <span class="toggle-text">Activar restricción por horario</span>
            </div>

            <div class="schedule-times-row ${schedule.enabled ? '' : 'disabled-area'}">
              <div class="time-field-box">
                <label>Hora de inicio:</label>
                <input type="time" value="${schedule.start}" class="kiddo-time-picker" 
                       ${schedule.enabled ? '' : 'disabled'}
                       onchange="window.kiddoParental.updateTimeRange('start', this.value)">
              </div>
              <div class="time-field-box">
                <label>Hora de finalización:</label>
                <input type="time" value="${schedule.end}" class="kiddo-time-picker" 
                       ${schedule.enabled ? '' : 'disabled'}
                       onchange="window.kiddoParental.updateTimeRange('end', this.value)">
              </div>
            </div>
            <p class="schedule-hint">💡 Admite franjas nocturnas o diurnas (incluso cruzando la medianoche).</p>
          </div>
        </div>

        <!-- 3. SECCIÓN: PERMISOS DE SECCIONES Y CONTRASEÑA -->
        <div class="parent-panel-card">
          <div class="parent-panel-card-header">
            <span class="parent-card-icon">🗂️</span>
            <div>
              <h3>Permisos y Seguridad</h3>
              <p>Activa o desactiva actividades infantiles y actualiza tu contraseña.</p>
            </div>
          </div>

          <div class="toggles-list">
            <div class="toggle-item">
              <div class="toggle-label">
                <strong>🎮 Juegos Educativos</strong>
                <small>Matemáticas, memoria y palabras</small>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" ${settings.enableGames ? 'checked' : ''} 
                       onchange="window.kiddoParental.toggleSection('enableGames', this.checked)">
                <span class="slider-round"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-label">
                <strong>📖 Cuentos Infantiles</strong>
                <small>Lectura ilustrada y narración por voz</small>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" ${settings.enableStories ? 'checked' : ''} 
                       onchange="window.kiddoParental.toggleSection('enableStories', this.checked)">
                <span class="slider-round"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-label">
                <strong>🎵 Música y Piano</strong>
                <small>Piano interactivo y sonidos relajantes</small>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" ${settings.enableMusic ? 'checked' : ''} 
                       onchange="window.kiddoParental.toggleSection('enableMusic', this.checked)">
                <span class="slider-round"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-label">
                <strong>📺 Videos Infantiles</strong>
                <small>Biblioteca de videos seguros</small>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" ${settings.enableVideos ? 'checked' : ''} 
                       onchange="window.kiddoParental.toggleSection('enableVideos', this.checked)">
                <span class="slider-round"></span>
              </label>
            </div>
          </div>

          <!-- Cambio de Contraseña -->
          <div class="change-password-box">
            <h4>🔑 Cambiar Contraseña Parental</h4>
            <div class="change-pin-row">
              <input type="password" maxlength="8" placeholder="Nueva contraseña (4-8 dígitos)" 
                     id="new-parent-pin-input" class="kiddo-pwd-input">
              <button class="kiddo-btn-action" onclick="window.kiddoParental.handlePinChange()">
                Actualizar
              </button>
            </div>
            <div id="pin-change-feedback" class="pin-feedback-msg" style="display: none;"></div>
          </div>
        </div>

      </div>
    `;
  }

  // Actualizar Límite Diario (Chips predeterminados)
  updateDailyLimit(minutes) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    KIDDO_DATA.parentalSettings.dailyLimitMinutes = parseInt(minutes, 10);
    this.saveSettings();

    // Re-evaluar bloqueo global y re-renderizar
    if (window.kiddoApp && typeof window.kiddoApp.evaluateUsageRestrictions === 'function') {
      window.kiddoApp.evaluateUsageRestrictions();
    }
    const container = this.openFromLockout
      ? document.getElementById('parental-modal-container')
      : document.getElementById('screen-ajustes');
    if (container) this.renderParentDashboard(container, this.openFromLockout);
  }

  // Aplicar Límite Personalizado
  applyCustomLimit() {
    const input = document.getElementById('custom-limit-input');
    if (input) {
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 5) {
        this.updateDailyLimit(val);
      } else {
        alert('Por favor ingresa un número de minutos válido (mínimo 5).');
      }
    }
  }

  // Toggle de la restricción horaria
  toggleScheduleRestriction(enabled) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    KIDDO_DATA.parentalSettings.allowedTimeRange.enabled = enabled;
    this.saveSettings();

    if (window.kiddoApp && typeof window.kiddoApp.evaluateUsageRestrictions === 'function') {
      window.kiddoApp.evaluateUsageRestrictions();
    }
    const container = this.openFromLockout
      ? document.getElementById('parental-modal-container')
      : document.getElementById('screen-ajustes');
    if (container) this.renderParentDashboard(container, this.openFromLockout);
  }

  // Actualizar horario de inicio o término
  updateTimeRange(type, value) {
    if (!value) return;
    KIDDO_DATA.parentalSettings.allowedTimeRange[type] = value;
    this.saveSettings();

    if (window.kiddoApp && typeof window.kiddoApp.evaluateUsageRestrictions === 'function') {
      window.kiddoApp.evaluateUsageRestrictions();
    }
    const container = this.openFromLockout
      ? document.getElementById('parental-modal-container')
      : document.getElementById('screen-ajustes');
    if (container) this.renderParentDashboard(container, this.openFromLockout);
  }

  // Alternar permisos de secciones
  toggleSection(sectionKey, enabled) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    KIDDO_DATA.parentalSettings[sectionKey] = enabled;
    this.saveSettings();
  }

  // Manejar cambio de PIN con hash seguro
  async handlePinChange() {
    const input = document.getElementById('new-parent-pin-input');
    const feedback = document.getElementById('pin-change-feedback');
    if (!input || !feedback) return;

    const res = await this.updateParentPin(input.value.trim());
    feedback.textContent = res.message;
    feedback.style.display = 'block';
    feedback.className = res.success ? 'pin-feedback-msg success' : 'pin-feedback-msg error';

    if (res.success) {
      input.value = '';
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 3500);
    }
  }
}

window.kiddoParental = new KiddoParentalManager();
