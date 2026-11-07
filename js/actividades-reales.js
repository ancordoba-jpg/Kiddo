/* KIDDO - ACTIVIDADES RECIENTES REALES */

(function () {
  'use strict';

  const MAX_HISTORIAL = 100;
  let claveActual = null;
  let actividades = [];
  let mostrarTodas = false;

  const juegos = {
    memory: 'Memoria',
    memoria: 'Memoria',
    sumas: 'Aprender sumas',
    restas: 'Aprender restas',
    multiplicacion: 'Multiplicación',
    multiplicar: 'Multiplicación',
    division: 'División',
    dividir: 'División',
    hora: 'Aprender la hora',
    silabas: 'Completar sílabas',
    palabras: 'Armar palabras'
  };

  function fechaLocal(timestamp) {
    const d = new Date(timestamp);
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function nombreUsuario() {
    try {
      if (typeof KIDDO_DATA !== 'undefined') {
        return String(KIDDO_DATA.user?.name || 'usuario')
          .trim().toLowerCase();
      }
    } catch (e) {}
    return 'usuario';
  }

  function obtenerClave() {
    return 'kiddo_actividades_v1_' +
      encodeURIComponent(nombreUsuario()) +
      '_' + fechaLocal(Date.now());
  }

  function sincronizarDia() {
    const nuevaClave = obtenerClave();
    if (nuevaClave === claveActual) return;

    claveActual = nuevaClave;
    mostrarTodas = false;

    try {
      const guardado = JSON.parse(
        localStorage.getItem(claveActual) || '[]'
      );

      actividades = Array.isArray(guardado)
        ? guardado.filter(a =>
            a &&
            Number.isFinite(a.timestamp) &&
            fechaLocal(a.timestamp) === fechaLocal(Date.now())
          )
        : [];
    } catch (e) {
      actividades = [];
    }

    actividades.sort((a, b) => b.timestamp - a.timestamp);
  }

  function tiempoRelativo(timestamp) {
    const segundos = Math.max(
      0,
      Math.floor((Date.now() - timestamp) / 1000)
    );

    if (segundos < 60) return 'Ahora mismo';

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
      return 'Hace ' + minutos + ' min';
    }

    const horas = Math.floor(minutos / 60);
    if (horas < 24) {
      return 'Hace ' + horas + ' h';
    }

    return 'Hoy';
  }

  function registrar(datos) {
    if (!datos || !datos.title) return;

    sincronizarDia();

    const actividad = {
      id: 'act-' + Date.now() + '-' +
        Math.random().toString(36).slice(2, 7),
      type: String(datos.type || 'activity'),
      icon: String(datos.icon || '⭐'),
      title: String(datos.title),
      subtitle: String(datos.subtitle || 'Actividad realizada'),
      color: String(datos.color || '#BEE3F8'),
      timestamp: Date.now()
    };

    actividades.unshift(actividad);
    actividades = actividades.slice(0, MAX_HISTORIAL);

    try {
      localStorage.setItem(
        claveActual,
        JSON.stringify(actividades)
      );
    } catch (e) {
      console.warn('Kiddo: no se pudo guardar el historial.', e);
    }

    renderizar();
  }

  function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  function renderizar() {
    sincronizarDia();

    const seccion = document.querySelector(
      '#screen-inicio .recent-activities-section'
    );
    if (!seccion) return;

    const lista = seccion.querySelector('.recent-activities-list');
    if (!lista) return;

    // Sin actividad real hoy: no mostrar nada.
    // Mantener visible el titulo de Actividades recientes.
    seccion.style.display = '';

    lista.replaceChildren();

    if (!actividades.length) {
      const vacio = crearElemento(
        'div',
        'kiddo-actividades-vacias'
      );

      const icono = crearElemento('div', 'kiddo-vacio-icono', '🌟');
      const titulo = crearElemento(
        'h4',
        'kiddo-vacio-titulo',
        'Sin actividades recientes'
      );
      const mensaje = crearElemento(
        'p',
        'kiddo-vacio-mensaje',
        '¡Todavía no realizaste actividades hoy! Cuando completes una, aparecerá aquí.'
      );

      vacio.append(icono, titulo, mensaje);
      lista.appendChild(vacio);

      const boton = seccion.querySelector('.view-all-activities-btn');
      if (boton) boton.style.display = 'none';

      return;
    }

    const visibles = mostrarTodas
      ? actividades
      : actividades.slice(0, 5);

    visibles.forEach(actividad => {
      const tipo = actividad.type;

      const color = tipo === 'story'
        ? 'pink'
        : tipo === 'mission'
          ? 'green'
          : 'blue';

      const tarjeta = crearElemento(
        'div',
        'activity-pill-card card-' + color
      );

      const icono = crearElemento(
        'div',
        'activity-badge-icon badge-' + color,
        actividad.icon
      );
      icono.setAttribute('aria-hidden', 'true');

      const detalles = crearElemento('div', 'activity-details');
      detalles.appendChild(
        crearElemento('h4', 'activity-name', actividad.title)
      );
      detalles.appendChild(
        crearElemento('p', 'activity-status', actividad.subtitle)
      );

      const meta = crearElemento('div', 'activity-meta');
      const tiempo = crearElemento(
        'span',
        'activity-timestamp',
        tiempoRelativo(actividad.timestamp)
      );
      tiempo.dataset.timestamp = actividad.timestamp;
      meta.appendChild(tiempo);

      tarjeta.append(icono, detalles, meta);
      lista.appendChild(tarjeta);
    });

    const boton = seccion.querySelector('.view-all-activities-btn');

    if (boton) {
      boton.style.display = actividades.length > 5 ? '' : 'none';
      const texto = boton.querySelector('span');
      if (texto) {
        texto.textContent = mostrarTodas ? 'Ver menos' : 'Ver todas';
      }
    }
  }

  function conectarAplicacion() {
    const app = window.kiddoApp;

    if (!app || typeof app.addRecentActivity !== 'function') {
      return;
    }

    if (app.addRecentActivity.__kiddoHistorialReal) return;

    const original = app.addRecentActivity;

    const nuevaFuncion = function (datos) {
      if (!datos) return;

      const nuevo = { ...datos };

      // Abrir un video no demuestra que se haya visto completo.
      if (nuevo.type === 'video') {
        nuevo.subtitle = 'Video abierto';
      }

      // Iniciar un cuento no equivale a terminarlo.
      if (nuevo.type === 'story' &&
          /iniciada/i.test(nuevo.subtitle || '')) {
        nuevo.subtitle = 'Comenzó a leer el cuento';
      }

      registrar(nuevo);

      // Conservar la compatibilidad con el sistema existente.
      try {
        if (typeof KIDDO_DATA !== 'undefined') {
          KIDDO_DATA.recentActivities =
            actividades.slice(0, 5).map(a => ({
              ...a,
              time: tiempoRelativo(a.timestamp)
            }));
        }
      } catch (e) {}
    };

    nuevaFuncion.__kiddoHistorialReal = true;
    nuevaFuncion.__original = original;
    app.addRecentActivity = nuevaFuncion;
  }

  function conectarJuegos() {
    const eventos = window.KiddoMissionEvents;

    if (!eventos || typeof eventos.emit !== 'function') return;
    if (eventos.emit.__kiddoHistorialReal) return;

    const original = eventos.emit;

    const nuevaFuncion = function (nombre, datos) {
      const resultado = original.apply(this, arguments);

      if (nombre === 'game_completed') {
        const d = datos || {};
        const id = String(d.gameId || '');

        registrar({
          type: 'game',
          icon: '🎮',
          title: juegos[id] || ('Juego: ' + (id || 'completado')),
          subtitle: id === 'memory'
            ? 'Completó una partida de memoria'
            : 'Juego completado',
          color: '#BEE3F8'
        });
      }

      if (nombre === 'story_completed') {
        registrar({
          type: 'story',
          icon: '📖',
          title: 'Cuento terminado',
          subtitle: 'Terminó de leer un cuento',
          color: '#FFD1DC'
        });
      }

      return resultado;
    };

    nuevaFuncion.__kiddoHistorialReal = true;
    eventos.emit = nuevaFuncion;
  }

  function iniciar() {
    sincronizarDia();

    // Ocultar inmediatamente las tarjetas ficticias del HTML.
    renderizar();

    // Reutilizar el botón Ver todas sin ejecutar la acción antigua.
    const boton = document.querySelector(
      '#screen-inicio .view-all-activities-btn'
    );

    if (boton) {
      boton.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        mostrarTodas = !mostrarTodas;
        renderizar();
      }, true);
    }

    conectarAplicacion();
    conectarJuegos();

    // Actualizar automáticamente los tiempos relativos.
    setInterval(function () {
      conectarAplicacion();
      conectarJuegos();
      renderizar();
    }, 15000);

    renderizar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();