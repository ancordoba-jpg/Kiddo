/**
 * Orquestador Principal de Kiddo: Router, Vistas, Navegación y Eventos
 */

class KiddoApp {
  constructor() {
    this.currentScreen = 'inicio';
    // Estado de sesión: false por defecto salvo que exista sesión activa en sessionStorage
    let hasSession = false;
    try {
      hasSession = sessionStorage.getItem('kiddo_session_active') === 'true';
    } catch (e) {
      hasSession = false;
    }
    this.isAuthenticated = hasSession;
    this.todayDateStr = this.getLocalDateString();
    this.screenTimeSeconds = this.loadScreenTimeForToday();
    this.isLockedOut = false;
    this.lockoutReason = null;
    this.screenTimeTimer = null;
    this.activeMusicTab = 'crear';
    this.activeRelaxingTrackId = null;
    this.activeVideoCategoryView = null;
    this.activeVideoPlayer = null;
  }

  init() {
    try {
      this.setupEventListeners();
      this.startScreenTimeTracker();

      // Soporte para acceso directo por parámetro de URL (útil para pruebas en formato móvil)
      const urlParams = new URLSearchParams(window.location.search);
      const testScreen = urlParams.get('screen') || urlParams.get('test');
      if (testScreen) {
        this.isAuthenticated = true;
        const loginScreen = document.getElementById('screen-login');
        if (loginScreen) {
          loginScreen.classList.remove('active');
          loginScreen.classList.add('hidden');
          loginScreen.style.display = 'none';
        }
        const mainApp = document.getElementById('main-app-container');
        if (mainApp) {
          mainApp.classList.remove('hidden');
          mainApp.style.display = 'flex';
        }
        this.navigateTo(testScreen);
        if (urlParams.get('wardrobe') === 'open') {
          setTimeout(() => this.togglePukyWardrobe(), 300);
        }
        return;
      }

      // Estado inicial: evaluar si está autenticado
      if (!this.isAuthenticated) {
        this.showLoginScreen();
      } else {
        const loginScreen = document.getElementById('screen-login');
        if (loginScreen) {
          loginScreen.classList.remove('active');
          loginScreen.classList.add('hidden');
          loginScreen.style.display = 'none';
        }
        const mainApp = document.getElementById('main-app-container');
        if (mainApp) {
          mainApp.classList.remove('hidden');
          mainApp.style.display = 'flex';
        }
        this.navigateTo('inicio');
      }
    } catch (e) {
      console.error("Error al inicializar KiddoApp:", e);
    }
  }

