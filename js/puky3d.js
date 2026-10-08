/**
 * Motor 3D de Puky — Integración real de Puky.glb (Meshy AI Koala)
 *
 * ESTADO: GLB real integrado. Sin skeleton/animations/morph targets.
 * Solo animación global discreta permitida hasta rig definitivo.
 */

class Puky3DManager {
  constructor() {
    // --- Login scene (mantiene fallback PNG, no modificado) ---
    this.loginScene = null;
    this.loginCamera = null;
    this.loginRenderer = null;
    this.loginPuky = null;
    this.loginAnimFrame = null;

    // --- Room scene (GLB real) ---
    this.roomScene = null;
    this.roomCamera = null;
    this.roomRenderer = null;
    this.roomAnimFrame = null;
    this.roomPukyMesh = null;   // gltf.scene
    this.glbLoaded = false;

    // Animación suave global (breathing / gentle float)
    this._clock = null;
    this._baseY = 0;

    // Customization (mantenida por compatibilidad con otros módulos)
    this.customization = {
      furColor: 0xCFC7BD,
      outfitColor: 0x52B748,
      accessory: 'none'
    };

    // Blink (no aplicable al GLB sin morph, pero preservado para API)
    this.isBlinking = false;
    this.blinkProgress = 0;
    this.blinkTimer = 0;

    // Jump reaction
    this.jumpAnimation = 0;
  }

  /* ─────────────────────────────────────────
   * Utilidades
   * ───────────────────────────────────────── */
  hasThree() {
    return typeof THREE !== 'undefined';
  }

  hasGLTFLoader() {
    return this.hasThree() && typeof THREE.GLTFLoader !== 'undefined';
  }

  /* ─────────────────────────────────────────
   * LOGIN SCREEN — sin cambios (fallback PNG)
   * ───────────────────────────────────────── */
  initLoginPuky(container) {
    if (!container) return;
    this.renderFallbackLogin(container);
  }

