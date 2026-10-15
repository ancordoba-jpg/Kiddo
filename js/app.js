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
    this.screenTimeTimer = null;
    this.screenTimeSeconds = 14 * 60; // 14 min iniciales como en la referencia
    this.activeMusicTab = 'crear';
    this.currentVideoAge = this.getInitialAgeGroup();
    this.activeVideoPlayer = null;
  }

  init() {
    try {
      this.setupEventListeners();
      this.startScreenTimeTracker();

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

    const name = (nameInput && nameInput.value) ? nameInput.value.trim() : 'Mateo';
    const birthdate = (birthdateInput && birthdateInput.value) ? birthdateInput.value : '2020-05-15';
    const pin = (pinInput && pinInput.value) ? pinInput.value.trim() : '1234';

    if (!name || !pin) {
      alert('Por favor escribe tu nombre y una contraseña de 4 dígitos.');
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
    this.currentVideoAge = this.getInitialAgeGroup();

    if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();

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

  // 8. SECCIÓN "JUEGOS"
  renderGamesScreen() {
    const container = document.getElementById('games-grid-container');
    if (!container) return;

    // Si existe el nuevo motor de juegos, usar la lista nueva
    const gamesList = window.KIDDO_GAMES_LIST || [];
    if (gamesList.length > 0) {
      container.innerHTML = gamesList.map(game => `
        <button class="game-select-card color-${game.color}" onclick="${game.action}" aria-label="Jugar ${game.name}">
          <div class="game-card-emoji">${game.emoji}</div>
          <div class="game-card-name">${game.name}</div>
          <div class="game-card-desc">${game.desc}</div>
        </button>
      `).join('');
      return;
    }

    // Fallback: lista antigua de KIDDO_DATA.games
    container.innerHTML = (KIDDO_DATA.games || []).map(game => `
      <button class="game-select-card color-pink" onclick="window.kiddoApp.openGameModal('${game.id}')" aria-label="Jugar ${game.name}">
        <div class="game-card-emoji">${game.icon}</div>
        <div class="game-card-name">${game.name}</div>
        <div class="game-card-desc">${game.description}</div>
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

    const puky = document.createElement('img');
    puky.id = 'puky-room-2d';
    puky.src = 'assets/puky2d/frames/puky-idle.png.png';
    puky.alt = 'Puky, mascota oficial de Kiddo';
    puky.draggable = false;

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'flex-end';
    container.style.paddingBottom = '110px';
    container.style.boxSizing = 'border-box';

    puky.style.width = 'auto';
    puky.style.height = '100%';
    puky.style.maxHeight = '100%';
    puky.style.maxWidth = '85%';
    puky.style.objectFit = 'contain';

    container.appendChild(puky);


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


  openPukyCustomization() {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const modal = document.getElementById('puky-custom-modal');
    if (modal) {
      this.renderPukyCustomizationContent();
      modal.classList.add('active');
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
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    const modal = document.getElementById('puky-chat-modal');
    if (modal) {
      modal.classList.add('active');
      this.initChatMessages();
    }
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
        <div class="music-relaxing-grid">
          ${KIDDO_DATA.music.relaxing.map(track => `
            <div class="relax-track-card" onclick="window.kiddoApp.toggleRelaxingTrack('${track.id}')" id="track-${track.id}" style="border-top: 6px solid ${track.color};">
              <div class="relax-track-icon-wrap" style="background-color: ${track.color};">
                <span class="relax-icon">${track.icon}</span>
              </div>
              <div class="relax-track-info">
                <h3>${track.title}</h3>
                <span class="relax-instrument">${track.instrument}</span>
                <p>${track.description}</p>
              </div>
              <div class="relax-play-indicator">
                <span class="play-pulse-btn" id="btn-play-${track.id}">▶ Escuchar</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tabKey === 'crear') {
      contentBox.innerHTML = `
        <div class="virtual-piano-experience">
          <div class="piano-puky-companion">
            <div class="piano-puky-avatar" id="piano-puky-face">🐨</div>
            <div class="piano-speech-bubble">
              ¡Toca las teclas de colores para crear una linda canción conmigo! 🎶✨
            </div>
          </div>

          <div class="piano-keyboard-wrapper">
            <div class="piano-keys-container">
              <button class="piano-key key-c" onclick="window.kiddoApp.playKeyNote('DO', this)">
                <span class="key-note-name">DO</span>
                <span class="key-color-dot" style="background: #F87171;"></span>
              </button>
              <button class="piano-key key-d" onclick="window.kiddoApp.playKeyNote('RE', this)">
                <span class="key-note-name">RE</span>
                <span class="key-color-dot" style="background: #FB923C;"></span>
              </button>
              <button class="piano-key key-e" onclick="window.kiddoApp.playKeyNote('MI', this)">
                <span class="key-note-name">MI</span>
                <span class="key-color-dot" style="background: #FACC15;"></span>
              </button>
              <button class="piano-key key-f" onclick="window.kiddoApp.playKeyNote('FA', this)">
                <span class="key-note-name">FA</span>
                <span class="key-color-dot" style="background: #4ADE80;"></span>
              </button>
              <button class="piano-key key-g" onclick="window.kiddoApp.playKeyNote('SOL', this)">
                <span class="key-note-name">SOL</span>
                <span class="key-color-dot" style="background: #38BDF8;"></span>
              </button>
              <button class="piano-key key-a" onclick="window.kiddoApp.playKeyNote('LA', this)">
                <span class="key-note-name">LA</span>
                <span class="key-color-dot" style="background: #818CF8;"></span>
              </button>
              <button class="piano-key key-b" onclick="window.kiddoApp.playKeyNote('SI', this)">
                <span class="key-note-name">SI</span>
                <span class="key-color-dot" style="background: #C084FC;"></span>
              </button>
              <button class="piano-key key-c-high" onclick="window.kiddoApp.playKeyNote('DO-HIGH', this)">
                <span class="key-note-name">DO 🌟</span>
                <span class="key-color-dot" style="background: #F472B6;"></span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (tabKey === 'infantil') {
      contentBox.innerHTML = `
        <div class="children-music-grid">
          ${KIDDO_DATA.music.children.map(song => `
            <div class="youtube-song-card" onclick="window.kiddoApp.openYoutubeLink('${song.url}')" style="background: linear-gradient(135deg, ${song.color}, #FFFFFF);">
              <div class="yt-song-badge">YouTube Kids</div>
              <div class="yt-song-icon-wrap">${song.icon}</div>
              <div class="yt-song-info">
                <h3>${song.title}</h3>
                <span class="yt-channel-name">Canal: ${song.channel}</span>
                <p>${song.description}</p>
              </div>
              <div class="yt-song-action">
                <span class="yt-play-link">Ver en YouTube 🎬</span>
              </div>
            </div>
          `).join('')}
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
    }

    const pukyFace = document.getElementById('piano-puky-face');
    if (pukyFace) {
      pukyFace.classList.add('jump-bounce');
      setTimeout(() => pukyFace.classList.remove('jump-bounce'), 400);
    }
  }

  toggleRelaxingTrack(trackId) {
    if (!window.kiddoAudio) return;

    if (window.kiddoAudio.activeAmbientSound === trackId) {
      window.kiddoAudio.stopRelaxingTrack();
      document.querySelectorAll('.relax-track-card').forEach(c => c.classList.remove('is-playing'));
      document.querySelectorAll('.play-pulse-btn').forEach(b => b.textContent = '▶ Escuchar');
    } else {
      window.kiddoAudio.playRelaxingTrack(trackId);
      document.querySelectorAll('.relax-track-card').forEach(c => c.classList.remove('is-playing'));
      document.querySelectorAll('.play-pulse-btn').forEach(b => b.textContent = '▶ Escuchar');

      const card = document.getElementById(`track-${trackId}`);
      const btn = document.getElementById(`btn-play-${trackId}`);
      if (card) card.classList.add('is-playing');
      if (btn) btn.textContent = '⏸ Pausar';
    }
  }

  // 14. SECCIÓN "VIDEOS" (Filtro por Edad, Carruseles y Reproducción Interna)
  getInitialAgeGroup() {
    try {
      const birthStr = typeof KIDDO_DATA !== 'undefined' ? KIDDO_DATA?.user?.birthdate : null;
      if (!birthStr) return 'all';

      let birthDate;
      if (birthStr.includes('/')) {
        const parts = birthStr.split('/');
        if (parts.length === 3) {
          birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
      } else {
        birthDate = new Date(birthStr);
      }

      if (isNaN(birthDate.getTime())) return 'all';

      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age >= 2 && age <= 4) return '2-4';
      if (age >= 5 && age <= 7) return '5-7';
      if (age >= 8 && age <= 10) return '8-10';
      return 'all';
    } catch (e) {
      return 'all';
    }
  }

  setVideoAgeFilter(ageGroup) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.currentVideoAge = ageGroup;
    this.renderVideosScreen();
  }

  renderVideosScreen() {
    const container = document.getElementById('videos-content-container');
    if (!container) return;

    // Actualizar botones visuales de selector de edad
    const ageChips = document.querySelectorAll('.video-age-chip');
    ageChips.forEach(chip => {
      const isSel = chip.getAttribute('data-age') === this.currentVideoAge;
      chip.classList.toggle('active', isSel);
      chip.setAttribute('aria-selected', isSel ? 'true' : 'false');
    });

    const allItems = KIDDO_DATA.videos.items || [];
    const currentAge = this.currentVideoAge;

    const filteredItems = (currentAge === 'all')
      ? allItems
      : allItems.filter(v => v.ageGroups && v.ageGroups.includes(currentAge));

    const categories = KIDDO_DATA.videos.categories || [
      { id: 'aprender', name: 'Aprender', icon: '📚' },
      { id: 'bailar', name: 'Bailar', icon: '🎵' },
      { id: 'entretenimiento', name: 'Entretenimiento', icon: '🍿' }
    ];

    container.innerHTML = `
      ${categories.map(cat => {
      const catVideos = filteredItems.filter(v => v.category === cat.id);
      return `
          <div class="video-category-section" id="video-section-${cat.id}">
            <div class="video-cat-header">
              <div class="video-cat-title-wrap">
                <span class="video-cat-icon">${cat.icon}</span>
                <h3>${cat.name}</h3>
              </div>
              <button class="video-see-all-btn" onclick="window.kiddoApp.openCategoryVideos('${cat.id}')" title="Ver todos de ${cat.name}">
                <span>Ver todos</span>
                <span class="see-all-arrow">&gt;</span>
              </button>
            </div>

            ${catVideos.length > 0 ? `
              <div class="video-cards-carousel" role="region" aria-label="Carrusel de videos ${cat.name}">
                ${catVideos.map(v => `
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
                      <div class="video-card-channel-row">
                        <span class="video-channel-icon">📺</span>
                        <p class="video-card-channel">${v.channel}</p>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            ` : `
              <div class="video-empty-category-card">
                <div class="empty-cat-icon">🐨✨</div>
                <div class="empty-cat-content">
                  <h4>Próximamente tendremos más videos para esta edad</h4>
                  <p>Puky está preparando nuevos contenidos educativos y divertidos.</p>
                </div>
              </div>
            `}
          </div>
        `;
    }).join('')}

      <!-- Sección Canales Infantiles Recomendados (Mantenida exactamente igual) -->
      <div class="video-category-section channels-section">
        <div class="video-cat-header">
          <div class="video-cat-title-wrap">
            <span class="video-cat-icon">⭐</span>
            <h3>Canales Infantiles Recomendados</h3>
          </div>
        </div>
        <div class="recommended-channels-grid">
          ${KIDDO_DATA.videos.recommendedChannels.map(ch => `
            <div class="channel-card-item" onclick="window.kiddoApp.openYoutubeLink('${ch.url}')">
              <div class="channel-icon-circle" style="background-color: ${ch.color};">
                <span>${ch.icon}</span>
              </div>
              <div class="channel-meta">
                <h4>${ch.name}</h4>
                <span>${ch.subscribers}</span>
              </div>
              <span class="channel-open-arrow">➔</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  playVideo(videoId) {
    const video = (KIDDO_DATA.videos.items || []).find(v => v.id === videoId || v.videoId === videoId);
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

    if (catBadge) {
      const catIcons = { aprender: '📚 Aprender', bailar: '🎵 Bailar', entretenimiento: '🍿 Entretenimiento' };
      catBadge.textContent = catIcons[video.category] || '📺 Video';
    }
    if (titleEl) titleEl.textContent = video.title;
    if (channelEl) channelEl.textContent = video.channel;

    if (embedContainer) {
      // Inyección dinámica sin pre-carga masiva de iframes
      embedContainer.innerHTML = `
        <iframe
          id="kiddo-active-video-player"
          src="https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
          title="${video.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
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
      subtitle: `Visto en Videos (${video.channel})`,
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

  openCategoryVideos(categoryId) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    if (this.currentVideoAge !== 'all') {
      this.setVideoAgeFilter('all');
    }
    const sectionEl = document.getElementById(`video-section-${categoryId}`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

  startScreenTimeTracker() {
    if (this.screenTimeTimer) clearInterval(this.screenTimeTimer);
    this.screenTimeTimer = setInterval(() => {
      this.screenTimeSeconds += 1;
      const minutes = Math.floor(this.screenTimeSeconds / 60);
      KIDDO_DATA.user.todayScreenTimeMinutes = minutes;

      const counterDisplays = document.querySelectorAll('.screen-time-val');
      counterDisplays.forEach(el => {
        el.textContent = `${minutes} min`;
      });
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
