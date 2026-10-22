/**
 * Módulo de Cuentos Infantiles y Lector Interactivo con Narración por Voz y Sincronización
 */

class KiddoStoriesManager {
  constructor() {
    this.currentStory = null;
    this.currentPageIndex = 0;
    this.isNarrating = false;
    this.currentUtterance = null;
    this.highlightInterval = null;
  }

  // Renderizar la lista de cuentos en la pantalla de Cuentos
  renderCatalog(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = KIDDO_DATA.stories.map(story => `
      <div class="story-card" data-story-id="${story.id}" onclick="window.kiddoStories.openStory('${story.id}')" style="background: ${story.gradient};">
        <div class="story-card-icon-wrap">
          <span class="story-card-icon">${story.icon}</span>
        </div>
        <div class="story-card-info">
          <h3 class="story-card-title">${story.title}</h3>
          <p class="story-card-author">${story.author}</p>
          <p class="story-card-desc">${story.coverText}</p>
          <div class="story-card-footer">
            <span class="story-card-pages">📖 ${story.pages.length} páginas</span>
            <button class="story-read-btn">
              <span>Leer Cuento</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Abrir un cuento específico en el lector interactivo
  openStory(storyId) {
    const story = KIDDO_DATA.stories.find(s => s.id === storyId);
    if (!story) return;

    this.currentStory = story;
    this.currentPageIndex = 0;
    this.stopNarration();

    // Cambiar vista al lector
    const screenCuentos = document.getElementById('screen-cuentos');
    const screenReader = document.getElementById('screen-story-reader');
    if (screenCuentos) {
      screenCuentos.classList.remove('active');
      screenCuentos.style.display = 'none';
    }
    if (screenReader) {
      screenReader.classList.add('active');
      screenReader.style.display = 'block';
    }

    // Registrar actividad reciente
    if (window.kiddoApp) {
      window.kiddoApp.addRecentActivity({
        type: 'story',
        icon: '📖',
        title: story.title,
        subtitle: `Lectura iniciada (${story.pages.length} páginas)`,
        color: story.color
      });
    }

    this.renderCurrentPage();
  }

  // Cerrar el lector y volver al catálogo
  closeReader() {
    this.stopNarration();
    const screenCuentos = document.getElementById('screen-cuentos');
    const screenReader = document.getElementById('screen-story-reader');
    if (screenReader) {
      screenReader.classList.remove('active');
      screenReader.style.display = 'none';
    }
    if (screenCuentos) {
      screenCuentos.classList.add('active');
      screenCuentos.style.display = 'block';
    }
  }

  // Renderizar la página actual del cuento
  renderCurrentPage() {
    if (!this.currentStory) return;
    const page = this.currentStory.pages[this.currentPageIndex];
    const totalPages = this.currentStory.pages.length;

    // Actualizar títulos e indicadores
    document.getElementById('story-reader-title').textContent = this.currentStory.title;
    document.getElementById('story-reader-page-indicator').textContent = `Página ${this.currentPageIndex + 1} de ${totalPages}`;

    // Renderizar ilustración 2D temática
    const illustrationContainer = document.getElementById('story-reader-illustration');
    illustrationContainer.innerHTML = this.getSceneIllustrationSvg(page.imageType, page.sceneTitle);

    // Renderizar texto dividido en palabras para sincronización de narración
    const textContainer = document.getElementById('story-reader-text');
    const words = page.text.split(' ');
    textContainer.innerHTML = words.map((word, idx) => `
      <span class="story-word" id="word-${idx}" data-index="${idx}">${word}</span>
    `).join(' ');

    // Actualizar botones de navegación
    const prevBtn = document.getElementById('story-prev-btn');
    const nextBtn = document.getElementById('story-next-btn');

    prevBtn.disabled = (this.currentPageIndex === 0);
    prevBtn.style.opacity = (this.currentPageIndex === 0) ? '0.4' : '1';

    if (this.currentPageIndex === totalPages - 1) {
      nextBtn.innerHTML = `<span>Finalizar 🎉</span>`;
    } else {
      nextBtn.innerHTML = `<span>Siguiente ➔</span>`;
    }

    // Resetear estado del botón narrar
    this.updateNarrateButtonState(false);
  }

  // Pasar a la página siguiente con animación de libro
  nextPage() {
    if (!this.currentStory) return;
    this.stopNarration();

    if (this.currentPageIndex < this.currentStory.pages.length - 1) {
      const bookContainer = document.querySelector('.story-book-frame');
      if (bookContainer) {
        bookContainer.classList.add('page-flipping-next');
        setTimeout(() => {
          this.currentPageIndex++;
          this.renderCurrentPage();
          bookContainer.classList.remove('page-flipping-next');
        }, 320);
      } else {
        this.currentPageIndex++;
        this.renderCurrentPage();
      }
    } else {
      // Final del cuento: sonido de logro y verificar cumplimiento real
      if (window.kiddoAudio) window.kiddoAudio.playSuccessChime();

      if (window.KiddoMissionEvents && this.currentStory) {
        const totalPages = this.currentStory.pages ? this.currentStory.pages.length : 1;
        // Solo emitir si llegó realmente a la última página
        if (this.currentPageIndex >= totalPages - 1) {
          window.KiddoMissionEvents.emit('story_completed', {
            storyId: this.currentStory.id,
            title: this.currentStory.title,
            pagesCount: totalPages
          });
        }
      }

      this.closeReader();
    }
  }

  // Volver a la página anterior
  prevPage() {
    if (!this.currentStory || this.currentPageIndex === 0) return;
    this.stopNarration();

    const bookContainer = document.querySelector('.story-book-frame');
    if (bookContainer) {
      bookContainer.classList.add('page-flipping-prev');
      setTimeout(() => {
        this.currentPageIndex--;
        this.renderCurrentPage();
        bookContainer.classList.remove('page-flipping-prev');
      }, 320);
    } else {
      this.currentPageIndex--;
      this.renderCurrentPage();
    }
  }

  // Toggle de narración por voz con Web Speech API y resaltado en vivo
  toggleNarration() {
    if (this.isNarrating) {
      this.stopNarration();
    } else {
      this.startNarration();
    }
  }

  startNarration() {
    if (!this.currentStory) return;
    this.stopNarration();

    const page = this.currentStory.pages[this.currentPageIndex];
    const textToSpeak = page.text;
    const words = textToSpeak.split(' ');

    this.isNarrating = true;
    this.updateNarrateButtonState(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES';
      utterance.rate = 0.82; // Voz calmada y tranquila
      utterance.pitch = 1.05; // Tono amigable

      // Buscar voz en español suave si está disponible
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Sabina') || v.name.includes('Helena') || v.name.includes('Mónica')));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      let currentWordIndex = 0;

      // Evento boundary nativo si el navegador lo soporta
            utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const spokenSubstr = textToSpeak.substring(0, charIndex);
          const wordIdx = spokenSubstr.trim().split(/\s+/).length - 1;
          this.highlightWord(Math.max(0, wordIdx));
        }
      };

      utterance.onend = () => {
        this.stopNarration();
      };

      utterance.onerror = () => {
        this.stopNarration();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Si el navegador no soporta síntesis de voz, simular resaltado
      let currentWordIndex = 0;
      this.highlightInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          this.highlightWord(currentWordIndex);
          currentWordIndex++;
        } else {
          this.stopNarration();
        }
      }, 350);
    }
  }

  stopNarration() {
    this.isNarrating = false;
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
      this.highlightInterval = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.clearAllWordHighlights();
    this.updateNarrateButtonState(false);
  }

  highlightWord(index) {
    this.clearAllWordHighlights();
    const wordEl = document.getElementById(`word-${index}`);
    if (wordEl) {
      wordEl.classList.add('is-highlighted');
    }
  }

  clearAllWordHighlights() {
    document.querySelectorAll('.story-word').forEach(el => {
      el.classList.remove('is-highlighted');
    });
  }

  updateNarrateButtonState(narrating) {
    const narrateBtn = document.getElementById('story-narrate-btn');
    if (!narrateBtn) return;
    if (narrating) {
      narrateBtn.classList.add('is-speaking');
      narrateBtn.innerHTML = `
        <span class="narrate-icon pulse">🔊</span>
        <span>Pausar Narración</span>
      `;
    } else {
      narrateBtn.classList.remove('is-speaking');
      narrateBtn.innerHTML = `
        <span class="narrate-icon">✨</span>
        <span>Narrar Cuento</span>
      `;
    }
  }

  // Generador de ilustraciones vectoriales 2D suaves y coloridas por escena
  getSceneIllustrationSvg(imageType, title) {
    return `
      <div class="story-illustration-frame">
        <svg viewBox="0 0 400 240" width="100%" height="100%" class="story-scene-svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E0F2FE"/>
              <stop offset="100%" stop-color="#FEF08A"/>
            </linearGradient>
            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#86EFAC"/>
              <stop offset="100%" stop-color="#4ADE80"/>
            </linearGradient>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#F1F5F9"/>
            </linearGradient>
          </defs>

          <!-- Fondo de cielo pastel -->
          <rect width="400" height="240" fill="url(#skyGrad)" rx="16"/>

          <!-- Sol dulce -->
          <circle cx="340" cy="50" r="28" fill="#FDE047" opacity="0.8"/>
          <circle cx="340" cy="50" r="36" fill="#FEF08A" opacity="0.4"/>

          <!-- Nubes flotantes -->
          <g opacity="0.9">
            <path d="M 60 45 C 50 45, 45 55, 55 60 C 45 65, 55 80, 75 75 C 85 85, 110 80, 115 70 C 125 65, 120 50, 105 50 C 100 40, 75 35, 60 45 Z" fill="url(#cloudGrad)"/>
            <path d="M 220 35 C 210 35, 205 45, 215 50 C 205 55, 215 70, 235 65 C 245 75, 270 70, 275 60 C 285 55, 280 40, 265 40 Z" fill="url(#cloudGrad)"/>
          </g>

          <!-- Colinas de césped suave -->
          <path d="M -20 240 Q 100 150 220 200 T 420 180 L 420 240 Z" fill="#BBF7D0"/>
          <path d="M -20 240 Q 150 170 300 210 T 420 240 L 420 240 Z" fill="url(#grassGrad)"/>

          <!-- Flores decorativas en el pasto -->
          <g>
            <circle cx="80" cy="210" r="6" fill="#F43F5E"/>
            <circle cx="80" cy="210" r="2" fill="#FEF08A"/>

            <circle cx="160" cy="225" r="7" fill="#A855F7"/>
            <circle cx="160" cy="225" r="3" fill="#FEF08A"/>

            <circle cx="320" cy="215" r="6" fill="#FB923C"/>
            <circle cx="320" cy="215" r="2" fill="#FEF08A"/>
          </g>

          <!-- Elemento temático central animado -->
          <g class="story-scene-center" transform="translate(140, 90)">
            <!-- Casita acogedora o Castillo según cuento -->
            <rect x="20" y="40" width="80" height="70" rx="8" fill="#FFEDD5" stroke="#FDBA74" stroke-width="3"/>
            <!-- Techo -->
            <polygon points="10,42 60,0 110,42" fill="#F43F5E"/>
            <!-- Puerta -->
            <path d="M 45 110 L 45 80 C 45 72, 75 72, 75 80 L 75 110 Z" fill="#9A3412"/>
            <circle cx="70" cy="92" r="2.5" fill="#FEF08A"/>
            <!-- Ventanita -->
            <circle cx="60" cy="55" r="10" fill="#BAE6FD" stroke="#FFFFFF" stroke-width="2"/>
          </g>

          <!-- Puky asomándose amigablemente en la escena -->
          <g transform="translate(30, 110) scale(0.65)">
            <ellipse cx="40" cy="50" rx="20" ry="20" fill="#94A3B8"/>
            <ellipse cx="20" cy="40" rx="14" ry="14" fill="#94A3B8"/>
            <ellipse cx="20" cy="40" rx="9" ry="9" fill="#FEB2B2"/>
            <ellipse cx="60" cy="40" rx="14" ry="14" fill="#94A3B8"/>
            <ellipse cx="60" cy="40" rx="9" ry="9" fill="#FEB2B2"/>
            <ellipse cx="40" cy="53" rx="6" ry="8" fill="#1E293B"/>
            <ellipse cx="32" cy="48" rx="4" ry="5" fill="#1E293B"/>
            <circle cx="31" cy="46" r="1.5" fill="#FFFFFF"/>
            <ellipse cx="48" cy="48" rx="4" ry="5" fill="#1E293B"/>
            <circle cx="47" cy="46" r="1.5" fill="#FFFFFF"/>
            <!-- Cesta de frutas / detalle -->
            <ellipse cx="62" cy="70" rx="8" ry="6" fill="#D97706"/>
          </g>

          <!-- Título de la escena -->
          <rect x="12" y="12" width="160" height="26" rx="13" fill="#FFFFFF" opacity="0.85"/>
          <text x="24" y="29" font-family="'Nunito', sans-serif" font-weight="700" font-size="12" fill="#475569">✨ ${title}</text>
        </svg>
      </div>
    `;
  }
}

window.kiddoStories = new KiddoStoriesManager();
