/* KIDDO - PANEL LATERAL DE PUKY PARA ESCRITORIO */

(function () {
  'use strict';

  function iniciar() {
    const media = window.matchMedia('(min-width: 1024px)');

    const screen = document.getElementById('screen-puky');
    const scene = document.getElementById('puky-scene-wrapper');
    const wardrobe = document.getElementById('puky-wardrobe-inline');
    const chat = document.getElementById('puky-chat-modal');

    const btnWardrobe = document.getElementById('puky-btn-vestimenta');
    const actionBar = document.getElementById('puky-action-bar');
    const btnChat = actionBar &&
      actionBar.querySelector('.btn-chat');

    if (!screen || !scene || !wardrobe ||
        !chat || !btnWardrobe || !btnChat) {
      console.warn('Kiddo: faltan elementos del panel de Puky.');
      return;
    }

    // Marca la posicion original del modal para restaurarlo
    // cuando se utiliza celular o tablet.
    const marcador = document.createComment(
      'Posicion original del chat de Puky'
    );

    chat.parentNode.insertBefore(marcador, chat);

    let eraDesktop = false;

    function actualizarBotones() {
      const ropaAbierta = wardrobe.classList.contains('visible');
      const chatAbierto = chat.classList.contains('active');

      btnWardrobe.classList.toggle(
        'kiddo-tab-selected',
        ropaAbierta && !chatAbierto
      );

      btnChat.classList.toggle(
        'kiddo-tab-selected',
        chatAbierto
      );

      btnWardrobe.setAttribute(
        'aria-pressed',
        String(ropaAbierta && !chatAbierto)
      );

      btnChat.setAttribute(
        'aria-pressed',
        String(chatAbierto)
      );
    }

    function cerrarVestimenta() {
      if (window.kiddoApp &&
          typeof window.kiddoApp.closePukyWardrobe === 'function') {
        window.kiddoApp.closePukyWardrobe();
      } else {
        wardrobe.classList.remove('visible');
        wardrobe.setAttribute('aria-hidden', 'true');
        scene.classList.remove('wardrobe-active');
      }
    }

    function abrirVestimenta() {
      if (!media.matches) return;

      if (window.pukyChat &&
          typeof window.pukyChat.close === 'function') {
        window.pukyChat.close();
      } else {
        chat.classList.remove('active');
      }

      if (!wardrobe.classList.contains('visible')) {
        if (window.kiddoApp &&
            typeof window.kiddoApp.togglePukyWardrobe === 'function') {
          window.kiddoApp.togglePukyWardrobe();
        } else {
          wardrobe.classList.add('visible');
          wardrobe.setAttribute('aria-hidden', 'false');
          scene.classList.add('wardrobe-active');

          if (window.pukyWardrobe &&
              typeof window.pukyWardrobe.renderWardrobe === 'function') {
            window.pukyWardrobe.renderWardrobe();
          }
        }
      }

      actualizarBotones();
    }

    function abrirChat() {
      if (!media.matches) return;

      cerrarVestimenta();

      if (window.pukyChat &&
          typeof window.pukyChat.open === 'function') {
        window.pukyChat.open();
      } else if (window.kiddoApp &&
          typeof window.kiddoApp.openPukyChat === 'function') {
        window.kiddoApp.openPukyChat();
      }

      actualizarBotones();
    }

    // Interceptar solo los botones de escritorio.
    // En movil se mantienen los eventos originales.
    actionBar.addEventListener('click', function (e) {
      if (!media.matches) return;

      const boton = e.target.closest('button');
      if (!boton) return;

      if (boton === btnWardrobe) {
        e.preventDefault();
        e.stopImmediatePropagation();
        abrirVestimenta();
      } else if (boton === btnChat) {
        e.preventDefault();
        e.stopImmediatePropagation();
        abrirChat();
      }
    }, true);

    function adaptarPantalla() {
      if (media.matches) {
        if (chat.parentNode !== scene) {
          scene.appendChild(chat);
        }

        if (!eraDesktop && screen.classList.contains('active')) {
          abrirVestimenta();
        }

        eraDesktop = true;
      } else {
        if (eraDesktop) {
          if (window.pukyChat &&
              typeof window.pukyChat.close === 'function') {
            window.pukyChat.close();
          } else {
            chat.classList.remove('active');
          }

          cerrarVestimenta();
        }

        if (marcador.parentNode &&
            chat.parentNode !== marcador.parentNode) {
          marcador.parentNode.insertBefore(
            chat,
            marcador.nextSibling
          );
        }

        eraDesktop = false;
      }

      actualizarBotones();
    }

    // Al entrar a Puky mostrar el vestidor directamente.
    let pantallaAnteriorActiva =
      screen.classList.contains('active');

    const observadorPantalla = new MutationObserver(function () {
      const activa = screen.classList.contains('active');

      if (media.matches && activa && !pantallaAnteriorActiva) {
        abrirVestimenta();
      }

      pantallaAnteriorActiva = activa;
    });

    observadorPantalla.observe(screen, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Mantener los botones sincronizados con los cierres
    // realizados desde los paneles originales.
    const observadorPaneles = new MutationObserver(
      actualizarBotones
    );

    observadorPaneles.observe(wardrobe, {
      attributes: true,
      attributeFilter: ['class']
    });

    observadorPaneles.observe(chat, {
      attributes: true,
      attributeFilter: ['class']
    });

    window.addEventListener('resize', adaptarPantalla);

    adaptarPantalla();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();