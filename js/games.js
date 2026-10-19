/**
 * KIDDO — Motor de Juegos Educativos
 * 8 juegos: Memoria, Sumar, Restar, Multiplicar, Dividir,
 *           Aprender la Hora, Completar con Sílabas, Armar Palabras
 */

// ============================================================
// UTILIDADES
// ============================================================

/** Fisher-Yates shuffle — algoritmo correcto de mezcla (Validado) */
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Número entero aleatorio entre min y max inclusive */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Genera 2 distractores plausibles distintos del correcto */
function makePlausibleDistractors(correct, total = 3, minV = 0, maxV = 999) {
  const opts = new Set([correct]);
  const deltas = [1, 2, 3, -1, -2, -3, 5, -5, 10, -10];
  for (const d of fisherYates(deltas)) {
    const v = correct + d;
    if (v >= minV && v <= maxV && v !== correct) opts.add(v);
    if (opts.size === total) break;
  }
  // fallback: valores aleatorios
  let safety = 0;
  while (opts.size < total && safety < 100) {
    const v = randInt(Math.max(minV, correct - 20), Math.min(maxV, correct + 20));
    if (v !== correct) opts.add(v);
    safety++;
  }
  return fisherYates([...opts]).slice(0, total);
}


// ============================================================
// DATOS: BANCO DE PALABRAS
// ============================================================

const SYLLABLE_BANK = [
  { word: 'GATO',     image: '🐱', missing: 'GA', display: '___TO',     pos: 0 },
  { word: 'PERRO',    image: '🐶', missing: 'PE', display: '___RRO',    pos: 0 },
  { word: 'PATO',     image: '🦆', missing: 'PA', display: '___TO',     pos: 0 },
  { word: 'VACA',     image: '🐄', missing: 'CA', display: 'VA___',     pos: 1 },
  { word: 'MONO',     image: '🐒', missing: 'MO', display: '___NO',     pos: 0 },
  { word: 'CONEJO',   image: '🐰', missing: 'NE', display: 'CO___JO',   pos: 1 },
  { word: 'MESA',     image: '🪑', missing: 'ME', display: '___SA',     pos: 0 },
  { word: 'CASA',     image: '🏠', missing: 'SA', display: 'CA___',     pos: 1 },
  { word: 'PELOTA',   image: '⚽', missing: 'LO', display: 'PE___TA',   pos: 1 },
  { word: 'AUTO',     image: '🚗', missing: 'AU', display: '___TO',     pos: 0 },
  { word: 'BANANA',   image: '🍌', missing: 'NA', display: 'BA___NA',   pos: 1 },
  { word: 'MANZANA',  image: '🍎', missing: 'ZA', display: 'MAN___NA',  pos: 1 },
  { word: 'TOMATE',   image: '🍅', missing: 'TO', display: '___MATE',   pos: 0 },
  { word: 'MAMÁ',     image: '👩', missing: 'MÁ', display: 'MA___',     pos: 1 },
  { word: 'PAPÁ',     image: '👨', missing: 'PÁ', display: 'PA___',     pos: 1 },
  { word: 'ABUELA',   image: '👵', missing: 'BUE', display: 'A___LA',    pos: 1 },
  { word: 'HERMANO',  image: '👦', missing: 'MA', display: 'HER___NO',  pos: 1 },
  { word: 'FLOR',     image: '🌸', missing: 'LOR', display: 'F___',      pos: 1 },
  { word: 'PERA',     image: '🍐', missing: 'PE', display: '___RA',     pos: 0 },
  { word: 'UVA',      image: '🍇', missing: 'VA', display: 'U___',      pos: 1 },
];

const SYLLABLE_DISTRACTORS = [
  'MA','TA','LA','SA','NA','RA','PA','CA','LO','TO','PE',
  'MO','GA','VA','NE','BA','ZA','AU','BUE','LOR','MÁ','PÁ'
];

const WORD_BUILDER_BANK = [
  { word: 'GATO',    image: '🐱' },
  { word: 'PERRO',   image: '🐶' },
  { word: 'CASA',    image: '🏠' },
  { word: 'MESA',    image: '🪑' },
  { word: 'PAPÁ',    image: '👨' },
  { word: 'MAMÁ',    image: '👩' },
  { word: 'PAN',     image: '🍞' },
  { word: 'AUTO',    image: '🚗' },
  { word: 'FLOR',    image: '🌸' },
  { word: 'SOL',     image: '☀️' },
  { word: 'PATO',    image: '🦆' },
  { word: 'VACA',    image: '🐄' },
  { word: 'MONO',    image: '🐒' },
  { word: 'QUESO',   image: '🧀' },
  { word: 'UVAS',    image: '🍇' },
  { word: 'LUNA',    image: '🌙' },
  { word: 'TREN',    image: '🚂' },
];

const MEMORY_ITEMS = [
  '🐱','🐶','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦉',
  '🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦀','🐠',
  '🍎','🍊','🍋','🍇','🍓','🍑','🍒','🥝','🍆','🌽',
  '🚗','🚕','🚙','🚌','🏠','⭐','🌙','☀️','⚽','🎈',
];


// ============================================================
// CLASE PRINCIPAL: KiddoGames
// ============================================================

class KiddoGames {
  constructor() {
    this._overlay = null;
    this._currentGame = null;
    this._timers = [];
    this._intervals = [];
  }

  // ─── Overlay ────────────────────────────────────────────
  _getOrCreateOverlay() {
    if (this._overlay) return this._overlay;

    const el = document.createElement('div');
    el.id = 'kiddo-game-overlay';
    el.className = 'game-overlay hidden';
    document.body.appendChild(el);
    this._overlay = el;
    return el;
  }

  _showOverlay(titleText, showProgress = true) {
    const overlay = this._getOrCreateOverlay();
    overlay.classList.remove('hidden');
    overlay.innerHTML = `
      <div class="game-top-bar">
        <button class="game-back-btn" id="game-back-btn" onclick="window.kiddoGames.closeGame()">← Atrás</button>
        <h2 class="game-top-title" id="game-top-title">${titleText}</h2>
      </div>
      ${showProgress ? `
      <div class="game-progress-bar-wrap" id="game-progress-wrap">
        <div class="game-progress-label" id="game-progress-label">Pregunta 1 de 10</div>
        <div class="game-progress-track">
          <div class="game-progress-fill" id="game-progress-fill" style="width: 0%"></div>
        </div>
      </div>
      ` : ''}
      <div class="game-content-zone" id="game-content-zone"></div>
    `;
    return overlay;
  }

