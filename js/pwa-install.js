/**
 * KIDDO - Controlador de Instalación PWA (A2HS)
 * Soporte para Android, iOS (Safari), Windows, Mac y tabletas.
 * Detecta modo standalone, gestiona beforeinstallprompt y guía en iOS.
 */

(function () {
  'use strict';

  let deferredPrompt = null;
  let isInstalled = false;

  // ============================================================
  // 1. DETECCIÓN DE MODO STANDALONE / YA INSTALADA
  // ============================================================
  function checkIsStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      navigator.standalone === true ||
      (document.referrer && document.referrer.startsWith('android-app://'))
    );
  }

  // ============================================================
  // 2. DETECCIÓN DE PLATAFORMA (iOS / Safari)
  // ============================================================
  function isIOS() {
    return (
      (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  function isIOSSafari() {
    const ua = navigator.userAgent;
    const isApple = isIOS();
    const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
    const isWebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
    return isApple && !isOtherBrowser && !isWebview;
  }

  // ============================================================
  // 3. ACTUALIZACIÓN VISUAL DE BOTONES
  // ============================================================
  function getInstallButtons() {
    return [
      document.getElementById('kiddo-pwa-install-btn'),
      document.getElementById('kiddo-pwa-header-btn')
    ].filter(Boolean);
  }

  function hideInstallButtons() {
    const buttons = getInstallButtons();
    buttons.forEach((btn) => {
      btn.classList.add('kiddo-pwa-hidden');
      btn.style.display = 'none';
      btn.setAttribute('aria-hidden', 'true');
    });
  }

  function showInstallButtons() {
    if (checkIsStandalone() || isInstalled) {
      hideInstallButtons();
      return;
    }
    const buttons = getInstallButtons();
    buttons.forEach((btn) => {
      btn.classList.remove('kiddo-pwa-hidden');
      btn.style.removeProperty('display');
      btn.removeAttribute('aria-hidden');
    });
  }

  // ============================================================
  // 4. MODAL DE INSTRUCCIONES
  // ============================================================
  function createModalIfNeeded() {
    let backdrop = document.getElementById('pwa-instructions-modal');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'pwa-instructions-modal';
    backdrop.className = 'pwa-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'pwa-modal-title');

    backdrop.innerHTML = `
      <div class="pwa-modal-card" onclick="event.stopPropagation()">
        <button class="pwa-modal-close-btn" id="pwa-modal-close-btn" aria-label="Cerrar ventana">✕</button>
        <div class="pwa-modal-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <h3 class="pwa-modal-title" id="pwa-modal-title">Instalar Kiddo</h3>
        <p class="pwa-modal-desc" id="pwa-modal-desc">
          Agrega Kiddo a tu pantalla de inicio para una experiencia a pantalla completa y sin distracciones.
        </p>
        <div class="pwa-modal-steps" id="pwa-modal-steps"></div>
        <button class="pwa-modal-btn-confirm" id="pwa-modal-ok-btn">¡Entendido!</button>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Eventos de cierre
    backdrop.addEventListener('click', closeModal);
    const closeBtn = backdrop.querySelector('#pwa-modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    const okBtn = backdrop.querySelector('#pwa-modal-ok-btn');
    if (okBtn) okBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeModal();
      }
    });

    return backdrop;
  }

  function openModal(type) {
    const backdrop = createModalIfNeeded();
    const titleEl = backdrop.querySelector('#pwa-modal-title');
    const descEl = backdrop.querySelector('#pwa-modal-desc');
    const stepsEl = backdrop.querySelector('#pwa-modal-steps');

    if (type === 'ios') {
      const isSafari = isIOSSafari();
      titleEl.textContent = 'Instalar Kiddo en iPhone / iPad';
      descEl.textContent = 'Sigue estos sencillos pasos para agregar Kiddo a tu pantalla de inicio:';

      stepsEl.innerHTML = `
        ${!isSafari ? `
          <div class="pwa-modal-step">
            <span class="pwa-step-num">1</span>
            <div class="pwa-step-body">
              Abre este enlace desde el navegador <strong>Safari</strong> de tu iPhone o iPad.
            </div>
          </div>
        ` : ''}
        <div class="pwa-modal-step">
          <span class="pwa-step-num">${!isSafari ? '2' : '1'}</span>
          <div class="pwa-step-body">
            Toca el botón <strong>Compartir</strong> <span class="pwa-step-inline-icon">⎋</span> (icono de cuadrado con flecha hacia arriba) en la barra del navegador.
          </div>
        </div>
        <div class="pwa-modal-step">
          <span class="pwa-step-num">${!isSafari ? '3' : '2'}</span>
          <div class="pwa-step-body">
            Desliza hacia abajo en el menú y selecciona <strong>"Agregar a pantalla de inicio"</strong> <span class="pwa-step-inline-icon">➕</span>.
          </div>
        </div>
        <div class="pwa-modal-step">
          <span class="pwa-step-num">${!isSafari ? '4' : '3'}</span>
          <div class="pwa-step-body">
            Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Abre Kiddo como una app independiente.
          </div>
        </div>
      `;
    } else {
      titleEl.textContent = 'Cómo instalar Kiddo';
      descEl.textContent = 'Puedes instalar Kiddo directamente desde las opciones de tu navegador:';

      stepsEl.innerHTML = `
        <div class="pwa-modal-step">
          <span class="pwa-step-num">1</span>
          <div class="pwa-step-body">
            En <strong>Google Chrome o Edge</strong>, busca el ícono de instalación <span class="pwa-step-inline-icon">⊕</span> o <span class="pwa-step-inline-icon">📲</span> en la barra de direcciones superior.
          </div>
        </div>
        <div class="pwa-modal-step">
          <span class="pwa-step-num">2</span>
          <div class="pwa-step-body">
            O abre el menú del navegador <span class="pwa-step-inline-icon">⋮</span> y selecciona <strong>"Instalar Kiddo"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
          </div>
        </div>
        <div class="pwa-modal-step">
          <span class="pwa-step-num">3</span>
          <div class="pwa-step-body">
            Confirma la instalación y disfruta de Kiddo en modo pantalla completa sin barras del navegador.
          </div>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }

  function closeModal() {
    const backdrop = document.getElementById('pwa-instructions-modal');
    if (backdrop) {
      backdrop.classList.remove('active');
    }
  }

  // ============================================================
  // 5. ACCIÓN PRINCIPAL DE INSTALACIÓN
  // ============================================================
  async function triggerInstall() {
    // Si ya está en modo independiente, no hacer nada
    if (checkIsStandalone()) {
      hideInstallButtons();
      return;
    }

    // Caso A: Evento nativo de instalación disponible (Android / Chrome / Edge)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('[Kiddo PWA] Elección del usuario:', choice ? choice.outcome : 'desconocido');

        if (choice && choice.outcome === 'accepted') {
          deferredPrompt = null;
          hideInstallButtons();
        }
      } catch (err) {
        console.warn('[Kiddo PWA] Error al ejecutar prompt de instalación:', err);
        // Fallback a instrucciones si el prompt falló
        openModal(isIOS() ? 'ios' : 'browser');
      }
      return;
    }

    // Caso B: Dispositivo iOS (iPhone / iPad)
    if (isIOS()) {
      openModal('ios');
      return;
    }

    // Caso C: Navegador compatible pero sin evento listo o navegador de escritorio
    openModal('browser');
  }

  // ============================================================
  // 6. INICIALIZACIÓN Y EVENT LISTENERS
  // ============================================================
  function init() {
    // Si la app ya se está ejecutando instalada, ocultar botones de inmediato
    if (checkIsStandalone()) {
      console.log('[Kiddo PWA] Ejecutándose en modo standalone ✓');
      hideInstallButtons();
      return;
    }

    // Mostrar botones inicialmente (para navegadores web compatibles)
    showInstallButtons();

    // Vincular clicks a todos los botones de instalación existentes
    getInstallButtons().forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerInstall();
      });
    });

    // Escuchar evento de instalación nativa de Chromium
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('[Kiddo PWA] Evento beforeinstallprompt capturado ✓');
      if (!checkIsStandalone() && !isInstalled) {
        showInstallButtons();
      }
    });

    // Escuchar confirmación de instalación
    window.addEventListener('appinstalled', () => {
      console.log('[Kiddo PWA] ¡Kiddo se ha instalado correctamente! 🎉');
      isInstalled = true;
      deferredPrompt = null;
      hideInstallButtons();
      closeModal();
    });

    // Escuchar cambios de visualización a standalone en tiempo real
    const mq = window.matchMedia('(display-mode: standalone)');
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', (e) => {
        if (e.matches) {
          hideInstallButtons();
          closeModal();
        }
      });
    }
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer API global limpia
  window.kiddoPWA = {
    install: triggerInstall,
    isStandalone: checkIsStandalone,
    showInstructions: () => openModal(isIOS() ? 'ios' : 'browser'),
    closeModal: closeModal
  };

  // Compatibilidad con el llamado anterior window.kiddoInstallPWA si algún componente lo llama
  window.kiddoInstallPWA = triggerInstall;
})();
