/**
 * Módulo de Control Parental / Modo Padres
 * Pantalla de Ajustes, Puerta de Seguridad por Contraseña, Métricas y Vinculación
 */

class KiddoParentalManager {
  constructor() {
    this.isUnlocked = false;
    this.enteredPin = '';
  }

  // Renderizar la pantalla de Ajustes
  renderSettingsScreen() {
    const container = document.getElementById('screen-ajustes');
    if (!container) return;

    if (!this.isUnlocked) {
      this.renderSettingsOverview(container);
    } else {
      this.renderParentDashboard(container);
    }
  }

  // Vista inicial de Ajustes con el botón claramente identificado para Control Parental
  renderSettingsOverview(container) {
    container.innerHTML = `
      <div class="settings-overview-view">
        <div class="home-header-banner" style="background: linear-gradient(135deg, #E9D8FD 0%, #BEE3F8 100%);">
          <h2>Ajustes y Configuración ⚙️</h2>
          <p>Opciones de la aplicación y modo exclusivo para adultos</p>
        </div>

        <!-- Tarjeta Destacada de Acceso al Control Parental -->
        <div class="parent-control-access-card" onclick="window.kiddoParental.openPinPrompt()">
          <div class="parent-access-badge">🔒 EXCLUSIVO ADULTOS</div>
          <div class="parent-access-header">
            <span class="parent-access-icon">🛡️</span>
            <div>
              <h3>Modo Padres / Control Parental</h3>
              <p>Supervisa el tiempo de pantalla, actividades, límites y vincula tus dispositivos.</p>
            </div>
          </div>
          <button class="kiddo-btn-primary" style="margin-top: 14px; background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);">
            <span>Acceder con Contraseña</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Opciones Generales Básicas -->
        <div class="parent-section-box" style="margin-top: 16px;">
          <h3>Información de la Aplicación</h3>
          <div style="font-size: 13px; color: #4A5568; line-height: 1.8;">
            <p>🐨 <strong>Personaje:</strong> Puky el Koala</p>
            <p>📱 <strong>Versión:</strong> 1.0.0 (Kiddo Mobile)</p>
            <p>🎨 <strong>Tema visual:</strong> Pastel Infantil Armonioso</p>
          </div>
        </div>

        <!-- Opción de Cerrar Sesión -->
        <div class="parent-section-box" style="margin-top: 16px;">
          <h3>Sesión de Usuario</h3>
          <p style="font-size: 13px; color: #71809A; margin-bottom: 12px;">Perfil activo: <strong>${KIDDO_DATA.user.name}</strong></p>
          <button class="kiddo-btn-primary" style="background: #FFF5F5; border: 1.5px solid #FEB2B2; color: #E53E3E; box-shadow: none;" onclick="window.kiddoApp.logout()">
            <span>🚪 Cerrar Sesión</span>
          </button>
        </div>
      </div>
    `;
  }

  // Abrir la pantalla de solicitud de PIN
  openPinPrompt() {
    const container = document.getElementById('screen-ajustes');
    if (!container) return;

    this.enteredPin = '';
    container.innerHTML = `
      <div class="parent-gate-card">
        <button class="story-back-btn" style="margin-bottom: 12px; align-self: flex-start;" onclick="window.kiddoParental.renderSettingsOverview(document.getElementById('screen-ajustes'))">← Volver a Ajustes</button>
        <div class="parent-gate-icon">🔒</div>
        <h2>Control Parental</h2>
        <p class="parent-gate-desc">
          Introduce la contraseña establecida durante el registro para acceder a las funciones de supervisión y administración.
        </p>

        <div class="pin-display-wrapper">
          <div class="pin-dots">
            <span class="pin-dot" id="pdot-1"></span>
            <span class="pin-dot" id="pdot-2"></span>
            <span class="pin-dot" id="pdot-3"></span>
            <span class="pin-dot" id="pdot-4"></span>
          </div>
        </div>

        <!-- Teclado numérico seguro -->
        <div class="pin-keypad">
          ${[1,2,3,4,5,6,7,8,9].map(n => `
            <button class="pin-key-btn" onclick="window.kiddoParental.enterDigit('${n}')">${n}</button>
          `).join('')}
          <button class="pin-key-btn key-clear" onclick="window.kiddoParental.clearPin()">Borrar</button>
          <button class="pin-key-btn" onclick="window.kiddoParental.enterDigit('0')">0</button>
          <button class="pin-key-btn key-submit" onclick="window.kiddoParental.verifyPin()">Entrar</button>
        </div>

        <div id="pin-error-msg" class="pin-error-banner" style="display: none;">
          ⚠️ Contraseña incorrecta. Inténtalo de nuevo.
        </div>
      </div>
    `;
  }

