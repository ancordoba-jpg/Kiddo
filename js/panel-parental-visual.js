(function () {
  "use strict";

  function normalizar(texto) {
    return (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function encontrarTitulo(texto) {
    return Array.from(
      document.querySelectorAll("h1,h2,h3,h4")
    ).find(el => normalizar(el.textContent) === texto);
  }

  function encontrarTarjeta(el) {
    if (!el) return null;

    const selector = [
      ".parent-panel-card",
      ".parent-card",
      ".parent-dashboard-card",
      ".parent-control-card"
    ].join(",");

    const conocida = el.closest(selector);
    if (conocida) return conocida;

    let actual = el.parentElement;

    for (let i = 0; actual && i < 5; i++) {
      const nombre = String(actual.className || "");

      if (/parent.*card|panel.*card/i.test(nombre)) {
        return actual;
      }
      actual = actual.parentElement;
    }

    return null;
  }

  function encontrarCabecera(titulo) {
    if (!titulo) return null;

    const conocida = titulo.closest(
      ".parent-dash-header, " +
      ".parent-dashboard-header, " +
      ".parent-dash-hero, " +
      ".parent-dash-banner"
    );

    if (conocida) return conocida;

    let actual = titulo.parentElement;

    for (let i = 0; actual && i < 6; i++) {
      const botones = actual.querySelectorAll("button");

      const cerrar = Array.from(botones).some(b =>
        normalizar(b.textContent).includes("cerrar panel")
      );

      const otrosTitulos = Array.from(
        actual.querySelectorAll("h2,h3")
      ).some(h =>
        normalizar(h.textContent) === "tiempo de pantalla"
      );

      if (cerrar && !otrosTitulos) {
        return actual;
      }

      actual = actual.parentElement;
    }

    return null;
  }

  function aplicarDiseno() {
    const titulo = encontrarTitulo("supervision y control");
    const cabecera = encontrarCabecera(titulo);

    if (cabecera) {
      cabecera.classList.add("kiddo-parent-hero-new");
    }

    const tiempo = encontrarTarjeta(
      encontrarTitulo("tiempo de pantalla")
    );

    if (tiempo) {
      tiempo.classList.add("kiddo-parent-card-time");
    }

    const horario = encontrarTarjeta(
      encontrarTitulo("horario de uso permitido")
    );

    if (horario) {
      horario.classList.add("kiddo-parent-card-schedule");
    }
  }

  function iniciar() {
    aplicarDiseno();

    const observador = new MutationObserver(aplicarDiseno);

    observador.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, {
      once: true
    });
  } else {
    iniciar();
  }
})();