  _updateProgress(current, total) {
    const label = document.getElementById('game-progress-label');
    const fill = document.getElementById('game-progress-fill');
    if (label) label.textContent = `Pregunta ${current} de ${total}`;
    if (fill) fill.style.width = `${(current / total) * 100}%`;
  }

  _getContentZone() {
    return document.getElementById('game-content-zone');
  }

  /** Cancela todos los timers activos */
  _clearTimers() {
    this._timers.forEach(t => clearTimeout(t));
    this._intervals.forEach(i => clearInterval(i));
    this._timers = [];
    this._intervals = [];
  }

  /** Añade un setTimeout rastreado */
  _setTimeout(fn, ms) {
    const t = setTimeout(fn, ms);
    this._timers.push(t);
    return t;
  }

  closeGame() {
    this._clearTimers();
    const overlay = this._getOrCreateOverlay();
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    this._currentGame = null;
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  }

  // ─── Pantalla de resultado final ────────────────────────
  _showResult(score, total, title, customMsg, actions) {
    const zone = this._getContentZone();
    if (!zone) return;

    const pct = score / total;
    const emoji = pct >= 0.8 ? '🏆' : pct >= 0.5 ? '⭐' : '🌟';
    const msg = pct >= 0.8 ? '¡Excelente trabajo!' :
                pct >= 0.5 ? '¡Muy bien! ¡Sigamos aprendiendo!' :
                             '¡Buen intento! Podemos mejorar juntos.';

    // Ocultar barra de progreso
    const pw = document.getElementById('game-progress-wrap');
    if (pw) pw.style.display = 'none';

    zone.innerHTML = `
      <div class="game-result-screen">
        <div class="game-result-emoji">${emoji}</div>
        <h3 class="game-result-title">${title}</h3>
        <div class="game-result-score">${score}/${total}</div>
        <p class="game-result-msg">${customMsg || msg}</p>
        <div class="game-result-actions">
          ${actions}
        </div>
        <p style="font-size:12px; color:#A0ADB8; margin-top: 4px;">Puky está muy orgulloso de ti 🐨✨</p>
      </div>
    `;

    if (window.kiddoAudio && typeof window.kiddoAudio.playSuccessChime === 'function') {
      window.kiddoAudio.playSuccessChime();
    }
  }

  // ─── Feedback de respuesta ───────────────────────────────
  _renderFeedback(zone, correct) {
    let fb = zone.querySelector('.game-feedback-bubble');
    if (!fb) {
      fb = document.createElement('div');
      fb.className = 'game-feedback-bubble';
      zone.appendChild(fb);
    }
    fb.className = `game-feedback-bubble ${correct ? 'correct' : 'incorrect'}`;
    fb.textContent = correct ? '✓ ¡Muy bien!' : '✗ ¡Casi! Probemos otra vez';
    fb.classList.remove('hidden');

    if (window.kiddoAudio) {
      if (correct && typeof window.kiddoAudio.playSuccessChime === 'function') {
        window.kiddoAudio.playSuccessChime();
      } else if (!correct && typeof window.kiddoAudio.playBubbleSound === 'function') {
        window.kiddoAudio.playBubbleSound();
      }
    }
  }


  // ============================================================
  // JUEGO 1: MEMORIA
  // ============================================================

  openMemory() {
    this._currentGame = 'memory';
    const overlay = this._showOverlay('Memoria', false);
    const pw = document.getElementById('game-progress-wrap');
    if (pw) pw.style.display = 'none';
    const zone = this._getContentZone();
    this._renderMemorySizeSelector(zone);
  }

  _renderMemorySizeSelector(zone) {
    zone.innerHTML = `
      <div class="memory-size-selector">
        <div class="game-result-emoji" style="font-size:48px">🧠</div>
        <h3 class="memory-size-title">Elige el tamaño del tablero</h3>
        <div class="memory-size-options">
          <button class="memory-size-btn" onclick="window.kiddoGames._startMemory(3)">
            <span>🟦 Tablero 3×3</span>
            <span class="size-badge">Fácil</span>
          </button>
          <button class="memory-size-btn" onclick="window.kiddoGames._startMemory(6)">
            <span>🟨 Tablero 6×6</span>
            <span class="size-badge">Medio</span>
          </button>
          <button class="memory-size-btn" onclick="window.kiddoGames._startMemory(7)">
            <span>🟥 Tablero 7×7</span>
            <span class="size-badge">Difícil</span>
          </button>
        </div>
      </div>
    `;
  }

  _startMemory(size) {
    this._clearTimers();
    this._memoryState = {
      size,
      flipped: [],
      matched: 0,
      attempts: 0,
      locked: false,
      startTime: Date.now(),
    };

    const totalCards = size * size;
    const hasPuky = (size === 3 || size === 7);
    const pairsCount = hasPuky ? Math.floor((totalCards - 1) / 2) : totalCards / 2;

    // Seleccionar emojis únicos
    const pool = fisherYates(MEMORY_ITEMS).slice(0, pairsCount);

    // Crear array de cartas
    let cards = [];
    pool.forEach((emoji, idx) => {
      cards.push({ id: `c${idx}-a`, emoji, paired: idx });
      cards.push({ id: `c${idx}-b`, emoji, paired: idx });
    });

    if (hasPuky) {
      cards.push({ id: 'puky', emoji: '🐨', isPuky: true, paired: 'puky' });
    }

    // Fisher-Yates del array de cartas
    cards = fisherYates(cards);

    this._memoryCards = cards;
    this._memoryPairs = pairsCount + (hasPuky ? 1 : 0); // total a resolver
    this._memoryHasPuky = hasPuky;

    const zone = this._getContentZone();
    zone.innerHTML = `
      <div class="memory-board-container">
        <div class="memory-stats-row">
          <div class="memory-stat-pill" id="mem-pairs">Parejas: 0/${hasPuky ? pairsCount + 1 : pairsCount}</div>
          <div class="memory-stat-pill" id="mem-attempts">Intentos: 0</div>
        </div>
        <div class="memory-grid" id="memory-grid" style="grid-template-columns: repeat(${size}, 1fr);"></div>
      </div>
    `;

    const grid = document.getElementById('memory-grid');
    cards.forEach(card => {
      const btn = document.createElement('button');
      btn.className = `memory-card${card.isPuky ? ' puky-card' : ''}`;
      btn.dataset.cardId = card.id;
      btn.dataset.paired = card.paired;
      btn.dataset.emoji = card.emoji;
      btn.dataset.isPuky = card.isPuky ? '1' : '0';
      btn.innerHTML = `
        <div class="memory-card-front"></div>
        <div class="memory-card-back">${card.emoji}</div>
      `;
      btn.addEventListener('click', () => this._onMemoryCardClick(btn));
      grid.appendChild(btn);
    });
  }