  enterDigit(digit) {
    if (this.enteredPin.length < 4) {
      this.enteredPin += digit;
      this.updatePinDots();
      if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
      if (this.enteredPin.length === 4) {
        setTimeout(() => this.verifyPin(), 200);
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

  verifyPin() {
    const correctPin = KIDDO_DATA.user.parentPin || '1234';
    if (this.enteredPin === correctPin) {
      this.isUnlocked = true;
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();
      this.renderSettingsScreen();
    } else {
      const errMsg = document.getElementById('pin-error-msg');
      if (errMsg) errMsg.style.display = 'block';
      this.enteredPin = '';
      this.updatePinDots();
    }
  }

  lockParentalMode() {
    this.isUnlocked = false;
    this.enteredPin = '';
    this.renderSettingsScreen();
  }

  // Panel Principal de Padres / Control Parental
  renderParentDashboard(container) {
    const user = KIDDO_DATA.user;
    const stats = KIDDO_DATA.parentalSettings.usageStats;
    const settings = KIDDO_DATA.parentalSettings;

    container.innerHTML = `
      <div class="parent-dashboard">
        <!-- Barra de estado superior del adulto -->
        <div class="parent-dash-header">
          <div class="parent-profile-info">
            <span class="parent-badge">🛡️ PANEL DE PADRES</span>
            <h2>Supervisión y Control</h2>
            <p>Supervisando a: <strong>${user.name}</strong> (${user.birthdate})</p>
          </div>
          <button class="parent-exit-btn" onclick="window.kiddoParental.lockParentalMode()">
            <span>Cerrar Panel 🔒</span>
          </button>
        </div>

        <!-- Pestañas internas del panel -->
        <div class="parent-tabs-nav">
          <button class="parent-tab-btn active" onclick="window.kiddoParental.switchParentTab(this, 'ptab-stats')">📊 Resumen de Uso</button>
          <button class="parent-tab-btn" onclick="window.kiddoParental.switchParentTab(this, 'ptab-limits')">⏱️ Límites y Horarios</button>
          <button class="parent-tab-btn" onclick="window.kiddoParental.switchParentTab(this, 'ptab-permissions')">🔒 Permisos y Contenido</button>
          <button class="parent-tab-btn" onclick="window.kiddoParental.switchParentTab(this, 'ptab-sync')">📲 Vinculación de Dispositivos</button>
        </div>

        <!-- 1. PESTAÑA: RESUMEN Y ESTADÍSTICAS DE USO -->
        <div id="ptab-stats" class="parent-tab-content active">
          <div class="parent-metrics-grid">
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">⏱️</span>
                <span class="metric-title">Tiempo de Hoy</span>
              </div>
              <div class="metric-value">${KIDDO_DATA.user.todayScreenTimeMinutes} <small>min</small></div>
              <div class="metric-progress">
                <div class="metric-bar" style="width: ${(KIDDO_DATA.user.todayScreenTimeMinutes / settings.dailyLimitMinutes) * 100}%;"></div>
              </div>
              <p class="metric-hint">Límite diario: ${settings.dailyLimitMinutes} min</p>
            </div>

            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">📅</span>
                <span class="metric-title">Promedio Semanal</span>
              </div>
              <div class="metric-value">${stats.weeklyAverageMinutes} <small>min/día</small></div>
              <p class="metric-hint">Uso equilibrado y saludable</p>
            </div>

            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">⭐</span>
                <span class="metric-title">Misiones</span>
              </div>
              <div class="metric-value">${KIDDO_DATA.missions.filter(m => m.completed).length} / ${KIDDO_DATA.missions.length}</div>
              <p class="metric-hint">Alto compromiso diario</p>
            </div>
          </div>

          <!-- Funciones más utilizadas -->
          <div class="parent-section-box">
            <h3>📈 Funciones más utilizadas</h3>
            <div class="features-bars-list">
              ${stats.topFeatures.map(f => `
                <div class="feature-bar-item">
                  <div class="feature-bar-label">
                    <span>${f.icon} ${f.name}</span>
                    <strong>${f.percentage}%</strong>
                  </div>
                  <div class="feature-bar-track">
                    <div class="feature-bar-fill" style="width: ${f.percentage}%; background-color: ${f.color};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Progreso Educativo -->
          <div class="parent-section-box">
            <h3>🎓 Progreso en Actividades Educativas</h3>
            <div class="education-progress-grid">
              ${stats.educationalProgress.map(p => `
                <div class="edu-progress-item">
                  <div class="edu-progress-info">
                    <strong>${p.subject}</strong>
                    <span>${p.details}</span>
                  </div>
                  <div class="edu-bar-track">
                    <div class="edu-bar-fill" style="width: ${p.progress}%;"></div>
                  </div>
                  <span class="edu-score">${p.progress}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 2. PESTAÑA: CONFIGURACIÓN DE LÍMITES Y HORARIOS -->
        <div id="ptab-limits" class="parent-tab-content">
          <div class="parent-section-box">
            <h3>⏱️ Límite Diario de Pantalla</h3>
            <p class="config-desc">Establece el tiempo máximo en minutos que el niño puede usar la aplicación por día.</p>
            <div class="limit-slider-wrap">
              <div class="slider-val-display"><strong id="limit-slider-val">${settings.dailyLimitMinutes}</strong> minutos por día</div>
              <input type="range" min="15" max="120" step="5" value="${settings.dailyLimitMinutes}" id="daily-limit-input" oninput="window.kiddoParental.updateDailyLimit(this.value)" class="kiddo-range-slider">
              <div class="slider-marks">
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m</span>
                <span>90m</span>
                <span>120m</span>
              </div>
            </div>
          </div>

          <div class="parent-section-box">
            <h3>🕒 Horarios Permitidos de Uso</h3>
            <p class="config-desc">La app bloqueará automáticamente el acceso fuera de esta franja horaria.</p>
            <div class="time-range-controls">
              <div class="time-input-group">
                <label>Hora de inicio:</label>
                <input type="time" value="${settings.allowedTimeRange.start}" class="kiddo-time-input" onchange="window.kiddoParental.updateTimeRange('start', this.value)">
              </div>
              <div class="time-input-group">
                <label>Hora de término:</label>
                <input type="time" value="${settings.allowedTimeRange.end}" class="kiddo-time-input" onchange="window.kiddoParental.updateTimeRange('end', this.value)">
              </div>
            </div>
          </div>
        </div>

        <!-- 3. PESTAÑA: PERMISOS Y CONTENIDOS -->
        <div id="ptab-permissions" class="parent-tab-content">
          <div class="parent-section-box">
            <h3>🗂️ Secciones Permitidas</h3>
            <p class="config-desc">Habilita o deshabilita secciones de la aplicación según la edad del niño.</p>
            <div class="toggles-list">
              <div class="toggle-item">
                <div class="toggle-label">
                  <strong>Juegos Educativos</strong>
                  <small>Matemáticas, memoria y lectoescritura</small>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" ${settings.enableGames ? 'checked' : ''} onchange="window.kiddoParental.toggleSection('enableGames', this.checked)">
                  <span class="slider-round"></span>
                </label>
              </div>

              <div class="toggle-item">
                <div class="toggle-label">
                  <strong>Cuentos Infantiles</strong>
                  <small>Lectura ilustrada y narración por voz</small>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" ${settings.enableStories ? 'checked' : ''} onchange="window.kiddoParental.toggleSection('enableStories', this.checked)">
                  <span class="slider-round"></span>
                </label>
              </div>

              <div class="toggle-item">
                <div class="toggle-label">
                  <strong>Música y Piano</strong>
                  <small>Sonidos relajantes y piano virtual</small>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" ${settings.enableMusic ? 'checked' : ''} onchange="window.kiddoParental.toggleSection('enableMusic', this.checked)">
                  <span class="slider-round"></span>
                </label>
              </div>

              <div class="toggle-item">
                <div class="toggle-label">
                  <strong>Videos Infantiles</strong>
                  <small>Enlaces a videos supervisados de YouTube</small>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" ${settings.enableVideos ? 'checked' : ''} onchange="window.kiddoParental.toggleSection('enableVideos', this.checked)">
                  <span class="slider-round"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="parent-section-box">
            <h3>🔑 Cambiar Contraseña Parental</h3>
            <div class="change-pin-row">
              <input type="password" maxlength="4" placeholder="Nuevo PIN (4 dígitos)" id="new-parent-pin" class="kiddo-text-input">
              <button class="kiddo-btn-action" onclick="window.kiddoParental.changePin()">Actualizar PIN</button>
            </div>
          </div>
        </div>

        <!-- 4. PESTAÑA: VINCULACIÓN ENTRE DISPOSITIVOS Y SINCRONIZACIÓN -->
        <div id="ptab-sync" class="parent-tab-content">
          <div class="parent-section-box">
            <h3>📲 Vinculación de Dispositivos (Padre ↔ Niño)</h3>
            <p class="config-desc">
              Esta arquitectura permite sincronizar en tiempo real los límites, permisos y supervisión entre el dispositivo del niño y el de los padres.
            </p>

            <div class="device-pairing-card">
              <div class="device-qr-mock">
                <div class="qr-box">
                  <div class="qr-pattern"></div>
                  <span class="qr-sub">KIDDO-SYNC</span>
                </div>
              </div>
              <div class="device-info-col">
                <span class="sync-status-badge online">● Conectado y Sincronizado</span>
                <div class="device-code-box">
                  <label>Código de Vinculación:</label>
                  <div class="sync-code-val">${user.deviceSyncCode}</div>
                </div>
                <p class="device-meta">
                  Dispositivo de padres vinculado: <strong>${user.pairedParentDevice}</strong><br>
                  Última sincronización: <strong>${user.lastSync}</strong>
                </p>
                <button class="sync-now-btn" onclick="window.kiddoParental.triggerSyncSimulation()">
                  <span class="sync-icon">🔄</span>
                  <span>Sincronizar Cambios Ahora</span>
                </button>
              </div>
            </div>

            <div id="sync-toast-alert" class="sync-toast-banner" style="display: none;">
              ✅ ¡Configuraciones sincronizadas automáticamente con el dispositivo del niño!
            </div>
          </div>
        </div>
      </div>
    `;
  }

  switchParentTab(button, tabId) {
    document.querySelectorAll('.parent-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.parent-tab-content').forEach(tab => tab.classList.remove('active'));

    button.classList.add('active');
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
  }

  updateDailyLimit(val) {
    KIDDO_DATA.parentalSettings.dailyLimitMinutes = parseInt(val);
    const display = document.getElementById('limit-slider-val');
    if (display) display.textContent = val;
  }

  updateTimeRange(type, val) {
    KIDDO_DATA.parentalSettings.allowedTimeRange[type] = val;
  }

  toggleSection(key, isEnabled) {
    KIDDO_DATA.parentalSettings[key] = isEnabled;
  }

  changePin() {
    const input = document.getElementById('new-parent-pin');
    if (input && input.value.length === 4) {
      KIDDO_DATA.user.parentPin = input.value;
      alert('¡Contraseña parental actualizada con éxito!');
      input.value = '';
    } else {
      alert('La contraseña debe tener exactamente 4 dígitos.');
    }
  }

  triggerSyncSimulation() {
    const toast = document.getElementById('sync-toast-alert');
    if (toast) {
      toast.style.display = 'block';
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3500);
    }
  }
}

window.kiddoParental = new KiddoParentalManager();
