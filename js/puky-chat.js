/**
 * KIDDO — PukyChatManager (Versión Mejorada)
 * Chat local contextual para niños de 4 a 12 años.
 * - Memoria conversacional de sesión (tema, último cálculo, preguntas).
 * - Procesador matemático seguro (sin eval ni new Function).
 * - Detección de intenciones por prioridades estrictas.
 * - Seguridad infantil reforzada: protección contra datos personales, peligro y XSS.
 * - 100% offline y sin dependencias externas.
 */
(function () {
  "use strict";

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }

  // ── CONFIGURACIÓN ────────────────────────────────────────────────────────
  var CONFIG = {
    maxHistory: 12,          // Máximo de mensajes en sesión
    typingDelay: 650,        // ms de "Puky está escribiendo..."
    maxInputLength: 200,     // Caracteres máximos por mensaje
    demoMode: true,          // true = modo local sin IA externa
    aiEndpoint: null
  };

  // ── ESTADO CONTEXTUAL DE SESIÓN ──────────────────────────────────────────
  function ChatContext() {
    this.lastTopic = null;        // 'math', 'school', 'games', 'stories', 'music', 'emotions', 'puky', 'greeting', etc.
    this.lastSubTopic = null;     // 'math_school', 'general_school', etc.
    this.lastMathResult = null;   // Número del último resultado matemático
    this.lastQuestion = null;     // Tipo de última pregunta hecha por Puky
    this.consecutiveUnknowns = 0; // Contador de respuestas no comprendidas
  }

  // ── UTILIDADES DE NORMALIZACIÓN Y SELECCIÓN ──────────────────────────────
  function normalizeText(text) {
    if (typeof text !== "string") return "";
    var s = text.toLowerCase();
    if (s.normalize) {
      try {
        s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      } catch (e) {}
    }
    s = s.replace(/[\u00E1\u00E0\u00E4\u00E2]/g, "a")
         .replace(/[\u00E9\u00E8\u00EB\u00EA]/g, "e")
         .replace(/[\u00ED\u00EC\u00EF\u00EE]/g, "i")
         .replace(/[\u00F3\u00F2\u00F6\u00F4]/g, "o")
         .replace(/[\u00FA\u00F9\u00FC\u00FB]/g, "u")
         .replace(/[\u00F1]/g, "n");
    s = s.replace(/[¿?¡!.,;:_~#*()[\]{}<>"-]/g, " ");
    return s.replace(/\s+/g, " ").trim();
  }

  function normalizeMathText(text) {
    if (typeof text !== "string") return "";
    var s = text.toLowerCase();
    if (s.normalize) {
      try {
        s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      } catch (e) {}
    }
    s = s.replace(/[\u00E1\u00E0\u00E4\u00E2]/g, "a")
         .replace(/[\u00E9\u00E8\u00EB\u00EA]/g, "e")
         .replace(/[\u00ED\u00EC\u00EF\u00EE]/g, "i")
         .replace(/[\u00F3\u00F2\u00F6\u00F4]/g, "o")
         .replace(/[\u00FA\u00F9\u00FC\u00FB]/g, "u")
         .replace(/[\u00F1]/g, "n");
    s = s.replace(/[¿?¡!.,;:_~#()[\]{}<>"]/g, " ");
    return s.replace(/\s+/g, " ").trim();
  }

  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function hasWord(norm, word) {
    var regex = new RegExp("(?:^|\\s)" + word + "(?:\\s|$)", "i");
    return regex.test(norm);
  }

  function hasAnyWord(norm, words) {
    for (var i = 0; i < words.length; i++) {
      if (hasWord(norm, words[i])) return true;
    }
    return false;
  }

  function hasAnyPhrase(norm, phrases) {
    for (var i = 0; i < phrases.length; i++) {
      if (norm.indexOf(phrases[i]) !== -1) return true;
    }
    return false;
  }

  // ── SEGURIDAD INFANTIL ───────────────────────────────────────────────────
  function escapeHtml(text) {
    if (typeof text !== "string") return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isSuspicious(text) {
    return /<[^>]+>|javascript:|data:|vbscript:/i.test(text);
  }

  function checkSafety(rawText, norm) {
    // 1. Inyección de código / scripts
    if (isSuspicious(rawText)) {
      return "Por favor escribí solo palabras sencillas. 😊";
    }

    // 2. Situaciones de peligro o daño físico
    var dangerPhrases = [
      "me pegan", "me lastiman", "me tocan", "me golpean", "me amenazan",
      "tengo miedo", "mucho miedo", "peligro", "socorro", "auxilio", "emergencia",
      "me quieren hacer dano", "me hacen dano"
    ];
    if (hasAnyPhrase(norm, dangerPhrases)) {
      return "Si sentís miedo o estás en una situación que te hace daño, por favor contáselo ya mismo a un adulto de confianza: tu mamá, tu papá, un familiar o tu maestra. Ellos están para cuidarte y ayudarte. 💛";
    }

    // 3. Secretos que causan angustia
    var secretPhrases = [
      "secreto malo", "guardar un secreto", "no le digas a mama", "no le digas a papa",
      "no le cuentes a nadie", "no le puedo decir a nadie"
    ];
    if (hasAnyPhrase(norm, secretPhrases)) {
      return "Los secretos que te hacen sentir mal, triste o con miedo nunca deben guardarse. Contáselo siempre a un adulto en quien confíes. ¡Te van a comprender y cuidar! 🌟";
    }

    // 4. Datos personales
    var dataPhrases = [
      "mi direccion es", "vivo en", "mi telefono es", "mi celular es",
      "mi numero de telefono", "mi clave es", "mi contrasena es", "mi password",
      "mi tarjeta", "mi apellido es", "mi dni"
    ];
    if (hasAnyPhrase(norm, dataPhrases) || /\b(?:telefono|celular|wsp|whatsapp)\s*(?:es\s*)?\d{6,}\b/i.test(norm)) {
      return "¡Cuidado con tus datos personales! Acordate de nunca compartir tu dirección, teléfono, escuela o contraseñas en internet. Es información privada para vos y tu familia. 🔒✨";
    }

    return null;
  }

  // ── PROCESADOR MATEMÁTICO SEGURO (SIN EVAL) ───────────────────────────────
  function processMath(text, context) {
    var norm = normalizeMathText(text);

    // No confundir quejas escolares con pedidos de operaciones
    if (/me fue mal|mala nota|no entiend|no me sale|me cuesta|reprobe|desaprobe|odio|dificil/i.test(norm) && /matematica|prueba|tarea|examen|escuela/i.test(norm)) {
      return null;
    }

    // 1. Operaciones unarias ("el doble de X", "la mitad de X", "el triple de X")
    var dobleM = norm.match(/\b(?:el\s+)?doble\s+de\s+(\d+(?:\.\d+)?)\b/i);
    if (dobleM) {
      var a = parseFloat(dobleM[1]);
      var res = +(a * 2).toFixed(2);
      context.lastMathResult = res;
      context.lastTopic = "math";
      context.lastQuestion = "math_more";
      return "El doble de " + a + " es " + res + ". ¡Exacto! 🧮✨";
    }

    var mitadM = norm.match(/\b(?:la\s+)?mitad\s+de\s+(\d+(?:\.\d+)?)\b/i);
    if (mitadM) {
      var a = parseFloat(mitadM[1]);
      var res = +(a / 2).toFixed(2);
      context.lastMathResult = res;
      context.lastTopic = "math";
      context.lastQuestion = "math_more";
      return "La mitad de " + a + " es " + res + ". ¡Muy bien! 🧮✨";
    }

    var tripleM = norm.match(/\b(?:el\s+)?triple\s+de\s+(\d+(?:\.\d+)?)\b/i);
    if (tripleM) {
      var a = parseFloat(tripleM[1]);
      var res = +(a * 3).toFixed(2);
      context.lastMathResult = res;
      context.lastTopic = "math";
      context.lastQuestion = "math_more";
      return "El triple de " + a + " es " + res + ". ¡Excelente! 🧮✨";
    }

    // 2. Operaciones binarias completas (ej: "cuanto es 8 mas 5", "7 + 9", "12 menos 4", "3 por 4", "20 dividido por 5")
    var binM = norm.match(/(\d+(?:\.\d+)?)\s*(?:\+|\-|más|mas|menos|por|\*|x|dividido\s+por|dividido\s+entre|dividido|entre|\/)\s*(\d+(?:\.\d+)?)/i);
    if (binM) {
      var a = parseFloat(binM[1]);
      var b = parseFloat(binM[2]);
      var matchWhole = binM[0];
      var opPart = matchWhole.substring(binM[1].length, matchWhole.length - binM[2].length).trim();

      var op = "+";
      var sym = "+";
      if (/menos|\-/i.test(opPart)) { op = "-"; sym = "−"; }
      else if (/por|\*|x/i.test(opPart)) { op = "*"; sym = "×"; }
      else if (/dividido|entre|\//i.test(opPart)) { op = "/"; sym = "÷"; }

      if (op === "/" && b === 0) {
        return "¡Uy! No se puede dividir por cero en matemáticas. ¡Es una regla que no se puede romper! 🐨";
      }

      var res;
      if (op === "+") res = a + b;
      else if (op === "-") res = a - b;
      else if (op === "*") res = a * b;
      else if (op === "/") res = a / b;

      res = +(res.toFixed(2));
      context.lastMathResult = res;
      context.lastTopic = "math";
      context.lastQuestion = "math_more";

      var responses = [
        a + " " + sym + " " + b + " = " + res + ". ¡Muy bien! 🧮✨",
        a + " " + sym + " " + b + " da " + res + ". ¡Excelente!",
        "¡Qué buena cuenta! " + a + " " + sym + " " + b + " = " + res + ". 🐨"
      ];
      return pickOne(responses);
    }

    // 3. Operaciones de seguimiento con resultado anterior
    var followDiv = norm.match(/(?:(?:y\s+)?(?:si\s+)?(?:lo\s+)?divid(?:o|ilo|ir)(?:\s+(?:por|entre))?|dividido(?:\s+(?:por|entre))?|\/)\s+(\d+(?:\.\d+)?)/i);
    var followMul = (!followDiv && !/divid/i.test(norm)) ? norm.match(/(?:(?:y\s+)?(?:si\s+)?(?:lo\s+)?multiplic(?:o|alo|ar)(?:\s+por)?|\bpor\b|\*|\bx\b)\s+(\d+(?:\.\d+)?)/i) : null;
    var followAdd = norm.match(/(?:(?:y\s+)?(?:si\s+)?(?:le\s+)?sum(?:o|ale|ar)|(?:y\s+)?mas|\+)\s+(\d+(?:\.\d+)?)/i);
    var followSub = norm.match(/(?:(?:y\s+)?(?:si\s+)?(?:le\s+)?rest(?:o|ale|ar)|(?:y\s+)?menos|\-)\s+(\d+(?:\.\d+)?)/i);

    if (followDiv || followMul || followAdd || followSub) {
      var prev = context.lastMathResult;
      var matchObj = followDiv || followMul || followAdd || followSub;
      var operand = parseFloat(matchObj[1]);

      if (prev === null || prev === undefined || isNaN(prev)) {
        // Sin contexto previo: solicitar el número inicial
        return "¿A qué número querés sumarle o restarle " + operand + "? Escribime la cuenta completa, por ejemplo: \"10 más " + operand + "\", y la resolvemos juntos. 🧮";
      }

      if (followDiv) {
        if (operand === 0) {
          return "¡Uy! No se puede dividir por cero en matemáticas. ¡Es una regla que no se puede romper! 🐨";
        }
        var res = +(prev / operand).toFixed(2);
        context.lastMathResult = res;
        context.lastTopic = "math";
        context.lastQuestion = "math_more";
        return prev + " dividido " + operand + " es " + res + ". ¡Genial! 🧮";
      } else if (followMul) {
        var res = +(prev * operand).toFixed(2);
        context.lastMathResult = res;
        context.lastTopic = "math";
        context.lastQuestion = "math_more";
        return prev + " por " + operand + " es " + res + ". ¡Buenísimo! 🧮";
      } else if (followAdd) {
        var res = +(prev + operand).toFixed(2);
        context.lastMathResult = res;
        context.lastTopic = "math";
        context.lastQuestion = "math_more";
        return "Si a " + prev + " le sumamos " + operand + ", obtenemos " + res + ". ¡Muy bien! 🧮";
      } else if (followSub) {
        var res = +(prev - operand).toFixed(2);
        context.lastMathResult = res;
        context.lastTopic = "math";
        context.lastQuestion = "math_more";
        return prev + " menos " + operand + " es " + res + ". ¡Bien pensado! 🧮";
      }
    }

    // 4. Mención de matemáticas sin números
    if (hasAnyPhrase(norm, ["hacer cuentas", "haceme una suma", "hacer matematica", "practicar matematica", "hacemos cuentas", "cuanto es"])) {
      context.lastTopic = "math";
      context.lastQuestion = "ask_operation";
      return "¡Me encantan las matemáticas! Escribime la cuenta que querés hacer, por ejemplo: \"8 más 5\" o \"3 por 4\". 🧮";
    }

    return null;
  }

  // ── EVALUADOR DE AYUDA Y PREOCUPACIONES ESCOLARES ─────────────────────────
  function checkSchoolConcern(norm, context) {
    var isProblem = hasAnyPhrase(norm, [
      "me fue mal", "mala nota", "baja nota", "desaprobe", "reprobe",
      "no entiendo", "me cuesta", "odio la escuela", "odio estudiar",
      "no me sale la tarea", "tarea dificil", "prueba dificil"
    ]) || /\b(?:me\s+fue\s+mal|desaprob|reprob|mala\s+nota)\b/i.test(norm);

    var isSchoolTopic = hasAnyPhrase(norm, [
      "matematica", "lengua", "escuela", "colegio", "prueba", "examen",
      "tarea", "seno", "profe", "boletin"
    ]) || /\b(?:matemat|lengua|escuela|colegio|prueba|examen|tarea|seno|profe)\b/i.test(norm);

    if (isProblem && (isSchoolTopic || /\b(?:me\s+fue\s+mal|desaprob|reprob)\b/i.test(norm))) {
      context.lastTopic = "school";
      context.lastSubTopic = (/\bmatemat/i.test(norm) || hasAnyPhrase(norm, ["matematica"])) ? "math_school" : "general_school";
      context.lastQuestion = "offer_school_help";
      return pickOne([
        "¡Ánimo! A todos nos pasa alguna vez que nos cueste un tema o nos vaya mal en una prueba. Lo importante es no desanimarse y pedirle una mano a tu seño o a tu familia. ¿Querés que charlemos o prefieres distraerte un ratito? 🤗",
        "¡Tranqui! Una mala nota o un día difícil en la escuela no cambia lo valioso y capaz que sos. Equivocarse es parte de aprender. Podés pedirle ayuda a un adulto en casa. ¿Te gustaría que repasemos juntos? 🐨✨"
      ]);
    }

    return null;
  }

  // ── EVALUADOR DE RESPUESTAS BREVES Y SEGUIMIENTO ──────────────────────────
  function checkFollowUps(norm, context) {
    // 1. Pedido de ayuda directo ("¿Me ayudás?", "ayudame", "me ayudas")
    if (/\b(?:me\s+ayud|ayudame|podes\s+ayudar|darme\s+una\s+mano|ayuda)\b/i.test(norm) || /ayud/i.test(norm)) {
      if (context.lastTopic === "school" || context.lastSubTopic === "math_school") {
        context.lastQuestion = "ask_exercise";
        return "¡Claro que sí! Contame qué ejercicio tenés que hacer o qué cuenta querés que resolvamos paso a paso. ✏️";
      }
      if (context.lastTopic === "math") {
        context.lastQuestion = "ask_operation";
        return "¡Por supuesto! Escribime la cuenta que necesitás resolver y la hacemos juntos. 🧮";
      }
      context.lastQuestion = "clarify_help";
      return "¡Claro que te ayudo! ¿Sobre qué tema te gustaría que charlemos o qué necesitás resolver? Contame con confianza. 🐨";
    }

    // 2. Afirmación ("Sí", "dale", "bueno")
    if (/\b(?:si+|dale|bueno|obvio|de una|claro)\b/i.test(norm)) {
      if (context.lastQuestion === "offer_school_help" || context.lastTopic === "school") {
        context.lastQuestion = "ask_exercise";
        return "¡Buenísimo! Decime qué consigna o ejercicio tenés que hacer y lo vemos con calma. ✏️";
      }
      if (context.lastQuestion === "math_more" || context.lastTopic === "math") {
        context.lastQuestion = "ask_operation";
        return "¡Genial! Pasame la cuenta que querés hacer. 🧮";
      }
      if (context.lastTopic === "games") {
        return "¡A divertirse! Podés tocar la sección Juegos abajo para elegir entre memotest, sumas o el piano. 🎮";
      }
      if (context.lastTopic === "stories") {
        return "¡Hermoso! En la sección Cuentos tenés historias con ilustraciones y narración por voz. 📖";
      }
      return "¡Me encanta tu energía! ¿De qué tenés ganas de charlar o a qué querés jugar? ✨";
    }

    // 3. Negación ("No", "nop")
    if (/^(?:no|nop|para nada|no quiero|ninguno|ninguna)$/i.test(norm)) {
      if (context.lastTopic === "school") {
        return "¡Está muy bien! A veces despejar la mente es lo mejor. Podemos escuchar música suave o simplemente descansar un ratito. 🌿";
      }
      return "¡Está perfecto! No hay problema. Cuando tengas ganas de hacer algo o charlar, acá estoy. ¿Querés quedarte un ratito tranquilo? 🐨";
    }

    // 4. Desconocimiento ("No sé", "ni idea")
    if (/^(?:no se|no me acuerdo|ni idea|no tengo idea)$/i.test(norm)) {
      return "¡Tranqui, no pasa nada! A veces es difícil elegir. Si querés, podemos escuchar música relajante o hacer una pausa. 🍃";
    }

    // 5. Repetición ("Otra vez", "otra")
    if (/^(?:otra vez|otra|otro|otro mas|otra mas|repetir)$/i.test(norm)) {
      if (context.lastTopic === "math") {
        context.lastQuestion = "ask_operation";
        return "¡Dale! Pasame la siguiente cuenta que quieras resolver. 🧮";
      }
      if (context.lastTopic === "games") {
        return "¡Buenísimo! En la sección Juegos podés volver a jugar otra partida cuando quieras. 🎮";
      }
      return "¿Otra vez de qué te gustaría? ¿Una cuenta, un juego o un cuento? 🐨";
    }

    // 6. Curiosidad ("¿Por qué?", "explicámelo")
    if (/^(?:por que|porque|explicamelo|explicame|como es|no entiendo|por que es asi)$/i.test(norm)) {
      if (context.lastTopic === "math") {
        return "En matemática cada operación sigue pasos claros. Si querés, podés pasarme la cuenta despacito y la miramos juntos. 🧮";
      }
      return "¡Me encanta que seas curioso y preguntes! El mundo está lleno de cosas interesantes para aprender. Si es sobre Kiddo o la escuela, ¡juntos lo descubrimos! 🌟";
    }

    return null;
  }

  // ── EVALUADOR DE EMOCIONES ───────────────────────────────────────────────
  function checkEmotions(norm, context) {
    if (hasAnyWord(norm, ["feliz", "contento", "alegre", "genial", "excelente", "gane", "aprobe"])) {
      context.lastTopic = "emotions";
      return pickOne([
        "¡Qué gran noticia! ¡Me alegra un montón que te sientas tan bien! 🎉 A seguir disfrutando el día.",
        "¡Me contagiaste tu sonrisa! Cuando estás contento, todo se llena de alegría. 💖"
      ]);
    }

    if (hasAnyWord(norm, ["triste", "mal", "llore", "lloro", "angustia", "pena"])) {
      context.lastTopic = "emotions";
      return pickOne([
        "Uy, te mando un abrazo de koala bien apretado. 🤗 A veces los días tienen momentos difíciles. ¿Querés charlar un ratito o preferís descansar?",
        "Lamento que te sientas así. Llorar o sentirse triste es normal. Podés hablar con mamá, papá o alguien de confianza que te dé un buen mimo. 💛"
      ]);
    }

    if (hasAnyWord(norm, ["enojado", "bronca", "enojo", "rabia", "pelee", "molesto"])) {
      context.lastTopic = "emotions";
      return pickOne([
        "Es normal sentir enojo a veces. Respirar hondo y contar hasta diez como los koalas ayuda a calmarse. 🍃 Si te peleaste con alguien, cuando pase la bronca seguro lo pueden hablar.",
        "A veces dan ganas de gritar cuando algo no sale como queremos. Tómate un ratito tranquilo para respirar. ¡Acá estoy haciéndote compañía! 🐨"
      ]);
    }

    if (hasAnyWord(norm, ["aburrido", "aburro", "aburrimiento"])) {
      context.lastTopic = "emotions";
      return pickOne([
        "¡El aburrimiento es genial para que aparezca la imaginación! En Kiddo podés crear música con el piano, jugar a las sumas o leer un cuento. ¿Cuál probamos? 🎨",
        "¿Probamos hacer algo nuevo? Podés inventar una canción en el piano o resolver una cuenta difícil conmigo. 🎹🧮"
      ]);
    }

    return null;
  }

  // ── EVALUADOR DE IDENTIDAD Y LÍMITES DE PUKY ──────────────────────────────
  function checkPukyIdentity(norm, context) {
    if (hasAnyPhrase(norm, ["quien sos", "que sos", "como te llamas", "sos real", "sos humano", "sos una persona", "sos un robot", "de donde sos", "donde vivis"])) {
      context.lastTopic = "puky";
      return "¡Soy Puky! Un koala digital y tu compañero en Kiddo. 🐨 No soy una persona real ni un médico, pero me encanta acompañarte, aprender y jugar juntos. Vivo acá en la app comiendo hojitas de eucalipto virtuales. 🍃";
    }

    if (hasAnyPhrase(norm, ["que comes", "te gusta", "que haces", "cual es tu comida", "cuantos anos tenes"])) {
      context.lastTopic = "puky";
      return "¡Me fascina comer hojitas de eucalipto, dormir siestas en las ramas y jugar con vos a resolver desafíos divertidos! 🍃🐨";
    }

    return null;
  }

  // ── EVALUADOR DE SECCIONES DE KIDDO ──────────────────────────────────────
  function checkKiddoSections(norm, context) {
    if (hasAnyWord(norm, ["jugar", "juego", "juegos", "memotest", "rompecabezas"])) {
      context.lastTopic = "games";
      return "¡A mí también me encanta jugar! En la sección Juegos podés entrenar tu memoria, hacer sumas divertidas o armar palabras. ¿Vamos a jugar? 🎮";
    }

    if (hasAnyWord(norm, ["cuento", "cuentos", "historia", "historias", "leer", "caperucita"])) {
      context.lastTopic = "stories";
      return "¡Los cuentos te llevan a mundos mágicos! Podés ir a la pestaña Cuentos para leer y escuchar historias narradas con dibujos hermosos. 📖✨";
    }

    if (hasAnyWord(norm, ["musica", "piano", "cancion", "canciones", "cantar", "melodia"])) {
      context.lastTopic = "music";
      return "¡La música alegra el corazón! En la sección Música podés tocar el piano o escuchar melodías relajantes. 🎹🎵";
    }

    if (hasAnyWord(norm, ["mision", "misiones", "estrellas", "estrella"])) {
      context.lastTopic = "missions";
      return "¡Cumplir las misiones diarias te ayuda a sumar estrellas y aprender jugando todos los días! ¿Ya completaste la de hoy? ⭐";
    }

    return null;
  }

  // ── EVALUADOR DE AFECTO Y AGRADECIMIENTO ──────────────────────────────────
  function checkAffectionAndThanks(norm, context) {
    if (hasAnyPhrase(norm, ["te quiero", "te amo", "te adoro", "sos lindo", "sos tierno", "sos mi amigo", "amigo puky"])) {
      context.lastTopic = "affection";
      return pickOne([
        "¡Qué dulce sos! Yo también te quiero mucho y me alegra ser tu compañero en Kiddo. 🐨💖 ¡Sos genial!",
        "¡Muchas gracias! Me hace muy feliz que seamos amigos virtuales. ¡Te mando un abrazo apretado! 🤗✨"
      ]);
    }

    if (hasAnyWord(norm, ["gracias", "agradezco"])) {
      context.lastTopic = "thanks";
      return pickOne([
        "¡De nada! Es un placer ayudarte. Para eso estamos los amigos. 😊✨",
        "¡Por nada del mundo! Cuando quieras charlar o jugar, acá estoy. 🐨"
      ]);
    }

    return null;
  }

  // ── EVALUADOR DE SALUDOS Y DESPEDIDAS ─────────────────────────────────────
  function checkGreetingsAndGoodbyes(norm, context) {
    if (hasAnyWord(norm, ["hola", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "hi", "que onda", "hello"])) {
      context.lastTopic = "greeting";
      return pickOne([
        "¡Hola! ¡Qué alegría verte por acá! 🐨 ¿Cómo estás hoy? ¿De qué te gustaría charlar?",
        "¡Hola, amiguito! 🐨✨ ¡Qué lindo tenerte en Kiddo! ¿Jugamos, hacemos una cuenta o charlamos un ratito?"
      ]);
    }

    if (hasAnyWord(norm, ["chau", "adios", "hasta luego", "bye", "me voy", "hasta manana"])) {
      context.lastTopic = "goodbye";
      return pickOne([
        "¡Hasta prontito! Que tengas un día hermoso o sueñes lindo si te vas a dormir. ¡Te espero pronto! 🐨💤",
        "¡Chau! Te mando un abrazo de koala gigante. ¡Cuidate mucho! 🤗✨"
      ]);
    }

    return null;
  }

  // ── RESPUESTA A CONSULTAS DESCONOCIDAS ────────────────────────────────────
  function getUnknownResponse(norm, context) {
    context.consecutiveUnknowns = (context.consecutiveUnknowns || 0) + 1;
    context.lastTopic = "unknown";

    var options = [
      "Mmm, todavía no conozco sobre eso o no lo llegué a entender del todo. 🐨 ¿Me lo podrías explicar con otras palabras más sencillas?",
      "¡Qué pregunta interesante! Como soy un koala chiquito de juguete virtual, todavía hay temas que no sé. ¿Querés que hagamos una cuenta, hablemos de juegos o leamos un cuento? ✨",
      "No estoy seguro de haber entendido bien. ¿Me lo decís de otra forma? Me encanta charlar con vos pero a veces me confundo. 😊"
    ];
    return pickOne(options);
  }

  // ── MOTOR DE INTENCIONES CON PRIORIDADES ESTRICTAS ─────────────────────────
  function getSmartResponse(rawText, history, context) {
    var norm = normalizeText(rawText);

    // Prioridad 1: Seguridad, datos personales y situaciones de peligro
    var safetyReply = checkSafety(rawText, norm);
    if (safetyReply) return safetyReply;

    // Prioridad 2: Apoyo escolar / Frustración escolar (antes que operaciones)
    var schoolReply = checkSchoolConcern(norm, context);
    if (schoolReply) return schoolReply;

    // Prioridad 3: Procesamiento matemático seguro (operaciones nuevas o seguimiento)
    var mathReply = processMath(rawText, context);
    if (mathReply) return mathReply;

    // Prioridad 4: Respuestas breves y seguimiento conversacional contextual
    var followReply = checkFollowUps(norm, context);
    if (followReply) return followReply;

    // Prioridad 5: Emociones
    var emotionReply = checkEmotions(norm, context);
    if (emotionReply) return emotionReply;

    // Prioridad 6: Identidad de Puky y limitaciones
    var pukyReply = checkPukyIdentity(norm, context);
    if (pukyReply) return pukyReply;

    // Prioridad 7: Secciones de Kiddo (Juegos, Cuentos, Música, Misiones)
    var sectionsReply = checkKiddoSections(norm, context);
    if (sectionsReply) return sectionsReply;

    // Prioridad 8: Afecto y agradecimiento
    var affectionReply = checkAffectionAndThanks(norm, context);
    if (affectionReply) return affectionReply;

    // Prioridad 9: Saludos y despedidas
    var greetingReply = checkGreetingsAndGoodbyes(norm, context);
    if (greetingReply) return greetingReply;

    // Prioridad 10: Desconocido / Fuera de alcance con reconocimiento sincero
    return getUnknownResponse(norm, context);
  }

  // ── MANAGER ─────────────────────────────────────────────────────────────
  function ChatManager() {
    this.history  = [];             // { role: "user"|"puky", text: "" }
    this.context  = new ChatContext();
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

    if (input) input.value = "";
    this._appendUser(text);
    this.history.push({ role: "user", text: text });
    if (this.history.length > CONFIG.maxHistory) this.history.shift();

    this._setTyping(true);
    this.busy = true;
    var self = this;

    setTimeout(function () {
      var reply = getSmartResponse(text, self.history, self.context);
      self._onReply(reply);
    }, CONFIG.typingDelay);
  };

  ChatManager.prototype._onReply = function(reply) {
    this._setTyping(false);
    this.busy = false;
    this._appendPuky(reply);
    this.history.push({ role: "puky", text: reply });
    if (this.history.length > CONFIG.maxHistory) this.history.shift();
    if (window.puky2D) window.puky2D.showHappy(1500);
    if (window.kiddoAudio) window.kiddoAudio.playBubbleSound();
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
  // Para pruebas y diagnóstico interno seguro
  window.pukyChatEngine = {
    getSmartResponse: getSmartResponse,
    processMath: processMath,
    checkSafety: checkSafety,
    checkSchoolConcern: checkSchoolConcern,
    checkFollowUps: checkFollowUps,
    ChatContext: ChatContext
  };
})();