  _onMemoryCardClick(btn) {
    const st = this._memoryState;
    if (!st) return;
    if (st.locked) return;
    if (btn.classList.contains('flipped') || btn.classList.contains('matched')) return;

    btn.classList.add('flipped');

    // Carta especial de Puky
    if (btn.dataset.isPuky === '1') {
      btn.classList.add('matched');
      st.matched++;
      this._updateMemoryStats();
      this._checkMemoryWin();

      // Feedback
      const zone = this._getContentZone();
      const fb = document.createElement('div');
      fb.className = 'game-feedback-bubble correct';
      fb.textContent = '¡Encontraste a Puky! 🐨✨';
      zone.insertBefore(fb, zone.firstChild);
      this._setTimeout(() => fb.remove(), 1500);
      return;
    }

    st.flipped.push(btn);

    if (st.flipped.length === 2) {
      st.locked = true;
      st.attempts++;
      const [a, b] = st.flipped;

      if (a.dataset.paired === b.dataset.paired) {
        // Pareja encontrada
        a.classList.add('matched');
        b.classList.add('matched');
        st.matched++;
        st.flipped = [];
        st.locked = false;
        this._updateMemoryStats();
        if (window.kiddoAudio && typeof window.kiddoAudio.playSuccessChime === 'function') {
          window.kiddoAudio.playSuccessChime();
        }
        this._checkMemoryWin();
      } else {
        // No coinciden — voltear después de 800ms
        this._setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          st.flipped = [];
          st.locked = false;
          this._updateMemoryStats();
        }, 800);
      }
    }
  }

  _updateMemoryStats() {
    const st = this._memoryState;
    const hasPuky = this._memoryHasPuky;
    const pairsCount = this._memoryPairs - (hasPuky ? 1 : 0);
    const total = hasPuky ? pairsCount + 1 : pairsCount;
    const pairsEl = document.getElementById('mem-pairs');
    const attEl = document.getElementById('mem-attempts');
    if (pairsEl) pairsEl.textContent = `Parejas: ${st.matched}/${total}`;
    if (attEl) attEl.textContent = `Intentos: ${st.attempts}`;
  }

  _checkMemoryWin() {
    const st = this._memoryState;
    const totalToMatch = this._memoryPairs;
    if (st.matched >= totalToMatch) {
      const elapsed = Math.round((Date.now() - st.startTime) / 1000);
      if (window.KiddoMissionEvents) {
        window.KiddoMissionEvents.emit('game_completed', {
          gameId: 'memory',
          size: st.size,
          difficulty: st.size === 3 ? 'easy' : st.size === 6 ? 'medium' : 'hard',
          matched: st.matched,
          attempts: st.attempts,
          elapsedSeconds: elapsed
        });
      }
      this._setTimeout(() => {
        const zone = this._getContentZone();
        if (!zone) return;
        const pw = document.getElementById('game-progress-wrap');
        if (pw) pw.style.display = 'none';
        zone.innerHTML = `
          <div class="game-result-screen">
            <div class="game-result-emoji">🏆</div>
            <h3 class="game-result-title">¡Excelente memoria!</h3>
            <div class="game-result-score">${st.matched}/${totalToMatch}</div>
            <p class="game-result-msg">Intentos: ${st.attempts} · Tiempo: ${elapsed}s</p>
            <div class="game-result-actions">
              <button class="game-btn-primary" onclick="window.kiddoGames._startMemory(${st.size})">🔄 Jugar otra vez</button>
              <button class="game-btn-secondary" onclick="window.kiddoGames.openMemory()">🎲 Cambiar tamaño</button>
              <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
            </div>
          </div>
        `;
        if (window.kiddoAudio && typeof window.kiddoAudio.playSuccessChime === 'function') {
          window.kiddoAudio.playSuccessChime();
        }
      }, 500);
    }
  }


  // ============================================================
  // JUEGO 2: SUMAR
  // ============================================================

  openSums() {
    this._currentGame = 'sums';
    this._startMathGame('sumas');
  }

  // ============================================================
  // JUEGO 3: RESTAR
  // ============================================================

  openSubtraction() {
    this._currentGame = 'subtraction';
    this._startMathGame('restas');
  }

  // ─── Motor matemático compartido ────────────────────────────

  _startMathGame(type) {
    const overlay = this._showOverlay(
      type === 'sumas'   ? 'Aprender a Sumar ➕' :
      type === 'restas'  ? 'Aprender a Restar ➖' : 'Matemáticas',
      true
    );

    const questions = this._generateMathQuestions(type, 10);
    this._mathState = { type, questions, current: 0, score: 0, answered: false };
    this._updateProgress(1, 10);
    this._renderMathQuestion();
  }

  _generateMathQuestions(type, count) {
    const questions = [];
    const seen = new Set();
    let safety = 0;

    while (questions.length < count && safety < 300) {
      safety++;
      let a, b, correct, display;

      if (type === 'sumas') {
        a = randInt(1, 80);
        b = randInt(1, 100 - a);
        correct = a + b;
        display = `${a} + ${b} = ?`;
        const key = `${a}+${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
      } else {
        a = randInt(2, 100);
        b = randInt(1, a - 1);
        correct = a - b;
        display = `${a} − ${b} = ?`;
        const key = `${a}-${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
      }

      const opts = makePlausibleDistractors(correct, 3, 0, 200);
      questions.push({ display, correct, opts });
    }
    return questions;
  }

  _renderMathQuestion() {
    const st = this._mathState;
    if (!st) return;
    const q = st.questions[st.current];
    st.answered = false;
    const zone = this._getContentZone();
    if (!zone) return;

    zone.innerHTML = `
      <div class="game-question-card">
        <p class="game-question-text">${q.display}</p>
        <p class="game-question-sub">¿Cuál es el resultado?</p>
      </div>
      <div class="game-options-row" id="math-options"></div>
      <div class="game-feedback-bubble hidden" id="math-feedback"></div>
    `;

    const optRow = document.getElementById('math-options');
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this._onMathAnswer(opt, q.correct, btn));
      optRow.appendChild(btn);
    });
  }

  _onMathAnswer(chosen, correct, btn) {
    const st = this._mathState;
    if (!st || st.answered) return;
    st.answered = true;

    // Deshabilitar todos los botones
    document.querySelectorAll('#math-options .game-option-btn').forEach(b => b.disabled = true);

    const fb = document.getElementById('math-feedback');
    const isCorrect = chosen === correct;

    if (isCorrect) {
      btn.classList.add('option-correct');
      st.score++;
    } else {
      btn.classList.add('option-incorrect');
      // Mostrar la correcta
      document.querySelectorAll('#math-options .game-option-btn').forEach(b => {
        if (parseInt(b.textContent) === correct) b.classList.add('option-correct');
      });
    }

    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      fb.textContent = isCorrect ? '✓ ¡Muy bien!' : `✗ ¡Casi! Era ${correct}`;
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.questions.length) {
        this._updateProgress(st.current + 1, st.questions.length);
        this._renderMathQuestion();
      } else {
        const typeName = st.type === 'sumas' ? 'Sumas' : 'Restas';
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: st.type === 'sumas' ? 'sums' : 'subtraction',
            type: st.type,
            score: st.score,
            total: st.questions.length
          });
        }
        this._showResult(st.score, st.questions.length, `¡Fin de ${typeName}!`, null, `
          <button class="game-btn-primary" onclick="window.kiddoGames._startMathGame('${st.type}')">🔄 Jugar otra vez</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 900);
  }


  // ============================================================
  // JUEGO 4: MULTIPLICAR
  // ============================================================

  openMultiplication() {
    this._currentGame = 'multiplication';
    const overlay = this._showOverlay('Aprender a Multiplicar ✖️', false);
    const pw = document.getElementById('game-progress-wrap');
    if (pw) pw.style.display = 'none';
    const zone = this._getContentZone();
    this._renderTimesTableSelector(zone);
  }

  _renderTimesTableSelector(zone) {
    const tables = [1,2,3,4,5,6,7,8,9,10];
    zone.innerHTML = `
      <div class="memory-size-selector">
        <div class="game-result-emoji" style="font-size:44px">✖️</div>
        <h3 class="memory-size-title">¿Qué tabla quieres practicar?</h3>
        <div class="times-table-grid">
          ${tables.map(n => `
            <button class="game-sub-select-btn" onclick="window.kiddoGames._startTimesTable(${n})">
              <span class="sub-icon">×${n}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  _startTimesTable(tableNum) {
    const overlay = this._getOrCreateOverlay();
    const titleEl = document.getElementById('game-top-title');
    if (titleEl) titleEl.textContent = `Tabla del ${tableNum} ✖️`;

    // Mostrar barra de progreso
    let pw = document.getElementById('game-progress-wrap');
    if (!pw) {
      const topBar = overlay.querySelector('.game-top-bar');
      pw = document.createElement('div');
      pw.className = 'game-progress-bar-wrap';
      pw.id = 'game-progress-wrap';
      pw.innerHTML = `
        <div class="game-progress-label" id="game-progress-label">Pregunta 1 de 10</div>
        <div class="game-progress-track"><div class="game-progress-fill" id="game-progress-fill" style="width:0%"></div></div>
      `;
      topBar.insertAdjacentElement('afterend', pw);
    }
    pw.style.display = '';

    // Generar 10 multiplicaciones de la tabla en orden aleatorio
    const multipliers = fisherYates([1,2,3,4,5,6,7,8,9,10]);
    const questions = multipliers.map(m => {
      const correct = tableNum * m;
      const opts = makePlausibleDistractors(correct, 3, 0, 200);
      return { display: `${tableNum} × ${m} = ?`, correct, opts, m };
    });

    this._multState = { tableNum, questions, current: 0, score: 0, answered: false };
    this._updateProgress(1, 10);
    this._renderMultQuestion();
  }

  _renderMultQuestion() {
    const st = this._multState;
    if (!st) return;
    const q = st.questions[st.current];
    st.answered = false;
    const zone = this._getContentZone();
    if (!zone) return;

    zone.innerHTML = `
      <div class="game-question-card">
        <p class="game-question-text">${q.display}</p>
        <p class="game-question-sub">Tabla del ${st.tableNum}</p>
      </div>
      <div class="game-options-row" id="mult-options"></div>
      <div class="game-feedback-bubble hidden" id="mult-feedback"></div>
    `;

    const optRow = document.getElementById('mult-options');
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this._onMultAnswer(opt, q.correct, btn));
      optRow.appendChild(btn);
    });
  }

  _onMultAnswer(chosen, correct, btn) {
    const st = this._multState;
    if (!st || st.answered) return;
    st.answered = true;

    document.querySelectorAll('#mult-options .game-option-btn').forEach(b => b.disabled = true);

    const fb = document.getElementById('mult-feedback');
    const isCorrect = chosen === correct;
    if (isCorrect) { btn.classList.add('option-correct'); st.score++; }
    else {
      btn.classList.add('option-incorrect');
      document.querySelectorAll('#mult-options .game-option-btn').forEach(b => {
        if (parseInt(b.textContent) === correct) b.classList.add('option-correct');
      });
    }

    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      fb.textContent = isCorrect ? '✓ ¡Muy bien!' : `✗ Era ${correct}`;
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.questions.length) {
        this._updateProgress(st.current + 1, st.questions.length);
        this._renderMultQuestion();
      } else {
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: 'multiplication',
            tableNum: st.tableNum,
            score: st.score,
            total: 10
          });
        }
        this._showResult(st.score, 10,
          `¡Completaste la tabla del ${st.tableNum}!`, null, `
          <button class="game-btn-primary" onclick="window.kiddoGames._startTimesTable(${st.tableNum})">🔄 Practicar nuevamente</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.openMultiplication()">🔢 Elegir otra tabla</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 900);
  }


  // ============================================================
  // JUEGO 5: DIVIDIR
  // ============================================================

  openDivision() {
    this._currentGame = 'division';
    const overlay = this._showOverlay('Aprender a Dividir ÷', false);
    const pw = document.getElementById('game-progress-wrap');
    if (pw) pw.style.display = 'none';
    const zone = this._getContentZone();
    this._renderDivisionSelector(zone);
  }

  _renderDivisionSelector(zone) {
    zone.innerHTML = `
      <div class="memory-size-selector">
        <div class="game-result-emoji" style="font-size:44px">➗</div>
        <h3 class="memory-size-title">¿Qué quieres practicar?</h3>
        <div class="division-select-options">
          <button class="memory-size-btn" onclick="window.kiddoGames._startDivision(1)">
            <span>Dividir por 1 cifra</span>
            <span class="size-badge">Fácil</span>
          </button>
          <button class="memory-size-btn" onclick="window.kiddoGames._startDivision(2)">
            <span>Dividir por 2 cifras</span>
            <span class="size-badge">Medio</span>
          </button>
          <button class="memory-size-btn" onclick="window.kiddoGames._startDivision(3)">
            <span>Dividir por 3 cifras</span>
            <span class="size-badge">Difícil</span>
          </button>
        </div>
      </div>
    `;
  }

  _startDivision(digits) {
    const overlay = this._getOrCreateOverlay();
    const titleEl = document.getElementById('game-top-title');
    if (titleEl) titleEl.textContent = `Dividir por ${digits} cifra${digits > 1 ? 's' : ''} ÷`;

    let pw = document.getElementById('game-progress-wrap');
    if (!pw) {
      const topBar = overlay.querySelector('.game-top-bar');
      pw = document.createElement('div');
      pw.className = 'game-progress-bar-wrap';
      pw.id = 'game-progress-wrap';
      pw.innerHTML = `
        <div class="game-progress-label" id="game-progress-label">Pregunta 1 de 10</div>
        <div class="game-progress-track"><div class="game-progress-fill" id="game-progress-fill" style="width:0%"></div></div>
      `;
      topBar.insertAdjacentElement('afterend', pw);
    }
    pw.style.display = '';

    const questions = this._generateDivisionQuestions(digits, 10);
    this._divState = { digits, questions, current: 0, score: 0, answered: false };
    this._updateProgress(1, 10);
    this._renderDivQuestion();
  }

  _generateDivisionQuestions(digits, count) {
    const questions = [];
    const seen = new Set();
    let safety = 0;

    // Rangos del divisor según cifras
    const divisorMin = digits === 1 ? 1 : digits === 2 ? 10 : 100;
    const divisorMax = digits === 1 ? 9 : digits === 2 ? 99 : 999;

    // Rango del cociente
    const quotientMin = 2;
    const quotientMax = digits === 1 ? 20 : digits === 2 ? 15 : 10;

    while (questions.length < count && safety < 500) {
      safety++;
      const divisor = randInt(divisorMin, divisorMax);
      if (divisor === 0) continue;
      const quotient = randInt(quotientMin, quotientMax);
      const dividend = divisor * quotient;

      // Validar división exacta
      if (dividend % divisor !== 0) continue;

      const key = `${dividend}/${divisor}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const opts = makePlausibleDistractors(quotient, 3, 1, 999);
      questions.push({ display: `${dividend} ÷ ${divisor} = ?`, correct: quotient, opts });
    }
    return questions;
  }

  _renderDivQuestion() {
    const st = this._divState;
    if (!st) return;
    const q = st.questions[st.current];
    if (!q) return;
    st.answered = false;
    const zone = this._getContentZone();
    if (!zone) return;

    zone.innerHTML = `
      <div class="game-question-card">
        <p class="game-question-text">${q.display}</p>
        <p class="game-question-sub">División exacta (sin resto)</p>
      </div>
      <div class="game-options-row" id="div-options"></div>
      <div class="game-feedback-bubble hidden" id="div-feedback"></div>
    `;

    const optRow = document.getElementById('div-options');
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this._onDivAnswer(opt, q.correct, btn));
      optRow.appendChild(btn);
    });
  }

  _onDivAnswer(chosen, correct, btn) {
    const st = this._divState;
    if (!st || st.answered) return;
    st.answered = true;

    document.querySelectorAll('#div-options .game-option-btn').forEach(b => b.disabled = true);

    const fb = document.getElementById('div-feedback');
    const isCorrect = chosen === correct;
    if (isCorrect) { btn.classList.add('option-correct'); st.score++; }
    else {
      btn.classList.add('option-incorrect');
      document.querySelectorAll('#div-options .game-option-btn').forEach(b => {
        if (parseInt(b.textContent) === correct) b.classList.add('option-correct');
      });
    }

    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      fb.textContent = isCorrect ? '✓ ¡Muy bien!' : `✗ Era ${correct}`;
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.questions.length) {
        this._updateProgress(st.current + 1, st.questions.length);
        this._renderDivQuestion();
      } else {
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: 'division',
            digits: st.digits,
            score: st.score,
            total: 10
          });
        }
        this._showResult(st.score, 10, '¡División completada!', null, `
          <button class="game-btn-primary" onclick="window.kiddoGames._startDivision(${st.digits})">🔄 Jugar otra vez</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.openDivision()">➗ Cambiar dificultad</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 900);
  }


  // ============================================================
  // JUEGO 6: APRENDER LA HORA
  // ============================================================

  openClock() {
    this._currentGame = 'clock';
    this._showOverlay('Aprender la Hora 🕒', true);

    const questions = this._generateClockQuestions(10);
    this._clockState = { questions, current: 0, score: 0, answered: false };
    this._updateProgress(1, 10);
    this._renderClockQuestion();
  }

  _generateClockQuestions(count) {
    // Horas posibles: exactas, y media, y cuarto, menos cuarto
    const possibleTimes = [];
    for (let h = 1; h <= 12; h++) {
      possibleTimes.push({ hour: h, min: 0 });
      possibleTimes.push({ hour: h, min: 30 });
      possibleTimes.push({ hour: h, min: 15 });
      possibleTimes.push({ hour: h, min: 45 });
    }

    const shuffled = fisherYates(possibleTimes);
    const selected = shuffled.slice(0, count);

    return selected.map(t => {
      const displayStr = this._formatTime(t.hour, t.min);
      const opts = this._generateClockDistractors(t.hour, t.min, displayStr);
      return { hour: t.hour, min: t.min, display: displayStr, opts };
    });
  }

  _formatTime(hour, min) {
    return `${hour}:${min.toString().padStart(2, '0')}`;
  }

  _generateClockDistractors(hour, min, correct) {
    const opts = new Set([correct]);
    const candidates = [];

    // Distractores plausibles: misma hora diferente minuto, o +/-1 hora
    const minuteVariants = [0, 15, 30, 45].filter(m => m !== min);
    minuteVariants.forEach(m => candidates.push(this._formatTime(hour, m)));

    const prevHour = hour === 1 ? 12 : hour - 1;
    const nextHour = hour === 12 ? 1 : hour + 1;
    [prevHour, nextHour].forEach(h => {
      candidates.push(this._formatTime(h, min));
    });

    for (const c of fisherYates(candidates)) {
      if (c !== correct) opts.add(c);
      if (opts.size === 3) break;
    }

    return fisherYates([...opts]);
  }

  _renderClockQuestion() {
    const st = this._clockState;
    if (!st) return;
    const q = st.questions[st.current];
    if (!q) return;
    st.answered = false;
    const zone = this._getContentZone();
    if (!zone) return;

    const svgClock = this._buildClockSVG(q.hour, q.min);

    zone.innerHTML = `
      <div class="game-question-card clock-container">
        ${svgClock}
        <p class="clock-question-label">¿Qué hora marca el reloj?</p>
      </div>
      <div class="game-options-row" id="clock-options"></div>
      <div class="game-feedback-bubble hidden" id="clock-feedback"></div>
    `;

    const optRow = document.getElementById('clock-options');
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt;
      btn.style.fontSize = '18px';
      btn.addEventListener('click', () => this._onClockAnswer(opt, q.display, btn));
      optRow.appendChild(btn);
    });
  }

  _buildClockSVG(hour, min) {
    const cx = 100, cy = 100, r = 90;

    // Minutero: apunta a los minutos (0 min = arriba = -90°)
    const minAngle = (min / 60) * 360 - 90;
    const minRad = (minAngle * Math.PI) / 180;
    const minLen = 65;
    const minX = cx + minLen * Math.cos(minRad);
    const minY = cy + minLen * Math.sin(minRad);

    // Horario: hora exacta + fracción de minutos
    const hourFrac = (hour % 12) + min / 60;
    const hourAngle = (hourFrac / 12) * 360 - 90;
    const hourRad = (hourAngle * Math.PI) / 180;
    const hourLen = 45;
    const hourX = cx + hourLen * Math.cos(hourRad);
    const hourY = cy + hourLen * Math.sin(hourRad);

    // Números del reloj
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const ang = ((i / 12) * 360 - 90) * Math.PI / 180;
      const nr = 74;
      const nx = cx + nr * Math.cos(ang);
      const ny = cy + nr * Math.sin(ang);
      numbers.push(`<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Fredoka,sans-serif" font-size="14" font-weight="bold" fill="#374151">${i}</text>`);
    }

    // Marcas de minutos
    const marks = [];
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * 2 * Math.PI - Math.PI / 2;
      const isHour = i % 5 === 0;
      const r1 = isHour ? 82 : 85;
      const r2 = 90;
      marks.push(`<line x1="${(cx + r1 * Math.cos(ang)).toFixed(1)}" y1="${(cy + r1 * Math.sin(ang)).toFixed(1)}" x2="${(cx + r2 * Math.cos(ang)).toFixed(1)}" y2="${(cy + r2 * Math.sin(ang)).toFixed(1)}" stroke="${isHour ? '#9CA3AF' : '#D1D5DB'}" stroke-width="${isHour ? 2 : 1}"/>`);
    }

    return `
      <svg class="analog-clock-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Fondo del reloj -->
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#E4C1F9" stroke-width="4"/>
        <circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="#FDFCFF" />
        <!-- Marcas de minutos/horas -->
        ${marks.join('')}
        <!-- Números -->
        ${numbers.join('')}
        <!-- Aguja horaria -->
        <line x1="${cx}" y1="${cy}" x2="${hourX.toFixed(1)}" y2="${hourY.toFixed(1)}" stroke="#374151" stroke-width="6" stroke-linecap="round"/>
        <!-- Aguja minutera -->
        <line x1="${cx}" y1="${cy}" x2="${minX.toFixed(1)}" y2="${minY.toFixed(1)}" stroke="#A9DEF9" stroke-width="4" stroke-linecap="round"/>
        <!-- Centro -->
        <circle cx="${cx}" cy="${cy}" r="6" fill="#E4C1F9"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#7C3AED"/>
      </svg>
    `;
  }

  _onClockAnswer(chosen, correct, btn) {
    const st = this._clockState;
    if (!st || st.answered) return;
    st.answered = true;

    document.querySelectorAll('#clock-options .game-option-btn').forEach(b => b.disabled = true);

    const fb = document.getElementById('clock-feedback');
    const isCorrect = chosen === correct;
    if (isCorrect) { btn.classList.add('option-correct'); st.score++; }
    else {
      btn.classList.add('option-incorrect');
      document.querySelectorAll('#clock-options .game-option-btn').forEach(b => {
        if (b.textContent === correct) b.classList.add('option-correct');
      });
    }

    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      fb.textContent = isCorrect ? '✓ ¡Muy bien!' : `✗ Era las ${correct}`;
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.questions.length) {
        this._updateProgress(st.current + 1, st.questions.length);
        this._renderClockQuestion();
      } else {
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: 'clock',
            score: st.score,
            total: 10
          });
        }
        this._showResult(st.score, 10, '¡Eres un experto del tiempo!', null, `
          <button class="game-btn-primary" onclick="window.kiddoGames.openClock()">🔄 Jugar otra vez</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 900);
  }


  // ============================================================
  // JUEGO 7: COMPLETAR CON SÍLABAS
  // ============================================================

  openSyllables() {
    this._currentGame = 'syllables';
    this._showOverlay('Completar con Sílabas 🔤', true);

    const pool = fisherYates(SYLLABLE_BANK).slice(0, 10);
    this._syllState = { pool, current: 0, score: 0, answered: false };
    this._updateProgress(1, 10);
    this._renderSyllQuestion();
  }

  _renderSyllQuestion() {
    const st = this._syllState;
    if (!st) return;
    const item = st.pool[st.current];
    st.answered = false;
    const zone = this._getContentZone();
    if (!zone) return;

    // Opciones: la correcta + 2 distractores
    const otherSyllables = fisherYates(SYLLABLE_DISTRACTORS.filter(s => s !== item.missing));
    const opts = fisherYates([item.missing, otherSyllables[0], otherSyllables[1]]);

    // Construir visualización de la palabra
    const displayHtml = this._buildWordDisplay(item.word, item.missing, item.pos);

    zone.innerHTML = `
      <div class="game-question-card word-image-container">
        <div class="word-image-emoji">${item.image}</div>
        <p class="word-display-text">${displayHtml}</p>
        <p class="game-question-sub">Completa la palabra</p>
      </div>
      <div class="game-options-row" id="syll-options"></div>
      <div class="game-feedback-bubble hidden" id="syll-feedback"></div>
    `;

    const optRow = document.getElementById('syll-options');
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt;
      btn.style.fontSize = '20px';
      btn.style.minWidth = '90px';
      btn.addEventListener('click', () => this._onSyllAnswer(opt, item.missing, btn));
      optRow.appendChild(btn);
    });
  }

  _buildWordDisplay(word, missing, pos) {
    // Dividir la palabra en sílabas aproximadas para mostrar el hueco
    const missingLower = missing;
    const wordU = word.toUpperCase();
    const missingU = missing.toUpperCase();

    const idx = wordU.indexOf(missingU);
    if (idx === -1) return wordU; // fallback

    const before = wordU.substring(0, idx);
    const after  = wordU.substring(idx + missingU.length);

    return `${before}<span class="word-blank">___</span>${after}`;
  }

  _onSyllAnswer(chosen, correct, btn) {
    const st = this._syllState;
    if (!st || st.answered) return;
    st.answered = true;

    document.querySelectorAll('#syll-options .game-option-btn').forEach(b => b.disabled = true);

    const fb = document.getElementById('syll-feedback');
    const isCorrect = chosen === correct;
    if (isCorrect) { btn.classList.add('option-correct'); st.score++; }
    else {
      btn.classList.add('option-incorrect');
      document.querySelectorAll('#syll-options .game-option-btn').forEach(b => {
        if (b.textContent === correct) b.classList.add('option-correct');
      });
    }

    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      const item = st.pool[st.current];
      fb.textContent = isCorrect ? `✓ ¡Muy bien! La palabra es ${item.word}` : `✗ Era "${correct}" → ${item.word}`;
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.pool.length) {
        this._updateProgress(st.current + 1, st.pool.length);
        this._renderSyllQuestion();
      } else {
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: 'syllables',
            score: st.score,
            total: 10
          });
        }
        this._showResult(st.score, 10, '¡Experto en sílabas!', null, `
          <button class="game-btn-primary" onclick="window.kiddoGames.openSyllables()">🔄 Jugar otra vez</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 1000);
  }


  // ============================================================
  // JUEGO 8: ARMAR PALABRAS
  // ============================================================

  openWordBuilder() {
    this._currentGame = 'wordbuilder';
    this._showOverlay('Armar Palabras 🔡', true);

    const pool = fisherYates(WORD_BUILDER_BANK).slice(0, 10);
    this._wbState = { pool, current: 0, score: 0 };
    this._updateProgress(1, 10);
    this._renderWordBuilderQuestion();
  }

  _renderWordBuilderQuestion() {
    const st = this._wbState;
    if (!st) return;
    const item = st.pool[st.current];
    const zone = this._getContentZone();
    if (!zone) return;

    // Crear fichas con IDs únicos (para letras repetidas)
    const letters = item.word.split('').map((ch, i) => ({ ch, id: `tile-${i}` }));

    // Fisher-Yates shuffle, verificar que no quede igual al original
    let shuffled = fisherYates(letters);
    let safetyWB = 0;
    while (shuffled.map(t => t.ch).join('') === item.word && safetyWB < 20) {
      shuffled = fisherYates(letters);
      safetyWB++;
    }

    this._wbState.answer = [];   // array de { ch, id } que el niño ha seleccionado
    this._wbState.letters = shuffled;

    zone.innerHTML = `
      <div class="game-question-card word-image-container">
        <div class="word-image-emoji">${item.image}</div>
        <p class="game-question-sub">Ordena las letras para formar la palabra</p>
      </div>
      <div class="word-builder-zone">
        <div class="word-answer-slots" id="wb-answer-slots"></div>
        <div class="word-letter-tiles" id="wb-tiles"></div>
        <button class="game-btn-secondary" id="wb-clear-btn" onclick="window.kiddoGames._clearWordBuilder()" style="max-width:200px; margin:0 auto;">
          🗑️ Borrar todo
        </button>
      </div>
      <div class="game-feedback-bubble hidden" id="wb-feedback"></div>
    `;

    this._renderWBTiles();
    this._renderWBSlots();
  }

  _renderWBTiles() {
    const st = this._wbState;
    const tilesContainer = document.getElementById('wb-tiles');
    if (!tilesContainer) return;

    tilesContainer.innerHTML = '';
    st.letters.forEach(tile => {
      const btn = document.createElement('button');
      btn.className = 'word-letter-tile';
      btn.id = tile.id;
      btn.textContent = tile.ch;
      const isUsed = st.answer.some(a => a.id === tile.id);
      if (isUsed) btn.classList.add('used');
      btn.addEventListener('click', () => this._onWBTileClick(tile));
      tilesContainer.appendChild(btn);
    });
  }

  _renderWBSlots() {
    const st = this._wbState;
    const slotsContainer = document.getElementById('wb-answer-slots');
    if (!slotsContainer) return;
    const item = st.pool[st.current];
    const totalSlots = item.word.length;

    slotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'word-slot';
      if (i < st.answer.length) {
        slot.textContent = st.answer[i].ch;
        slot.addEventListener('click', () => this._onWBSlotClick(i));
      }
      slotsContainer.appendChild(slot);
    }

    // Verificar automáticamente si la palabra está completa
    if (st.answer.length === totalSlots) {
      this._checkWordBuilder();
    }
  }

  _onWBTileClick(tile) {
    const st = this._wbState;
    if (!st) return;
    const item = st.pool[st.current];
    if (st.answer.length >= item.word.length) return;
    if (st.answer.some(a => a.id === tile.id)) return; // ya usada

    st.answer.push(tile);
    this._renderWBTiles();
    this._renderWBSlots();
  }

  _onWBSlotClick(idx) {
    const st = this._wbState;
    if (!st) return;
    // Quitar la letra de ese slot en adelante
    st.answer.splice(idx);
    this._renderWBTiles();
    this._renderWBSlots();
  }

  _clearWordBuilder() {
    const st = this._wbState;
    if (!st) return;
    st.answer = [];
    this._renderWBTiles();
    this._renderWBSlots();
  }

  _checkWordBuilder() {
    const st = this._wbState;
    if (!st) return;
    const item = st.pool[st.current];
    const formed = st.answer.map(a => a.ch).join('');
    const isCorrect = formed === item.word;

    // Marcar slots
    const slots = document.querySelectorAll('#wb-answer-slots .word-slot');
    slots.forEach(s => s.classList.toggle('correct-slot', isCorrect));

    const fb = document.getElementById('wb-feedback');
    if (fb) {
      fb.classList.remove('hidden');
      fb.className = `game-feedback-bubble ${isCorrect ? 'correct' : 'incorrect'}`;
      fb.textContent = isCorrect
        ? `✓ ¡Correcto! La palabra es ${item.word} ${item.image}`
        : `✗ Eso dice "${formed}", la palabra es ${item.word}`;
    }

    if (isCorrect) st.score++;

    if (window.KiddoMissionEvents) {
      window.KiddoMissionEvents.emit('word_completed', {
        word: item.word,
        isCorrect: isCorrect
      });
    }

    if (window.kiddoAudio) {
      if (isCorrect && typeof window.kiddoAudio.playSuccessChime === 'function') window.kiddoAudio.playSuccessChime();
      else if (typeof window.kiddoAudio.playBubbleSound === 'function') window.kiddoAudio.playBubbleSound();
    }

    // Deshabilitar fichas
    document.querySelectorAll('#wb-tiles .word-letter-tile').forEach(b => b.disabled = true);
    document.querySelectorAll('#wb-answer-slots .word-slot').forEach(s => s.style.pointerEvents = 'none');

    this._setTimeout(() => {
      st.current++;
      if (st.current < st.pool.length) {
        this._updateProgress(st.current + 1, st.pool.length);
        this._renderWordBuilderQuestion();
      } else {
        if (window.KiddoMissionEvents) {
          window.KiddoMissionEvents.emit('game_completed', {
            gameId: 'words',
            score: st.score,
            total: 10
          });
        }
        this._showResult(st.score, 10, '¡Palabras completadas!', null, `
          <button class="game-btn-primary" onclick="window.kiddoGames.openWordBuilder()">🔄 Jugar otra vez</button>
          <button class="game-btn-secondary" onclick="window.kiddoGames.closeGame()">🏠 Volver a Juegos</button>
        `);
      }
    }, 1200);
  }
}


