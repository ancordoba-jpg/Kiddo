(function () {
  function iniciarMenuKiddo() {
    const app = document.getElementById('main-app-container');
    const header = app?.querySelector('.app-top-header');

    if (!app || !header || document.getElementById('kiddo-menu-toggle')) {
      return;
    }

    const boton = document.createElement('button');
    boton.id = 'kiddo-menu-toggle';
    boton.className = 'kiddo-menu-toggle';
    boton.type = 'button';
    boton.setAttribute('aria-label', 'Abrir menu');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'main-kiddo-nav');

    const navegacion = app.querySelector('.main-bottom-navigation');
    if (navegacion) {
      navegacion.id = 'main-kiddo-nav';
    }

    boton.innerHTML = '<span></span><span></span><span></span>';

    header.insertBefore(boton, header.firstChild);

    function actualizarMenu(abierto) {
      app.classList.toggle('kiddo-nav-open', abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute(
        'aria-label',
        abierto ? 'Cerrar menu' : 'Abrir menu'
      );
    }

    boton.addEventListener('click', function () {
      actualizarMenu(!app.classList.contains('kiddo-nav-open'));
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' &&
          app.classList.contains('kiddo-nav-open')) {
        actualizarMenu(false);
        boton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024) {
        actualizarMenu(false);
      }
    });

    actualizarMenu(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMenuKiddo);
  } else {
    iniciarMenuKiddo();
  }
})();