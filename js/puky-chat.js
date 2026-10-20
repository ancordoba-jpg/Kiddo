/**
 * KIDDO — PukyChatManager
 * Chat contextual con Puky.
 * - Modo DEMO: respuestas deterministicas con contexto de historial.
 * - Capa de servicio preparada para conectar IA futura via backend seguro.
 * - Seguridad infantil: sin datos personales, sin contenido inapropiado.
 * - No expone API keys. No ejecuta HTML del usuario.
 */
(function () {
  "use strict";

  // ── CONFIGURACIÓN ────────────────────────────────────────────────────────
  var CONFIG = {
    maxHistory: 10,          // Máximo de mensajes a conservar en sesión
    typingDelay: 700,        // ms de "Puky está escribiendo..."
    maxInputLength: 200,     // Caracteres máximos por mensaje
    demoMode: true,          // true = sin IA externa (modo seguro por defecto)
    aiEndpoint: null,        // URL del backend seguro cuando esté disponible
    ageRange: "4-12"
  };

  // ── RESPUESTAS DEMO ─────────────────────────────────────────────────────
  // Estructura: { keywords: [], response: "" }
  // El sistema elige la primera regla cuya keyword aparezca en el mensaje.
  var DEMO_RULES = [
    { kw:["hola","buenos dias","buenas tardes","buenas noches","hi"],
      r:"¡Hola! ¡Qué alegría saludarte! ¿Cómo estás hoy? 🐨✨" },
    { kw:["como estas","como te va","que tal"],
      r:"¡Estoy muy contento comiendo hojitas de eucalipto! 🍃 ¿Y vos? ¿Qué querés hacer hoy?" },
    { kw:["bien","genial","excelente","feliz","contento"],
      r:"¡Me alegra mucho escucharte! Cuando estás feliz, yo también lo estoy. 💖" },
    { kw:["mal","triste","llore","lloro","frustrado","enojado"],
      r:"Uy, lo siento mucho. 😟 A veces los días no salen como queremos. ¿Querés contarme qué pasó? Podemos intentar sentirlos mejor juntos — o podés hablar con alguien de confianza en casa. 🤗" },
    { kw:["miedo","asustado","susto","peligro","me lastiman","me pegan"],
      r:"Si sentís miedo o estás en peligro, lo más importante es contárselo a un adulto de confianza, como tu mamá, tu papá o tu maestra. Ellos pueden ayudarte. 💛" },
    { kw:["cuanto es","suma","quanto es","cuánto es","más","mas","multiplicar","dividir","resta","restar","sumar"],
      r:null,  // Se procesa especialmente abajo
      special:"math" },
    { kw:["jugar","juego","juegos","quiero jugar"],
      r:"¡Me encanta jugar! En Kiddo podés sumar, armar palabras o tocar el piano. ¿A cuál querés ir? 🎮" },
    { kw:["cuento","historia","leer"],
      r:"¡Los cuentos son mágicos! Podés ir a la sección Cuentos y elegir el que más te guste. 📖" },
    { kw:["musica","piano","melodia","cantar","cancion"],
      r:"¡Tocar el piano es divertidísimo! Vayamos a la sección Música. 🎵" },
    { kw:["te quiero","te amo","te adoro"],
      r:"¡Yo también te quiero mucho, amiguito! Sos muy especial para mí. 💖🐨" },
    { kw:["adios","chau","hasta luego","bye","hasta pronto"],
      r:"¡Hasta prontito! Te mando un abrazo de koala gigante. 🤗🐨" },
    { kw:["gracias"],
      r:"¡De nada! Para eso estoy, para ayudarte y acompañarte. 😊" },
    { kw:["por que","porque","cómo funciona","como funciona","qué es","que es"],
      r:"¡Buena pregunta! Me encanta que seas curioso. 🌟 Si es sobre algo de Kiddo, juntos lo descubrimos." },
    { kw:["hambre","comer","fruta","verdura","comida"],
      r:"¡Recuerda comer algo rico y saludable! Una manzana, una banana o uvas son perfectas. 🍎🍌" },
    { kw:["mision","misiones","tarea"],
      r:"¡Las misiones diarias son geniales! Completarlas te hace sentir muy bien. ¿Ya hiciste la de hoy? 🌟" }
  ];

  var DEFAULT_RESPONSE = "¡Qué interesante lo que me decís! Me encanta ser tu compañero. ¿Querés jugar, leer un cuento o charlar un poco más? 🐨";

  // ── SEGURIDAD ────────────────────────────────────────────────────────────
  /** Escapa HTML del usuario para prevenir XSS. */
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /** Detecta intento de inyección de comandos/HTML. Devuelve true si sospechoso. */
  function isSuspicious(text) {
    return /<[^>]+>|javascript:|data:|vbscript:/i.test(text);
  }

  // ── PROCESAMIENTO ESPECIAL: MATEMÁTICAS ─────────────────────────────────
  function tryMath(text) {
    // Detectar sumas simples: "cuanto es 8 mas 5", "8+5", "3 más 4"
    var expr = text
      .replace(/más|mas/gi, "+")
      .replace(/menos/gi, "-")
      .replace(/por/gi, "*")
      .replace(/dividido/gi, "/")
      .replace(/[^0-9+\-*/.\s]/g, " ")
      .trim();
    var match = expr.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (match) {
      var a = parseFloat(match[1]), op = match[2], b = parseFloat(match[3]), res;
      if (op === "+") res = a + b;
      else if (op === "-") res = a - b;
      else if (op === "*") res = a * b;
      else if (op === "/" && b !== 0) res = +(a / b).toFixed(2);
      else return null;
      return a + " " + op + " " + b + " = " + res + ". ¡Muy bien! ¿Querés resolver otra operación? 🧮✨";
    }
    return null;
  }

  // ── MOTOR DE RESPUESTA DEMO ──────────────────────────────────────────────
  function getDemoResponse(text, history) {
    var clean = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    for (var i = 0; i < DEMO_RULES.length; i++) {
      var rule = DEMO_RULES[i];
      for (var j = 0; j < rule.kw.length; j++) {
        if (clean.indexOf(rule.kw[j]) !== -1) {
          if (rule.special === "math") {
            var mathResult = tryMath(clean);
            return mathResult || "Las matemáticas son geniales. ¿Me contás qué operación querés resolver? Podés escribirla así: 8 más 5. 🧮";
          }
          return rule.r;
        }
      }
    }
    return DEFAULT_RESPONSE;
  }

  // ── MANAGER ─────────────────────────────────────────────────────────────
  function ChatManager() {
    this.history  = [];   // { role: "user"|"puky", text: "" }
    this.busy     = false;
    this.opened   = false;
  }

  ChatManager.prototype.open = function() {
    var modal = document.getElementById("puky-chat-modal");
    if (!modal) return;
    modal.classList.add("active");
    if (!this.opened) {
      this.opened = true;
      this._clearMessages();
      this._appendPuky("¡Hola! Soy Puky 🐨 ¿De qué querés charlar hoy?");
    }
    var input = document.getElementById("puky-chat-input");
    if (input) { input.focus(); input.maxLength = CONFIG.maxInputLength; }
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  };

  ChatManager.prototype.close = function() {
    var modal = document.getElementById("puky-chat-modal");
    if (modal) modal.classList.remove("active");
  };

  ChatManager.prototype.send = function(customText) {
    if (this.busy) return;
    var input = document.getElementById("puky-chat-input");
    var text  = customText || (input ? input.value.trim() : "");
    if (!text) return;
    if (text.length > CONFIG.maxInputLength) {
      text = text.substring(0, CONFIG.maxInputLength);
    }

    // Seguridad: bloquear HTML/scripts del usuario
    if (isSuspicious(text)) {
      this._appendPuky("Por favor escribí solo palabras. 😊");
      if (input) input.value = "";
      return;
    }

    if (input) input.value = "";
    this._appendUser(text);
    this.history.push({ role:"user", text:text });
    if (this.history.length > CONFIG.maxHistory) this.history.shift();

    this._setTyping(true);
    this.busy = true;
    var self = this;

    // Capa de servicio: si hay endpoint configurado, usar IA; si no, modo demo
    if (!CONFIG.demoMode && CONFIG.aiEndpoint) {
      self._callAI(text).then(function(reply) {
        self._onReply(reply);
      }).catch(function() {
        self._onReply("¡Ups! No pude conectarme ahora. ¿Probamos hablar en modo local? 🐨");
      });
    } else {
      setTimeout(function() {
        var reply = getDemoResponse(text, self.history);
        self._onReply(reply);
      }, CONFIG.typingDelay);
    }
  };

  ChatManager.prototype._onReply = function(reply) {
    this._setTyping(false);
    this.busy = false;
    this._appendPuky(reply);
    this.history.push({ role:"puky", text:reply });
    if (this.history.length > CONFIG.maxHistory) this.history.shift();
    if (window.puky2D) window.puky2D.showHappy(1500);
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
  };

  /**
   * Stub para futura integración con backend seguro.
   * El backend debe:
   *   - Recibir el historial (sin datos personales).
   *   - Tener rate limiting y protección anti-abuso.
   *   - Guardar API key solo en variables de entorno del servidor.
   *   - Requerir autorización parental antes de activarse.
   */
  ChatManager.prototype._callAI = function(text) {
    return new Promise(function(resolve, reject) {
      fetch(CONFIG.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: [] })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) { resolve(data.reply || DEFAULT_RESPONSE); })
      .catch(reject);
    });
  };

  // ── HELPERS UI ───────────────────────────────────────────────────────────
  ChatManager.prototype._appendUser = function(text) {
    var list = document.getElementById("puky-chat-messages");
    if (!list) return;
    var div = document.createElement("div");
    div.className = "chat-msg user-msg";
    div.innerHTML = '<div class="msg-bubble">' + escapeHtml(text) + '</div><div class="msg-avatar">👦</div>';
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  };

  ChatManager.prototype._appendPuky = function(text) {
    var list = document.getElementById("puky-chat-messages");
    if (!list) return;
    var typing = document.getElementById("puky-typing-indicator");
    if (typing) typing.remove();
    var div = document.createElement("div");
    div.className = "chat-msg puky-msg";
    div.innerHTML = '<div class="msg-avatar">🐨</div><div class="msg-bubble">' + escapeHtml(text) + '</div>';
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  };

  ChatManager.prototype._setTyping = function(active) {
    var list = document.getElementById("puky-chat-messages");
    if (!list) return;
    var existing = document.getElementById("puky-typing-indicator");
    if (active && !existing) {
      var div = document.createElement("div");
      div.className = "chat-msg puky-msg";
      div.id = "puky-typing-indicator";
      div.innerHTML = '<div class="msg-avatar">🐨</div><div class="msg-bubble msg-typing"><span></span><span></span><span></span></div>';
      list.appendChild(div);
      list.scrollTop = list.scrollHeight;
    } else if (!active && existing) {
      existing.remove();
    }
    var btn = document.getElementById("puky-send-btn");
    if (btn) btn.disabled = active;
    var inp = document.getElementById("puky-chat-input");
    if (inp) inp.disabled = active;
  };

  ChatManager.prototype._clearMessages = function() {
    var list = document.getElementById("puky-chat-messages");
    if (list) list.innerHTML = "";
  };

  // ── EXPORT ───────────────────────────────────────────────────────────────
  window.pukyChat = new ChatManager();
})();