  renderFallbackLogin(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:flex-end;">
        <img src="assets/koala_peeking.png" alt="Koala Puky"
             style="width:100%;max-width:440px;height:auto;">
      </div>
    `;
  }

  /* ─────────────────────────────────────────
   * PUKY ROOM — entrada principal
   * ───────────────────────────────────────── */
  initRoomPuky(container) {
    if (!container) return;

    // Limpiar instancia anterior si la hay
    this._destroyRoom();
    container.innerHTML = '';

    if (this.hasGLTFLoader()) {
      this._initGLBRoom(container);
    } else {
      // Three.js disponible pero sin GLTFLoader — usar fallback 2D
      console.warn('[Puky3D] GLTFLoader no disponible. Usando fallback 2D.');
      this.initRoomPuky2DFallback(container);
    }
  }

  /* ─────────────────────────────────────────
   * MODO GLB REAL
   * ───────────────────────────────────────── */
  _initGLBRoom(container) {
    try {
      const W = container.clientWidth  || 360;
      const H = container.clientHeight || 520;

      /* ── Renderer ── */
      this.roomRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      this.roomRenderer.setSize(W, H);
      this.roomRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.roomRenderer.shadowMap.enabled = true;
      this.roomRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.roomRenderer.outputEncoding = THREE.sRGBEncoding;
      this.roomRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.roomRenderer.toneMappingExposure = 1.1;
      container.appendChild(this.roomRenderer.domElement);

      /* ── Escena ── */
      this.roomScene = new THREE.Scene();
      this.roomScene.background = new THREE.Color(0xF2F7FF);

      /* ── Cámara temporal (se reposicionará después del bounding box) ── */
      this.roomCamera = new THREE.PerspectiveCamera(38, W / H, 0.01, 200);
      this.roomCamera.position.set(0, 1, 5);
      this.roomCamera.lookAt(0, 0, 0);

      /* ── Iluminación PBR suave ── */
      const ambient = new THREE.AmbientLight(0xFFF5F0, 0.85);
      this.roomScene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.1);
      keyLight.position.set(3, 8, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width  = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near   = 0.5;
      keyLight.shadow.camera.far    = 50;
      keyLight.shadow.camera.left   = -4;
      keyLight.shadow.camera.right  =  4;
      keyLight.shadow.camera.top    =  8;
      keyLight.shadow.camera.bottom = -2;
      keyLight.shadow.bias          = -0.001;
      this.roomScene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xE8F4FF, 0.5);
      fillLight.position.set(-4, 4, 2);
      this.roomScene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xFFEEDD, 0.3);
      rimLight.position.set(0, 2, -5);
      this.roomScene.add(rimLight);

      /* ── Mostrar PNG fallback mientras carga el GLB ── */
      this._showFallbackOverlay(container);

      /* ── Cargar GLB ── */
      const loader = new THREE.GLTFLoader();
      loader.load(
        'assets/models/Puky.glb',
        (gltf) => this._onGLBLoaded(gltf, container),
        (progress) => {
          if (progress.total > 0) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            this._updateLoadingProgress(container, pct);
          }
        },
        (error) => {
          console.error('[Puky3D] PUKY GLB LOAD ERROR:', error);
          this.initRoomPuky2DFallback(container);
        }
      );

      /* ── Iniciar loop de render ── */
      this._clock = new THREE.Clock();
      this._renderLoop();

      /* ── Resize ── */
      this._resizeObserver = new ResizeObserver(() => this._onResize(container));
      this._resizeObserver.observe(container);

      /* ── Click/tap sobre la escena ── */
      this.roomRenderer.domElement.addEventListener('click',
        () => this.petReaction('general'));

    } catch (err) {
      console.error('[Puky3D] Error inicializando escena 3D:', err);
      this.initRoomPuky2DFallback(container);
    }
  }

  /* ─────────────────────────────────────────
   * Callback cuando el GLB termina de cargar
   * ───────────────────────────────────────── */
  _onGLBLoaded(gltf, container) {
    console.log('[Puky3D] GLB cargado correctamente.');

    const puky = gltf.scene;
    this.roomPukyMesh = puky;

    /* ── Activar sombras en cada mesh ── */
    puky.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = false;
      }
    });

    /* ── Bounding Box: centrar y colocar pies en y=0 ── */
    const box    = new THREE.Box3().setFromObject(puky);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.log('[Puky3D] Tamano GLB: ' + size.x.toFixed(3) + ' x ' + size.y.toFixed(3) + ' x ' + size.z.toFixed(3));
    console.log('[Puky3D] Centro GLB: ' + center.x.toFixed(3) + ', ' + center.y.toFixed(3) + ', ' + center.z.toFixed(3));

    // Centrar en X/Z, pies en y=0
    puky.position.set(
      -center.x,
      -box.min.y,   // pie más bajo a y=0
      -center.z
    );
    this._baseY = puky.position.y;

    /* ── Escala: que Puky ocupe ~60% de la altura del frustum ── */
    const W = this.roomRenderer.domElement.clientWidth  || 360;
    const H = this.roomRenderer.domElement.clientHeight || 520;
    const aspect = W / H;

    // Distancia de cámara basada en el tamaño del modelo
    const maxDim = Math.max(size.x, size.y, size.z);
    const fovRad = THREE.MathUtils.degToRad(this.roomCamera.fov);
    let dist = (maxDim / 2) / Math.tan(fovRad / 2);
    dist *= 1.35; // margen para ver completo

    // Mirar al centro del modelo (a mitad de altura)
    const midY = size.y * 0.5;
    this.roomCamera.position.set(0, midY, dist);
    this.roomCamera.lookAt(0, midY, 0);
    this.roomCamera.aspect = aspect;
    this.roomCamera.updateProjectionMatrix();

    this.roomScene.add(puky);

    /* ── Contact shadow (disco difuso debajo de Puky) ── */
    this._addContactShadow(size);

    /* ── Fondo suave de habitación ── */
    this._addRoomDecor(size);

    /* ── Transición: ocultar fallback PNG con fade ── */
    this._hideFallbackOverlay(container);

    this.glbLoaded = true;

    // Diagnóstico
    let skeletonFound = false;
    let animationsFound = (gltf.animations && gltf.animations.length > 0);
    let morphFound = false;
    puky.traverse((child) => {
      if (child.isSkinnedMesh) skeletonFound = true;
      if (child.morphTargetInfluences && child.morphTargetInfluences.length > 0) morphFound = true;
    });
    console.log('[Puky3D] Skeleton: ' + skeletonFound + ' | Animations: ' + animationsFound + ' | MorphTargets: ' + morphFound);
  }

  /* ─────────────────────────────────────────
   * Contact Shadow (plano difuso bajo Puky)
   * ───────────────────────────────────────── */
  _addContactShadow(size) {
    const shadowRadius = Math.max(size.x, size.z) * 0.65;
    const shadowGeo = new THREE.CircleGeometry(shadowRadius, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.12,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    this.roomScene.add(shadow);
  }

  /* ─────────────────────────────────────────
   * Decoración mínima de fondo
   * ───────────────────────────────────────── */
  _addRoomDecor(size) {
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xFFF8F0,
      roughness: 0.9,
      metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.002;
    floor.receiveShadow = true;
    this.roomScene.add(floor);
  }

  /* ─────────────────────────────────────────
   * Fallback Overlay PNG (visible mientras carga)
   * ───────────────────────────────────────── */
  _showFallbackOverlay(container) {
    const overlay = document.createElement('div');
    overlay.id = 'puky-glb-loading-overlay';
    overlay.style.cssText = [
      'position:absolute',
      'inset:0',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'background:linear-gradient(180deg,#F0F7FF 0%,#FFF5EB 100%)',
      'border-radius:36px',
      'z-index:20',
      'transition:opacity 0.8s ease'
    ].join(';');
    overlay.innerHTML = [
      '<img src="assets/koala_transparent.png" alt="Puky cargando"',
      '     style="width:auto;height:auto;max-width:68%;max-height:68%;',
      '            object-fit:contain;',
      '            animation:pukyBreathing2D 4s ease-in-out infinite;',
      '            filter:drop-shadow(0 15px 25px rgba(0,0,0,0.1));">',
      '<div id="puky-load-bar-wrap" style="margin-top:16px;width:60%;max-width:180px;height:6px;background:rgba(0,0,0,0.08);border-radius:3px;overflow:hidden;">',
      '  <div id="puky-load-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#A78BFA,#60A5FA);border-radius:3px;transition:width 0.3s;"></div>',
      '</div>',
      '<style>',
      '@keyframes pukyBreathing2D{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-3px) scale(1.008);}}',
      '</style>'
    ].join('');
    container.style.position = 'relative';
    container.appendChild(overlay);
  }

  _updateLoadingProgress(container, pct) {
    const bar = container.querySelector('#puky-load-bar');
    if (bar) bar.style.width = pct + '%';
  }

  _hideFallbackOverlay(container) {
    const overlay = container.querySelector('#puky-glb-loading-overlay');
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(function() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 900);
  }

  /* ─────────────────────────────────────────
   * Loop de render — animación global discreta
   * ───────────────────────────────────────── */
  _renderLoop() {
    if (!this.roomRenderer || !this.roomScene || !this.roomCamera) return;

    this.roomAnimFrame = requestAnimationFrame(() => this._renderLoop());

    const t = this._clock ? this._clock.getElapsedTime() : 0;

    if (this.roomPukyMesh) {
      const floatY = Math.sin(t * 0.8) * 0.018;
      const rotY   = Math.sin(t * 0.35) * 0.018;

      this.roomPukyMesh.position.y = this._baseY + floatY;
      this.roomPukyMesh.rotation.y = rotY;

      if (this.jumpAnimation > 0) {
        const jumpOffset = Math.sin(this.jumpAnimation * Math.PI) * 0.12;
        this.roomPukyMesh.position.y += jumpOffset;
        this.jumpAnimation = Math.max(0, this.jumpAnimation - 0.06);
      }
    }

    this.roomRenderer.render(this.roomScene, this.roomCamera);
  }

  /* ─────────────────────────────────────────
   * Resize
   * ───────────────────────────────────────── */
  _onResize(container) {
    if (!this.roomRenderer || !this.roomCamera) return;
    const W = container.clientWidth  || 360;
    const H = container.clientHeight || 520;
    this.roomCamera.aspect = W / H;
    this.roomCamera.updateProjectionMatrix();
    this.roomRenderer.setSize(W, H);
  }

  /* ─────────────────────────────────────────
   * Destruir room
   * ───────────────────────────────────────── */
  _destroyRoom() {
    if (this.roomAnimFrame) {
      cancelAnimationFrame(this.roomAnimFrame);
      this.roomAnimFrame = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this.roomRenderer) {
      this.roomRenderer.dispose();
      this.roomRenderer = null;
    }
    this.roomScene     = null;
    this.roomCamera    = null;
    this.roomPukyMesh  = null;
    this.glbLoaded     = false;
  }

  /* ─────────────────────────────────────────
   * FALLBACK 2D
   * ───────────────────────────────────────── */
  initRoomPuky2DFallback(container) {
    container.innerHTML = [
      '<div class="puky-2d-wardrobe-scene" style="width:100%;height:100%;position:relative;',
      '     background:linear-gradient(180deg,#F0F7FF 0%,#FFF5EB 100%);',
      '     display:flex;align-items:center;justify-content:center;',
      '     overflow:hidden;border-radius:36px;">',
      '  <div style="position:absolute;inset:0;pointer-events:none;z-index:1;">',
      '    <div style="position:absolute;left:5%;top:15%;width:25%;height:65%;',
      '                background:#FFF3CD;border-radius:12px;border:4px solid #FDE68A;',
      '                display:flex;flex-direction:column;align-items:center;padding-top:10%;">',
      '      <div style="width:80%;height:6px;background:#E2E8F0;border-radius:3px;margin-bottom:10%;"></div>',
      '      <div style="display:flex;gap:10px;">',
      '        <div style="width:30px;height:40px;background:#A9DEF9;border-radius:6px;"></div>',
      '        <div style="width:30px;height:40px;background:#FFADD3;border-radius:6px;"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div id="puky-2d-character" style="position:relative;z-index:5;cursor:pointer;',
      '       display:flex;justify-content:center;align-items:center;height:100%;padding-bottom:15%;">',
      '    <img src="assets/koala_transparent.png" alt="Puky el Koala"',
      '         style="object-fit:contain;width:auto;height:auto;max-width:72%;max-height:72%;',
      '                animation:pukyBreathing2D 4s ease-in-out infinite;',
      '                transform-origin:bottom center;',
      '                filter:drop-shadow(0 15px 25px rgba(0,0,0,0.1));">',
      '  </div>',
      '  <div id="puky-particles" style="position:absolute;inset:0;pointer-events:none;z-index:10;"></div>',
      '  <style>',
      '    @keyframes pukyBreathing2D{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-2px) scale(1.008);}}',
      '    @keyframes pukyJoy2D{0%{transform:scale(1) translateY(0);}20%{transform:scale(0.95) translateY(10px);}50%{transform:scale(1.05) translateY(-20px) rotate(3deg);}80%{transform:scale(1.02) translateY(-5px) rotate(-2deg);}100%{transform:scale(1) translateY(0);}}',
      '    .puky-joy-anim{animation:pukyJoy2D 0.6s ease-out !important;}',
      '  </style>',
      '</div>'
    ].join('');

    const pukyEl = document.getElementById('puky-2d-character');
    if (pukyEl) {
      pukyEl.addEventListener('click', () => {
        if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
        const img = pukyEl.querySelector('img');
        if (img) {
          img.classList.remove('puky-joy-anim');
          void img.offsetWidth;
          img.classList.add('puky-joy-anim');
          setTimeout(function() { img.classList.remove('puky-joy-anim'); }, 600);
        }
        this._spawnHeart(document.getElementById('puky-particles'));
      });
    }
  }

  /* ─────────────────────────────────────────
   * Reacción al toque / pet
   * ───────────────────────────────────────── */
  petReaction(part) {
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
    this.triggerPukyJoyJump();
    this._spawnHeart(document.getElementById('puky-particles'));
  }

  triggerPukyJoyJump() {
    this.jumpAnimation = 1.0;
  }

  _spawnHeart(container) {
    if (!container) return;
    const heart = document.createElement('div');
    heart.textContent = 'XX';
    heart.style.cssText = 'position:absolute;left:50%;top:40%;font-size:24px;pointer-events:none;transition:all 1s ease-out;transform:translate(-50%,-50%) scale(0);opacity:1;';
    heart.textContent = String.fromCodePoint(0x2764, 0xFE0F);
    container.appendChild(heart);
    requestAnimationFrame(function() {
      heart.style.transform = 'translate(-50%,-100px) scale(1.5)';
      heart.style.opacity = '0';
    });
    setTimeout(function() { if (heart.parentNode) heart.parentNode.removeChild(heart); }, 1000);
  }

  /* ─────────────────────────────────────────
   * Customization API (compatibilidad)
   * ───────────────────────────────────────── */
  updateCustomization(type, value) {
    console.log('[Puky3D] updateCustomization reservado para rig futuro.');
  }

  handleBlinking(pukyInstance) {
    // Reservado para rig con morph targets.
  }

  /* ─────────────────────────────────────────
   * Legacy stubs (no romper código externo)
   * ───────────────────────────────────────── */
  createPukyMesh(isFullBody = true) {
    console.warn('[Puky3D] createPukyMesh() obsoleto — el modelo usa GLB real.');
    return {};
  }

  buildPastelRoom() {
    console.warn('[Puky3D] buildPastelRoom() obsoleto — el modelo usa GLB real.');
  }

  /* ─────────────────────────────────────────
   * Destrucción global
   * ───────────────────────────────────────── */
  destroy() {
    if (this.loginAnimFrame) cancelAnimationFrame(this.loginAnimFrame);
    this._destroyRoom();
  }
}

window.puky3D = new Puky3DManager();