// ============================================================
// INSTANCIA GLOBAL Y PANTALLA DE SELECCIÓN
// ============================================================

window.kiddoGames = new KiddoGames();

/** Definición de los 8 juegos para la pantalla principal */
window.KIDDO_GAMES_LIST = [
  {
    id: 'memory',
    name: 'Memoria',
    desc: 'Encuentra las parejas',
    emoji: '🧠',
    color: 'pink',
    image: 'assets/games-redesign/card-memoria.png.png',
    action: 'window.kiddoGames.openMemory()'
  },
  {
    id: 'sums',
    name: 'Aprender a Sumar',
    desc: 'Suma del 1 al 100',
    emoji: '➕',
    color: 'blue',
    image: 'assets/games-redesign/card-aprender-sumar.png.png',
    action: 'window.kiddoGames.openSums()'
  },
  {
    id: 'subtraction',
    name: 'Aprender a Restar',
    desc: 'Restas sin negativos',
    emoji: '➖',
    color: 'yellow',
    image: 'assets/games-redesign/card-aprender-restar.png.png',
    action: 'window.kiddoGames.openSubtraction()'
  },
  {
    id: 'multiplication',
    name: 'Multiplicar',
    desc: 'Elige una tabla del 1 al 10',
    emoji: '✖️',
    color: 'green',
    image: 'assets/games-redesign/card-multiplicar.png.png',
    action: 'window.kiddoGames.openMultiplication()'
  },
  {
    id: 'division',
    name: 'Dividir',
    desc: 'Divisiones exactas',
    emoji: '➗',
    color: 'purple',
    image: 'assets/games-redesign/card-dividir.png.png',
    action: 'window.kiddoGames.openDivision()'
  },
  {
    id: 'clock',
    name: 'Aprender la Hora',
    desc: 'Reloj analógico',
    emoji: '🕒',
    color: 'orange',
    image: 'assets/games-redesign/card-aprender-hora.png.png',
    action: 'window.kiddoGames.openClock()'
  },
  {
    id: 'syllables',
    name: 'Completar Sílabas',
    desc: 'Completa la palabra',
    emoji: '🔤',
    color: 'mint',
    image: 'assets/games-redesign/card-completar-silabas.png.png',
    action: 'window.kiddoGames.openSyllables()'
  },
  {
    id: 'wordbuilder',
    name: 'Armar Palabras',
    desc: 'Ordena las letras',
    emoji: '🔡',
    color: 'sky',
    image: 'assets/games-redesign/card-armar-palabras.png.png',
    action: 'window.kiddoGames.openWordBuilder()'
  },
];