  setupEventListeners() {
    // Vincular botones de la barra de navegación inferior
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = btn.getAttribute('data-screen');
        if (screen) {
          if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
          this.navigateTo(screen);
        }
      });
    });

    // Formulario de registro
    const regForm = document.getElementById('registration-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegistration(e);
      });
    }
  }

  showLoginScreen() {
    this.isAuthenticated = false;
    const loginScreen = document.getElementById('screen-login');
    const mainApp = document.getElementById('main-app-container');

    if (loginScreen) {
      loginScreen.classList.remove('hidden');
      loginScreen.classList.add('active');
      loginScreen.style.display = 'flex';
    }
    if (mainApp) {
      mainApp.classList.add('hidden');
      mainApp.style.display = 'none';
    }

    const pukyContainer = document.getElementById('login-puky-container');
    if (pukyContainer && window.puky3D) {
      setTimeout(() => {
        window.puky3D.initLoginPuky(pukyContainer);
      }, 50);
    }
  }

  logout() {
    this.isAuthenticated = false;
    try {
      sessionStorage.removeItem('kiddo_session_active');
    } catch (err) { }

    if (window.kiddoAudio && typeof window.kiddoAudio.pauseCurrentTrack === 'function') {
      window.kiddoAudio.pauseCurrentTrack();
    }
    if (typeof this.closeVideoModal === 'function') {
      this.closeVideoModal();
    }

    document.querySelectorAll('.kiddo-screen').forEach(screen => {
      screen.classList.remove('active');
      screen.style.display = 'none';
    });

    this.showLoginScreen();
  }

  handleRegistration(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('reg-name');
    const birthdateInput = document.getElementById('reg-birthdate');
    const pinInput = document.getElementById('reg-pin');

    const name = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
    const birthdate = (birthdateInput && birthdateInput.value) ? birthdateInput.value : '';
    const pin = (pinInput && pinInput.value) ? pinInput.value.trim() : '';

    if (!name || !birthdate || !pin) {
      alert('Completa el nombre, la fecha de nacimiento y la contraseña para ingresar.');
      return;
    }

    // Guardar datos
    KIDDO_DATA.user.name = name;
    KIDDO_DATA.user.birthdate = birthdate;
    KIDDO_DATA.user.parentPin = pin;
    KIDDO_DATA.user.registered = true;
    this.isAuthenticated = true;
    try {
      sessionStorage.setItem('kiddo_session_active', 'true');
    } catch (err) { }
    this.currentVideoAge =
      typeof this.getInitialAgeGroup === 'function'
        ? this.getInitialAgeGroup()
        : null;

    if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();

    if (window.kiddoMissions) {
      window.kiddoMissions.loadOrInitializeState();
    }

    // 1. Ocultar completamente la pantalla de registro
    const loginScreen = document.getElementById('screen-login');
    if (loginScreen) {
      loginScreen.classList.remove('active');
      loginScreen.classList.add('hidden');
      loginScreen.style.display = 'none';
    }

    // 2. Mostrar contenedor principal
    const mainApp = document.getElementById('main-app-container');
    if (mainApp) {
      mainApp.classList.remove('hidden');
      mainApp.style.display = 'flex';
    }

    // 3. Entrar a Inicio
    this.navigateTo('inicio');
  }

  navigateTo(screenName) {
    // Si aún no está autenticado y no es login, redirigir a login
    if (!this.isAuthenticated && screenName !== 'login') {
      this.showLoginScreen();
      return;
    }

    // Si salimos del lector de cuentos a otra sección, cerrarlo
    if (screenName !== 'cuentos' && window.kiddoStories) {
      window.kiddoStories.closeReader();
    }

    // Si salimos de la sección Puky a otra sección, cerrar vestidor de forma consistente
    if (screenName !== 'puky') {
      this.closePukyWardrobe();
    }

    // Si salimos de la sección Música a otra sección, pausar música relajante
    if (screenName !== 'musica') {
      this.stopAllRelaxingMusic();
    }

    // Si salimos de la sección Videos a otra sección, cerrar modal de video
    if (screenName !== 'videos') {
      this.closeVideoModal();
    }

    // Si salimos de la sección Ajustes a otra sección, revocar sesión parental inmediatamente
    if (screenName !== 'ajustes' && window.kiddoParental) {
      window.kiddoParental.lockParentalMode();
    }

    // Si Kiddo está bloqueado por tiempo o horario, impedir cambiar a actividades infantiles
    if (this.isLockedOut && screenName !== 'ajustes') {
      if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
      this.triggerLockout(this.lockoutReason || 'limit');
      return;
    }

    // Ocultar todas las pantallas principales
    document.querySelectorAll('.kiddo-screen').forEach(screen => {
      screen.classList.remove('active');
      screen.style.display = 'none';
    });

    // Actualizar estado visual de la barra de navegación (8 pestañas)
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-screen') === screenName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.currentScreen = screenName;
    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      targetScreen.style.display = 'block';
    }

    // Gestionar clase de viewport específica para Puky y Música (fija entre header y nav)
    const appViewport = document.getElementById('app-viewport');
    if (appViewport) {
      if (screenName === 'puky') {
        appViewport.classList.add('viewport-puky');
      } else {
        appViewport.classList.remove('viewport-puky');
      }
      if (screenName === 'musica') {
        appViewport.classList.add('viewport-musica');
      } else {
        appViewport.classList.remove('viewport-musica');
      }
    }

    // Renderizado bajo demanda según sección
    switch (screenName) {
      case 'inicio':
        this.renderHomeScreen();
        break;
      case 'juegos':
        this.renderGamesScreen();
        break;
      case 'misiones':
        if (window.kiddoMissions) {
          window.kiddoMissions.render('missions-content-container');
        }
        break;
      case 'puky':
        this.renderPukyScreen();
        break;
      case 'musica':
        this.renderMusicScreen();
        break;
      case 'cuentos':
        if (window.kiddoStories) {
          window.kiddoStories.renderCatalog('stories-catalog-grid');
        }
        break;
      case 'videos':
        this.renderVideosScreen();
        break;
      case 'ajustes':
        if (window.kiddoParental) {
          window.kiddoParental.renderSettingsScreen();
        }
        break;
    }
  }

  // 7. SECCIÓN "INICIO"
  renderHomeScreen() {
    const welcomeHello = document.querySelector('.welcome-text-hello');
    if (welcomeHello) {
      welcomeHello.textContent = `¡Hola, ${KIDDO_DATA.user.name}!`;
    }

    // Montar Puky 2D oficial si aún no está montado
    const mount = document.getElementById('puky2d-mount');
    if (mount && window.puky2D && !document.getElementById('puky2d-img')) {
      window.puky2D.mountTo('puky2d-mount');
    }
  }

  openCategory(category) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    switch (category) {
      case 'animales':
        this.navigateTo('juegos');
        break;
      case 'juegos':
        this.navigateTo('juegos');
        break;
      case 'musica':
        this.navigateTo('musica');
        break;
      case 'cuentos':
        this.navigateTo('cuentos');
        break;
      case 'magia':
        this.navigateTo('puky');
        break;
      default:
        this.navigateTo(category);
    }
  }

  viewAllActivities() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.navigateTo('misiones');
  }

  // 8. SECCIÓN "JUEGOS" (Rediseño visual con tarjetas PNG oficiales)
  renderGamesScreen() {
    const container = document.getElementById('games-grid-container');
    if (!container) return;

    // Si existe el nuevo motor de juegos, usar la lista con tarjetas oficiales
    const gamesList = window.KIDDO_GAMES_LIST || [];
    if (gamesList.length > 0) {
      container.innerHTML = gamesList.map(game => `
        <button class="game-card-btn" onclick="${game.action}" aria-label="Jugar a ${game.name}" id="btn-game-${game.id}">
          <img src="${game.image || 'assets/games-redesign/card-' + game.id + '.png.png'}" alt="${game.name} - ${game.desc}" class="game-card-img" draggable="false">
        </button>
      `).join('');
      return;
    }

    // Fallback: lista antigua de KIDDO_DATA.games
    container.innerHTML = (KIDDO_DATA.games || []).map(game => `
      <button class="game-card-btn" onclick="window.kiddoApp.openGameModal('${game.id}')" aria-label="Jugar ${game.name}">
        <div class="game-card-name" style="padding: 16px; font-weight: bold;">${game.name}</div>
      </button>
    `).join('');
  }

  openGameModal(gameId) {
    // Si el nuevo motor tiene ese juego, lanzarlo directamente
    if (window.kiddoGames) {
      const gameMap = {
        'game-memory': 'openMemory',
        'game-sums': 'openSums',
        'game-subtraction': 'openSubtraction',
        'game-multiplication': 'openMultiplication',
        'game-division': 'openDivision',
        'game-clock': 'openClock',
        'game-syllables': 'openSyllables',
        'game-wordbuilder': 'openWordBuilder',
        'memory': 'openMemory',
        'sumas': 'openSums',
      };
      const method = gameMap[gameId];
      if (method && typeof window.kiddoGames[method] === 'function') {
        window.kiddoGames[method]();
        return;
      }
    }

    // Fallback al modal preview antiguo
    const game = (KIDDO_DATA.games || []).find(g => g.id === gameId);
    if (!game) return;
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const modal = document.getElementById('game-preview-modal');
    if (modal) {
      const iconEl = document.getElementById('modal-game-icon');
      const titleEl = document.getElementById('modal-game-title');
      const descEl = document.getElementById('modal-game-desc');
      const catEl = document.getElementById('modal-game-category');
      if (iconEl) iconEl.textContent = game.icon;
      if (titleEl) titleEl.textContent = game.name;
      if (descEl) descEl.textContent = game.description;
      if (catEl) catEl.textContent = game.category;
      modal.classList.add('active');
    }
  }


  closeGameModal() {
    const modal = document.getElementById('game-preview-modal');
    if (modal) modal.classList.remove('active');
  }

  // 10. SECCIÓN "PUKY"

  renderPukyScreen() {
    const container = document.getElementById('puky-3d-room-canvas');
    if (!container) return;

    // Evitar duplicar a Puky al regresar a esta pantalla.
    if (container.querySelector('#puky-room-2d')) return;

    container.replaceChildren();

    // Layout del canvas: flex centrado en la base
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-end';
    container.style.boxSizing = 'border-box';

    // Wrapper relativo: mismo tamaño visual que Puky.
    // Es el sistema de coordenadas compartido entre el personaje y sus prendas.
    const wrap = document.createElement('div');
    wrap.id = 'puky-outfit-wrap';
    wrap.style.cssText = [
      'position:relative',
      'width:auto',
      'height:100%',
      'max-height:100%',
      'max-width:60%',
      'flex-shrink:0',
      'display:flex',
      'align-items:flex-end',
      'justify-content:center'
    ].join(';');

    const puky = document.createElement('img');
    puky.id = 'puky-room-2d';
    puky.src = 'assets/puky2d/frames/puky-idle.png.png';
    puky.alt = 'Puky, mascota oficial de Kiddo';
    puky.draggable = false;
    puky.style.cssText = [
      'display:block',
      'width:auto',
      'height:100%',
      'max-height:100%',
      'max-width:100%',
      'object-fit:contain',
      'position:relative',
      'z-index:1'
    ].join(';');

    wrap.appendChild(puky);
    container.appendChild(wrap);

    // Montar capas de prendas dentro del wrapper (mismo bounding box que Puky)
    if (window.pukyWardrobe) {
      window.pukyWardrobe.mountLayers('puky-outfit-wrap');
    }

    // Reaccionar cuando el usuario acaricia a Puky
    let pettingTimer = null;
    puky.style.cursor = 'pointer';
    puky.style.touchAction = 'manipulation';

    puky.addEventListener('click', () => {
      if (pettingTimer) clearTimeout(pettingTimer);
      puky.src = 'assets/puky2d/frames/puky-petting.png.png';
      pettingTimer = setTimeout(() => {
        puky.src = 'assets/puky2d/frames/puky-idle.png.png';
        pettingTimer = null;
      }, 1500);
    });

  }

  // ── VESTIDOR DE PUKY (panel integrado en pantalla) ──────────────────
  openPukyWardrobe() {
    const panel = document.getElementById('puky-wardrobe-inline');
    const btn   = document.getElementById('puky-btn-vestimenta');
    const scene = document.getElementById('puky-scene-wrapper');
    if (!panel) return;

    if (window.pukyWardrobe) {
      const layerContainer = document.getElementById('puky-outfit-wrap') || document.getElementById('puky-3d-room-canvas');
      if (layerContainer) window.pukyWardrobe.mountLayers(layerContainer.id);
      window.pukyWardrobe.renderWardrobe();
    }
    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
    if (btn) btn.style.background = '#D1FAE5';
    if (scene) scene.classList.add('wardrobe-active');
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  }

  closePukyWardrobe() {
    const panel = document.getElementById('puky-wardrobe-inline');
    const btn   = document.getElementById('puky-btn-vestimenta');
    const scene = document.getElementById('puky-scene-wrapper');
    if (panel) {
      panel.classList.remove('visible');
      panel.setAttribute('aria-hidden', 'true');
    }
    if (btn) {
      btn.style.background = '#F0FDF4';
    }
    if (scene) {
      scene.classList.remove('wardrobe-active');
    }
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  }

  togglePukyWardrobe() {
    const panel = document.getElementById('puky-wardrobe-inline');
    if (!panel) return;
    const isVisible = panel.classList.contains('visible');
    if (isVisible) {
      this.closePukyWardrobe();
    } else {
      this.openPukyWardrobe();
    }
  }

  openPukyCustomization() {
    // Delegar al panel integrado si existe, sino fallback al modal
    if (document.getElementById('puky-wardrobe-inline')) {
      this.togglePukyWardrobe();
    } else {
      const modal = document.getElementById('puky-custom-modal');
      if (modal) { this.renderPukyCustomizationContent(); modal.classList.add('active'); }
    }
  }

  renderPukyCustomizationContent() {
    const cust = KIDDO_DATA.pukyCustomization;
    const container = document.getElementById('puky-custom-options');
    if (!container) return;

    container.innerHTML = `
      <div class="custom-category">
        <h4>👕 Ropa y Suéteres</h4>
        <div class="custom-items-row">
          ${cust.outfits.map(o => `
            <button class="custom-item-btn ${o.active ? 'selected' : ''}" onclick="window.kiddoApp.selectCustomItem('outfit', '${o.id}', '${o.color}')">
              <span class="custom-icon">${o.icon}</span>
              <span class="custom-label">${o.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="custom-category">
        <h4>👓 Accesorios</h4>
        <div class="custom-items-row">
          ${cust.accessories.map(a => `
            <button class="custom-item-btn ${a.active ? 'selected' : ''}" onclick="window.kiddoApp.selectCustomItem('accessory', '${a.id}')">
              <span class="custom-icon">${a.icon}</span>
              <span class="custom-label">${a.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="custom-category">
        <h4>🎨 Color de Puky</h4>
        <div class="custom-colors-row">
          ${cust.colors.map(c => `
            <button class="custom-color-circle ${c.active ? 'selected' : ''}" style="background-color: ${c.hex};" title="${c.name}" onclick="window.kiddoApp.selectCustomItem('color', '${c.id}', '${c.hex}')">
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  selectCustomItem(category, itemId, metaColor) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const cust = KIDDO_DATA.pukyCustomization;

    if (category === 'outfit') {
      cust.outfits.forEach(o => o.active = (o.id === itemId));
      if (window.puky3D) window.puky3D.updateCustomization('outfit', metaColor);
    } else if (category === 'accessory') {
      cust.accessories.forEach(a => a.active = (a.id === itemId));
      const isGlasses = (itemId === 'acc-glasses');
      if (window.puky3D) window.puky3D.updateCustomization('accessory', isGlasses ? 'glasses' : 'none');
    } else if (category === 'color') {
      cust.colors.forEach(c => c.active = (c.id === itemId));
      if (window.puky3D) window.puky3D.updateCustomization('fur', metaColor);
    }

    this.renderPukyCustomizationContent();
  }

  closePukyCustomModal() {
    const modal = document.getElementById('puky-custom-modal');
    if (modal) modal.classList.remove('active');
  }

  openPukyChat() {
    // Delegar al módulo pukyChat si está disponible
    if (window.pukyChat) {
      window.pukyChat.open();
      return;
    }
    // Fallback legacy
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const modal = document.getElementById('puky-chat-modal');
    if (modal) { modal.classList.add('active'); this.initChatMessages(); }
  }

  initChatMessages() {
    const list = document.getElementById('puky-chat-messages');
    if (list && list.children.length === 0) {
      const greeting = KIDDO_DATA.chatWithPuky.greetings[0];
      list.innerHTML = `
        <div class="chat-msg puky-msg">
          <div class="msg-avatar">🐨</div>
          <div class="msg-bubble">${greeting}</div>
        </div>
      `;
    }
  }

  sendChatMessage(customText) {
    const input = document.getElementById('puky-chat-input');
    const text = customText || (input ? input.value.trim() : '');
    if (!text) return;

    if (input) input.value = '';

    const list = document.getElementById('puky-chat-messages');
    if (!list) return;

    list.innerHTML += `
      <div class="chat-msg user-msg">
        <div class="msg-bubble">${text}</div>
        <div class="msg-avatar">👦</div>
      </div>
    `;
    list.scrollTop = list.scrollHeight;

    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();

    setTimeout(() => {
      const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let reply = KIDDO_DATA.chatWithPuky.defaultResponse;

      for (let key in KIDDO_DATA.chatWithPuky.responses) {
        if (cleanText.includes(key)) {
          reply = KIDDO_DATA.chatWithPuky.responses[key];
          break;
        }
      }

      list.innerHTML += `
        <div class="chat-msg puky-msg">
          <div class="msg-avatar">🐨</div>
          <div class="msg-bubble">${reply}</div>
        </div>
      `;
      list.scrollTop = list.scrollHeight;
      if (window.puky3D) window.puky3D.triggerPukyJoyJump();
    }, 600);
  }

  closePukyChatModal() {
    const modal = document.getElementById('puky-chat-modal');
    if (modal) modal.classList.remove('active');
  }

  openPukyPlaceholderSlot(slotNumber) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    alert(`Espacio ${slotNumber} preparado: Aquí se integrará una nueva funcionalidad para Puky.`);
  }

  // 11. SECCIÓN "MÚSICA"
  renderMusicScreen() {
    this.switchMusicCategory(this.activeMusicTab);
  }

  switchMusicCategory(tabKey) {
    if (this.activeMusicTab === 'relajante' && tabKey !== 'relajante') {
      this.stopAllRelaxingMusic();
    }
    this.activeMusicTab = tabKey;
    document.querySelectorAll('.music-subtab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const contentBox = document.getElementById('music-tab-content');
    if (!contentBox) return;

    if (tabKey === 'relajante') {
      contentBox.innerHTML = `
        <div class="music-relaxing-container">
          <!-- Banner Hero Relajante -->
          <div class="relax-hero-banner" role="img" aria-label="Puky descansando relajado">
            <img src="assets/musica/relajante/fondo-relajante.png" alt="Puky descansando en una nube suave" class="relax-hero-img" />
          </div>

          <!-- Contenedor invisible para reproductor YouTube embebido (una sola pista activa) -->
          <div id="relaxing-yt-player-container" aria-hidden="true" style="display:none;"></div>

          <!-- Lista vertical de las 4 tarjetas relajantes con iconos 3D -->
          <div class="music-relaxing-grid">
            ${KIDDO_DATA.music.relaxing.map(track => {
              const isPlaying = this.activeRelaxingTrackId === track.id;
              return `
                <div class="relax-track-card ${isPlaying ? 'is-playing' : ''}"
                     id="track-${track.id}"
                     style="background: ${track.color}; border: 2px solid ${track.borderColor};"
                     onclick="window.kiddoApp.toggleRelaxingTrack('${track.id}')">
                  
                  <div class="relax-track-icon-wrap" style="border: 1.5px solid ${track.borderColor};">
                    <img src="${track.iconImage}" alt="${track.title}" class="relax-track-icon-img" />
                  </div>
                  
                  <div class="relax-track-info">
                    <div class="relax-card-header-row">
                      <span class="relax-instrument-tag" style="color: ${track.tagColor}; background: ${track.tagBg};">
                        ${track.instrument}
                      </span>
                    </div>
                    <h3 class="relax-track-title">${track.title}</h3>
                    <p class="relax-track-desc">${track.description}</p>
                  </div>

                  <div class="relax-play-indicator">
                    <button class="relax-listen-btn ${isPlaying ? 'is-playing' : ''}"
                            id="btn-play-${track.id}"
                            onclick="event.stopPropagation(); window.kiddoApp.toggleRelaxingTrack('${track.id}')"
                            aria-label="${isPlaying ? 'Pausar' : 'Escuchar'} ${track.title}">
                      <span class="btn-play-icon">${isPlaying ? '⏸' : '▶'}</span>
                      <span class="btn-play-text">${isPlaying ? 'Pausar' : 'Escuchar'}</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (tabKey === 'crear') {
      contentBox.innerHTML = `
        <div class="virtual-piano-experience" aria-label="Escenario musical de Puky">
          <div class="piano-puky-banner" role="status" aria-live="polite">
            <span class="piano-banner-avatar" aria-hidden="true">🐨</span>
            <span class="piano-banner-text">¡Toca las teclas de colores para crear una linda canción conmigo! 🎵✨</span>
          </div>

          <div class="piano-notes-fx-layer" id="piano-notes-fx-layer" aria-hidden="true"></div>

          <span id="piano-puky-face" style="display:none;" aria-hidden="true"></span>
          <div class="piano-keyboard-wrapper">
            <div class="piano-keys-container" role="region" aria-label="Teclado del piano virtual">
              <button class="piano-key key-c" onclick="window.kiddoApp.playKeyNote('DO', this)" aria-label="Nota DO">
                <span class="key-note-name">DO</span>
                <span class="key-color-dot" style="background: #F87171;"></span>
              </button>
              <button class="piano-key key-d" onclick="window.kiddoApp.playKeyNote('RE', this)" aria-label="Nota RE">
                <span class="key-note-name">RE</span>
                <span class="key-color-dot" style="background: #FB923C;"></span>
              </button>
              <button class="piano-key key-e" onclick="window.kiddoApp.playKeyNote('MI', this)" aria-label="Nota MI">
                <span class="key-note-name">MI</span>
                <span class="key-color-dot" style="background: #FACC15;"></span>
              </button>
              <button class="piano-key key-f" onclick="window.kiddoApp.playKeyNote('FA', this)" aria-label="Nota FA">
                <span class="key-note-name">FA</span>
                <span class="key-color-dot" style="background: #4ADE80;"></span>
              </button>
              <button class="piano-key key-g" onclick="window.kiddoApp.playKeyNote('SOL', this)" aria-label="Nota SOL">
                <span class="key-note-name">SOL</span>
                <span class="key-color-dot" style="background: #38BDF8;"></span>
              </button>
              <button class="piano-key key-a" onclick="window.kiddoApp.playKeyNote('LA', this)" aria-label="Nota LA">
                <span class="key-note-name">LA</span>
                <span class="key-color-dot" style="background: #818CF8;"></span>
              </button>
              <button class="piano-key key-b" onclick="window.kiddoApp.playKeyNote('SI', this)" aria-label="Nota SI">
                <span class="key-note-name">SI</span>
                <span class="key-color-dot" style="background: #C084FC;"></span>
              </button>
              <button class="piano-key key-c-high" onclick="window.kiddoApp.playKeyNote('DO-HIGH', this)" aria-label="Nota DO Agudo">
                <span class="key-note-name">DO 🌟</span>
                <span class="key-color-dot" style="background: #F472B6;"></span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (tabKey === 'infantil') {
      const accentMap = {
        'pink': '#F9A8D4', 'blue': '#93C5FD', 'purple': '#C4B5FD',
        'yellow': '#FDE68A', 'green': '#6EE7B7', 'orange': '#FDBA74',
        'mint': '#A7F3D0', 'lavender': '#DDD6FE', 'sky': '#BAE6FD', 'peach': '#FCA5A5'
      };
      contentBox.innerHTML = `
        <div class="infantil-music-container">
          <!-- Hero banner superior -->
          <div class="infantil-hero-banner" role="img" aria-label="Puky con notas musicales">
            <img src="assets/musica/infantil/fondo-infantil.png.png"
                 onerror="this.src='assets/musica/infantil/fondo-infantil.png'"
                 alt="Puky sosteniendo baquetas entre notas musicales"
                 class="infantil-hero-img" />
          </div>

          <!-- Lista de canciones -->
          <div class="infantil-songs-list">
            ${KIDDO_DATA.music.children.map(song => `
              <div class="infantil-song-card" id="infantil-card-${song.id}"
                   onclick="window.kiddoApp.openInfantilVideo('${song.videoId}', '${song.title.replace(/'/g, "&#39;")}')"
                   style="--card-accent: ${song.accent};">
                <div class="infantil-thumbnail-wrap">
                  <img
                    src="${song.thumbnail}"
                    alt="Miniatura de ${song.title}"
                    class="infantil-thumbnail"
                    loading="lazy"
                    onerror="this.style.display='none'; this.parentElement.style.background='${song.accent}';"
                  />
                  <div class="infantil-thumb-overlay">
                    <span class="infantil-thumb-play-icon" aria-hidden="true">▶</span>
                  </div>
                </div>
                <div class="infantil-song-info">
                  <span class="infantil-yt-badge" aria-label="YouTube Kids">▶ YouTube</span>
                  <h3 class="infantil-song-title">${song.title}</h3>
                  <span class="infantil-song-artist">🎵 ${song.artist}</span>
                  <p class="infantil-song-desc">${song.description}</p>
                </div>
                <button class="infantil-play-btn"
                        onclick="event.stopPropagation(); window.kiddoApp.openInfantilVideo('${song.videoId}', '${song.title.replace(/'/g, "&#39;")}')"
                        aria-label="Reproducir ${song.title}">
                  <span class="infantil-play-btn-icon">▶</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Modal interno reproductor -->
        <div id="infantil-video-modal" class="infantil-modal-overlay" style="display:none;" role="dialog" aria-modal="true" aria-label="Reproductor de video">
          <div class="infantil-modal-box">
            <div class="infantil-modal-header">
              <h2 class="infantil-modal-title" id="infantil-modal-title">Video</h2>
              <button class="infantil-modal-close-btn" onclick="window.kiddoApp.closeInfantilModal()" aria-label="Cerrar video">✕</button>
            </div>
            <div class="infantil-iframe-wrap">
              <iframe
                id="infantil-yt-iframe"
                src=""
                title="Reproductor de video infantil"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="infantil-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      `;
    }
  }

  playKeyNote(noteKey, keyBtn) {
    if (window.kiddoAudio) {
      window.kiddoAudio.playPianoNote(noteKey);
    }

    if (keyBtn) {
      keyBtn.classList.add('is-pressed');
      setTimeout(() => keyBtn.classList.remove('is-pressed'), 250);
      this.spawnFloatingNote(noteKey, keyBtn);
    }

    const pukyFace = document.getElementById('piano-puky-face');
    if (pukyFace) {
      pukyFace.classList.add('jump-bounce');
      setTimeout(() => pukyFace.classList.remove('jump-bounce'), 400);
    }
  }

  spawnFloatingNote(noteKey, keyBtn) {
    const fxLayer = document.getElementById('piano-notes-fx-layer');
    if (!fxLayer || !keyBtn) return;

    const symbols = ['♪', '♫', '♬', '♩', '✨'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const colorMap = {
      'DO': '#EF4444',
      'RE': '#F97316',
      'MI': '#F59E0B',
      'FA': '#10B981',
      'SOL': '#0EA5E9',
      'LA': '#6366F1',
      'SI': '#A855F7',
      'DO-HIGH': '#EC4899'
    };
    const color = colorMap[noteKey] || '#A855F7';

    const stage = fxLayer.closest('.virtual-piano-experience');
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const keyRect = keyBtn.getBoundingClientRect();

    // Posición en la parte superior central de la tecla presionada
    const spawnX = (keyRect.left - stageRect.left) + (keyRect.width / 2) + (Math.random() * 16 - 8);
    const spawnY = (keyRect.top - stageRect.top) - 10;

    // Desplazamiento horizontal aleatorio sutil (-22px a +22px) y rotación
    const driftX = Math.round(Math.random() * 44 - 22);
    const rotate = Math.round(Math.random() * 28 - 14);

    const noteEl = document.createElement('span');
    noteEl.className = 'floating-music-note';
    noteEl.textContent = symbol;
    noteEl.style.left = `${spawnX}px`;
    noteEl.style.top = `${spawnY}px`;
    noteEl.style.color = color;
    noteEl.style.textShadow = `0 2px 8px ${color}88, 0 1px 2px rgba(255,255,255,0.9)`;
    noteEl.style.setProperty('--drift-x', `${driftX}px`);
    noteEl.style.setProperty('--note-rotate', `${rotate}deg`);

    fxLayer.appendChild(noteEl);

    // Limpieza automática al finalizar la animación (o timeout de seguridad)
    const cleanup = () => {
      if (noteEl.parentNode) {
        noteEl.parentNode.removeChild(noteEl);
      }
    };
    noteEl.addEventListener('animationend', cleanup, { once: true });
    setTimeout(cleanup, 1500);
  }

  toggleRelaxingTrack(trackId) {
    const track = KIDDO_DATA.music.relaxing.find(t => t.id === trackId);
    if (!track) return;

    // Si la misma pista ya está sonando, pausarla/detenerla
    if (this.activeRelaxingTrackId === trackId) {
      this.stopAllRelaxingMusic();
      return;
    }

    // Detener cualquier otra pista antes de iniciar la nueva
    this.stopAllRelaxingMusic();

    // Activar nueva pista
    this.activeRelaxingTrackId = trackId;

    if (track.audioMode === 'synth') {
      // Arpa de las Estrellas (sintetizador nativo suave de audio.js)
      if (window.kiddoAudio) {
        window.kiddoAudio.playRelaxingTrack(trackId);
      }
    } else if (track.audioMode === 'youtube' && track.videoId) {
      // Reproducción interna YouTube (Piano de las Nubes, Violín de la Brisa, Lluvia en el Bosque)
      const ytBox = document.getElementById('relaxing-yt-player-container');
      if (ytBox) {
        ytBox.innerHTML = `
          <iframe
            id="relax-yt-iframe"
            src="https://www.youtube-nocookie.com/embed/${track.videoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1"
            title="${track.title}"
            style="display:none; width:1px; height:1px; border:none;"
            allow="autoplay; encrypted-media"
            aria-hidden="true">
          </iframe>
        `;
      }
    }

    // Actualizar estados visuales de tarjetas y botones
    document.querySelectorAll('.relax-track-card').forEach(c => c.classList.remove('is-playing'));
    document.querySelectorAll('.relax-listen-btn').forEach(b => {
      b.classList.remove('is-playing');
      b.innerHTML = '<span class="btn-play-icon">▶</span> <span class="btn-play-text">Escuchar</span>';
    });

    const card = document.getElementById(`track-${trackId}`);
    const btn = document.getElementById(`btn-play-${trackId}`);
    if (card) card.classList.add('is-playing');
    if (btn) {
      btn.classList.add('is-playing');
      btn.innerHTML = '<span class="btn-play-icon">⏸</span> <span class="btn-play-text">Pausar</span>';
    }
  }

  stopAllRelaxingMusic() {
    this.activeRelaxingTrackId = null;
    if (window.kiddoAudio) {
      window.kiddoAudio.stopRelaxingTrack();
    }
    const ytBox = document.getElementById('relaxing-yt-player-container');
    if (ytBox) {
      ytBox.innerHTML = '';
    }
    document.querySelectorAll('.relax-track-card').forEach(c => c.classList.remove('is-playing'));
    document.querySelectorAll('.relax-listen-btn').forEach(btn => {
      btn.classList.remove('is-playing');
      btn.innerHTML = '<span class="btn-play-icon">▶</span> <span class="btn-play-text">Escuchar</span>';
    });
  }

  // 13b. SECCIÓN MÚSICA > INFANTIL — Reproductor interno modal
  openInfantilVideo(videoId, title) {
    if (!videoId) return;
    const modal = document.getElementById('infantil-video-modal');
    const iframe = document.getElementById('infantil-yt-iframe');
    const titleEl = document.getElementById('infantil-modal-title');
    if (!modal || !iframe) return;

    if (titleEl) titleEl.textContent = title || 'Video';
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.src = embedUrl;
    modal.style.display = 'flex';

    // Cerrar al hacer click fuera del box
    modal.onclick = (e) => {
      if (e.target === modal) this.closeInfantilModal();
    };
  }

  closeInfantilModal() {
    const modal = document.getElementById('infantil-video-modal');
    const iframe = document.getElementById('infantil-yt-iframe');
    if (iframe) iframe.src = '';
    if (modal) modal.style.display = 'none';
  }

  // 14. SECCIÓN "VIDEOS" (Biblioteca Infantil: 4 Categorías, Carruseles y Reproducción Interna)
  renderVideosScreen() {
    const container = document.getElementById('videos-content-container');
    if (!container) return;

    const allItems = KIDDO_DATA.videos?.items || [];
    const categories = KIDDO_DATA.videos?.categories || [
      { id: 'aprender', name: 'Aprender', icon: '📚' },
      { id: 'entretenimiento', name: 'Entretenimiento', icon: '🍿' },
      { id: 'bailar', name: 'Bailar', icon: '🎵' },
      { id: 'crear', name: 'Crear', icon: '🎨' }
    ];

    // VISTA DETALLE: Si el usuario tocó "Ver todos" en una categoría
    if (this.activeVideoCategoryView) {
      const activeCat = categories.find(c => c.id === this.activeVideoCategoryView) || categories[0];
      const catVideos = allItems.filter(v => v.category === activeCat.id);

      container.innerHTML = `
        <div class="video-category-detail-view">
          <div class="video-detail-header">
            <button class="video-back-btn" onclick="window.kiddoApp.closeCategoryVideos()" aria-label="Volver a la biblioteca de videos">
              <span class="video-back-arrow">←</span>
              <span>Volver</span>
            </button>
            <div class="video-detail-title-wrap">
              <span class="video-cat-icon">${activeCat.icon}</span>
              <h2 class="video-detail-title">${activeCat.name}</h2>
              <span class="video-count-pill">${catVideos.length} videos</span>
            </div>
          </div>

          <div class="video-cards-grid" role="region" aria-label="Todos los videos de ${activeCat.name}">
            ${catVideos.map(v => this.renderVideoCardHtml(v)).join('')}
          </div>
        </div>
      `;
      return;
    }

    // VISTA PRINCIPAL: Las 4 categorías con carruseles horizontales
    container.innerHTML = `
      <div class="video-library-view">
        ${categories.map(cat => {
          const catVideos = allItems.filter(v => v.category === cat.id);
          return `
            <div class="video-category-section" id="video-section-${cat.id}">
              <div class="video-cat-header">
                <div class="video-cat-title-wrap">
                  <span class="video-cat-icon">${cat.icon}</span>
                  <h3>${cat.name}</h3>
                </div>
                <div class="video-cat-actions">
                  <button class="video-carousel-arrow prev" onclick="window.kiddoApp.scrollVideoCarousel('${cat.id}', -1)" aria-label="Desplazar a la izquierda en ${cat.name}" title="Anterior">‹</button>
                  <button class="video-carousel-arrow next" onclick="window.kiddoApp.scrollVideoCarousel('${cat.id}', 1)" aria-label="Desplazar a la derecha en ${cat.name}" title="Siguiente">›</button>
                  <button class="video-see-all-btn" onclick="window.kiddoApp.openCategoryVideos('${cat.id}')" title="Ver todos los videos de ${cat.name}">
                    <span>Ver todos</span>
                    <span class="see-all-arrow">&gt;</span>
                  </button>
                </div>
              </div>

              <div class="video-cards-carousel" id="carousel-${cat.id}" role="region" aria-label="Carrusel de videos ${cat.name}">
                ${catVideos.map(v => this.renderVideoCardHtml(v)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderVideoCardHtml(v) {
    return `
      <article class="video-card-item" onclick="window.kiddoApp.playVideo('${v.id}')" tabindex="0" role="button" aria-label="Reproducir ${v.title}">
        <div class="video-thumb-frame">
          <img src="${v.thumbnail}" alt="${v.title}" class="video-thumb-img" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg';">
          ${v.duration ? `<span class="video-duration-tag">${v.duration}</span>` : ''}
          <div class="video-play-overlay" aria-hidden="true">
            <span class="video-play-triangle">▶</span>
          </div>
        </div>
        <div class="video-item-meta">
          <h4 class="video-card-title">${v.title}</h4>
          ${v.channel ? `
            <div class="video-card-channel-row">
              <span class="video-channel-icon">📺</span>
              <p class="video-card-channel">${v.channel}</p>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  scrollVideoCarousel(catId, direction) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const carousel = document.getElementById(`carousel-${catId}`);
    if (carousel) {
      const scrollAmount = (carousel.clientWidth || 300) * 0.8 * direction;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  openCategoryVideos(categoryId) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.activeVideoCategoryView = categoryId;
    this.renderVideosScreen();
    const videosScreen = document.getElementById('screen-videos');
    if (videosScreen) {
      videosScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  closeCategoryVideos() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.activeVideoCategoryView = null;
    this.renderVideosScreen();
  }

  setVideoAgeFilter(ageGroup) {
    // Compatibilidad: la selección por edades ha sido eliminada por completo
  }

  playVideo(videoId) {
    const video = (KIDDO_DATA.videos?.items || []).find(v => v.id === videoId || v.videoId === videoId);
    if (!video) return;

    if (window.kiddoAudio) {
      window.kiddoAudio.playBubbleSound();
      if (typeof window.kiddoAudio.pauseCurrentTrack === 'function') {
        window.kiddoAudio.pauseCurrentTrack();
      }
    }

    const catBadge = document.getElementById('video-modal-category-tag');
    const titleEl = document.getElementById('video-modal-title');
    const channelEl = document.getElementById('video-modal-channel');
    const embedContainer = document.getElementById('video-embed-container');
    const modal = document.getElementById('kiddo-video-modal');

    const catLabels = {
      aprender: '📚 Aprender',
      entretenimiento: '🍿 Entretenimiento',
      bailar: '🎵 Bailar',
      crear: '🎨 Crear'
    };

    if (catBadge) {
      catBadge.textContent = catLabels[video.category] || '📺 Video';
    }
    if (titleEl) titleEl.textContent = video.title;
    if (channelEl) {
      channelEl.textContent = video.channel || 'Kiddo';
    }

    if (embedContainer) {
      // Inyección dinámica con YouTube No-Cookie
      embedContainer.innerHTML = `
        <iframe
          id="kiddo-active-video-player"
          src="https://www.youtube-nocookie.com/embed/${video.videoId}?playsinline=1&rel=0&autoplay=1"
          title="${video.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      `;
    }

    // Cuadro de ayuda en caso de que YouTube bloquee reproducción embebida
    let fallbackBox = document.getElementById('video-modal-fallback-box');
    if (!fallbackBox) {
      const footer = document.querySelector('.video-player-info-footer');
      if (footer) {
        fallbackBox = document.createElement('div');
        fallbackBox.id = 'video-modal-fallback-box';
        fallbackBox.className = 'video-fallback-box';
        footer.appendChild(fallbackBox);
      }
    }
    if (fallbackBox) {
      fallbackBox.innerHTML = `
        <span class="video-fallback-text">¿YouTube restringe este video en tu dispositivo?</span>
        <a href="${video.videoUrl || `https://www.youtube.com/watch?v=${video.videoId}`}" target="_blank" rel="noopener noreferrer" class="video-fallback-btn">
          <span>Abrir video original</span> ↗
        </a>
      `;
    }

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }

    // Registrar actividad en Kiddo
    this.addRecentActivity({
      type: 'video',
      icon: '📺',
      title: video.title,
      subtitle: `Visto en Videos (${video.channel || 'Kiddo'})`,
      color: '#A9DEF9'
    });
  }

  closeVideoModal() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();

    const embedContainer = document.getElementById('video-embed-container');
    if (embedContainer) {
      embedContainer.innerHTML = '';
    }

    const modal = document.getElementById('kiddo-video-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  openYoutubeLink(url) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    window.open(url, '_blank');
  }

  addRecentActivity(activity) {
    activity.id = 'act-' + Date.now();
    activity.time = 'Ahora mismo';
    KIDDO_DATA.recentActivities.unshift(activity);
    if (KIDDO_DATA.recentActivities.length > 5) {
      KIDDO_DATA.recentActivities.pop();
    }
  }

  getLocalDateString() {
    const d = new Date();
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${day}`;
  }

  loadScreenTimeForToday() {
    try {
      const todayStr = this.getLocalDateString();
      const key = `kiddo_time_used_${todayStr}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const sec = parseInt(saved, 10);
        return isNaN(sec) || sec < 0 ? 0 : sec;
      }
    } catch (e) {}
    return 0; // Sin datos guardados → 0 segundos (inicio de jornada limpia)
  }

  saveScreenTimeForToday() {
    try {
      const todayStr = this.getLocalDateString();
      const key = `kiddo_time_used_${todayStr}`;
      localStorage.setItem(key, this.screenTimeSeconds.toString());
    } catch (e) {}
  }

  isWithinSchedule(startStr, endStr) {
    if (!startStr || !endStr) return true;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const [sH, sM] = startStr.split(':').map(Number);
    const [eH, eM] = endStr.split(':').map(Number);
    const startMin = sH * 60 + (sM || 0);
    const endMin = eH * 60 + (eM || 0);

    if (startMin <= endMin) {
      // Franja horaria diurna, ej: 08:00 a 20:00
      return currentMin >= startMin && currentMin < endMin;
    } else {
      // Franja que cruza la medianoche, ej: 20:00 a 08:00
      return currentMin >= startMin || currentMin < endMin;
    }
  }

  evaluateUsageRestrictions() {
    const settings = KIDDO_DATA?.parentalSettings;
    if (!settings) return;

    const todayMinutes = Math.floor(this.screenTimeSeconds / 60);
    const limit = settings.dailyLimitMinutes || 0;
    // Fallback seguro: horario desactivado por defecto si el adulto no lo configuró
    const schedule = settings.allowedTimeRange || { start: '08:00', end: '20:00', enabled: false };

    const isLimitExceeded = limit > 0 && todayMinutes >= limit;
    const isScheduleViolation = schedule.enabled === true && !this.isWithinSchedule(schedule.start, schedule.end);

    // Si el adulto está autenticado y configurando, no bloquearle su panel
    if (window.kiddoParental && window.kiddoParental.isUnlocked) {
      return;
    }

    if (isLimitExceeded) {
      this.triggerLockout('limit');
    } else if (isScheduleViolation) {
      this.triggerLockout('schedule');
    } else {
      if (this.isLockedOut) {
        this.liftLockout();
      }
    }
  }

  triggerLockout(reason) {
    this.isLockedOut = true;
    this.lockoutReason = reason;

    // 1. Detener reproducción de videos
    if (typeof this.closeVideoModal === 'function') {
      this.closeVideoModal();
    }

    // 2. Detener música y audio
    if (window.kiddoAudio && typeof window.kiddoAudio.pauseCurrentTrack === 'function') {
      window.kiddoAudio.pauseCurrentTrack();
    }

    // 3. Detener narración de cuentos y Web Speech
    if (window.kiddoStories && typeof window.kiddoStories.stopNarration === 'function') {
      window.kiddoStories.stopNarration();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 4. Mostrar pantalla de bloqueo amable con Puky
    const overlay = document.getElementById('kiddo-lockout-overlay');
    const detailText = document.getElementById('lockout-detail-text');
    const settings = KIDDO_DATA?.parentalSettings;
    const schedule = settings?.allowedTimeRange || { start: '08:00', end: '20:00' };

    if (detailText) {
      if (reason === 'limit') {
        detailText.textContent = `Tiempo diario completado (${settings?.dailyLimitMinutes || 0} min). Vuelve mañana para seguir jugando.`;
      } else {
        detailText.textContent = `Horario permitido: de ${schedule.start} a ${schedule.end}. Kiddo estará disponible a las ${schedule.start}.`;
      }
    }

    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden', 'false');
    }

    // Bloquear visualmente navegación infantil
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-screen') !== 'ajustes') {
        btn.classList.add('btn-locked');
      }
    });
  }

  liftLockout() {
    this.isLockedOut = false;
    this.lockoutReason = null;

    const overlay = document.getElementById('kiddo-lockout-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.remove('btn-locked');
    });
  }

  startScreenTimeTracker() {
    if (this.screenTimeTimer) clearInterval(this.screenTimeTimer);

    // Verificación inicial de restricciones
    this.evaluateUsageRestrictions();

    // Detección de visibilidad y foco
    if (!this.visibilityBound) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Comprobar cambio de día al volver a la app
          const currentDay = this.getLocalDateString();
          if (currentDay !== this.todayDateStr) {
            this.todayDateStr = currentDay;
            this.screenTimeSeconds = 0;
            this.saveScreenTimeForToday();
          }
          this.evaluateUsageRestrictions();
        } else {
          this.saveScreenTimeForToday();
        }
      });

      window.addEventListener('focus', () => {
        this.evaluateUsageRestrictions();
      });

      this.visibilityBound = true;
    }

    // Conteo por segundo (solo cuando está en primer plano y sin bloqueo activo)
    this.screenTimeTimer = setInterval(() => {
      // 1. Detección de medianoche / nuevo día
      const currentDay = this.getLocalDateString();
      if (currentDay !== this.todayDateStr) {
        this.todayDateStr = currentDay;
        this.screenTimeSeconds = 0;
        this.saveScreenTimeForToday();
        this.evaluateUsageRestrictions();
      }

      // 2. Acumular tiempo activo real en primer plano
      if (document.visibilityState === 'visible' && !this.isLockedOut) {
        this.screenTimeSeconds += 1;
        const minutes = Math.floor(this.screenTimeSeconds / 60);
        KIDDO_DATA.user.todayScreenTimeMinutes = minutes;

        // Actualizar contador superior
        const counterDisplays = document.querySelectorAll('.screen-time-val:not(#kiddo-session-time)');
        counterDisplays.forEach(el => {
          el.textContent = `${minutes} min`;
        });

        // Guardado periódico en localStorage
        if (this.screenTimeSeconds % 5 === 0) {
          this.saveScreenTimeForToday();
        }

        // Evaluar límites y horario
        this.evaluateUsageRestrictions();
      }
    }, 1000);
  }
}

window.kiddoApp = new KiddoApp();

// Inicialización automática
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.kiddoApp.init());
} else {
  window.kiddoApp.init();
}
