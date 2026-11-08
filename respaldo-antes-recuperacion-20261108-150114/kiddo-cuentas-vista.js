(function () {
    "use strict";

    // Vista de prueba. No reemplaza la autenticacion actual.
    const params = new URLSearchParams(window.location.search);

    if (false) {
        return;
    }

    function iniciarVista() {
        const card = document.querySelector(
            "#screen-login .login-form-card"
        );

        if (!card) {
            console.error("[Kiddo] No se encontro el formulario.");
            return;
        }

        card.classList.add("kiddo-cuentas-card");

        card.innerHTML = `
          <div class="kiddo-cuentas-tabs" role="tablist"
               aria-label="Acceso a Kiddo">
            <button type="button" id="kiddo-tab-login"
                    class="kiddo-cuentas-tab active"
                    aria-selected="true">
              Iniciar sesión
            </button>
            <button type="button" id="kiddo-tab-register"
                    class="kiddo-cuentas-tab"
                    aria-selected="false">
              Registrarse
            </button>
          </div>

          <form id="kiddo-new-login" class="kiddo-cuentas-form">
            <label for="kiddo-login-username">
              Nombre de usuario
            </label>
            <input id="kiddo-login-username"
                   type="text"
                   autocomplete="username"
                   minlength="6"
                   maxlength="32"
                   required
                   placeholder="Tu nombre de usuario">

            <label for="kiddo-login-password">
              Contraseña
            </label>
            <input id="kiddo-login-password"
                   type="password"
                   autocomplete="current-password"
                   required
                   placeholder="Tu contraseña">

            <button type="submit" class="kiddo-cuentas-primary">
              Ingresar a Kiddo
            </button>

            <p class="kiddo-cuentas-help">
              ¿Olvidaste tu contraseña?
              La recuperación se realizará mediante
              el correo del adulto responsable.
            </p>
          </form>

          <form id="kiddo-new-register"
                class="kiddo-cuentas-form"
                hidden>

            <label for="kiddo-reg-username">
              Nombre de usuario
            </label>
            <input id="kiddo-reg-username"
                   type="text"
                   autocomplete="username"
                   minlength="6"
                   maxlength="32"
                   required
                   placeholder="Mínimo 6 caracteres">
            <small>Debe ser único para cada cuenta.</small>

            <label for="kiddo-reg-child">
              Nombre del niño o niña
            </label>
            <input id="kiddo-reg-child"
                   type="text"
                   maxlength="80"
                   required
                   placeholder="Nombre">

            <label for="kiddo-reg-birthdate">
              Fecha de nacimiento
            </label>
            <input id="kiddo-reg-birthdate"
                   type="date"
                   required>

            <label for="kiddo-reg-gender">
              Género
            </label>
            <select id="kiddo-reg-gender" required>
              <option value="">Seleccionar</option>
              <option value="nino">Niño</option>
              <option value="nina">Niña</option>
            </select>

            <label for="kiddo-reg-password">
              Contraseña
            </label>
            <input id="kiddo-reg-password"
                   type="password"
                   autocomplete="new-password"
                   minlength="12"
                   required
                   placeholder="Mínimo 12 caracteres">

            <label for="kiddo-reg-email">
              Correo del adulto responsable
            </label>
            <input id="kiddo-reg-email"
                   type="email"
                   autocomplete="email"
                   required
                   placeholder="correo@ejemplo.com">

            <button type="submit" class="kiddo-cuentas-primary">
              Crear cuenta
            </button>
          </form>

          <p id="kiddo-cuentas-status"
             class="kiddo-cuentas-status"
             role="status"
             aria-live="polite">
            Vista de prueba: todavía no se envían datos.
          </p>
        `;

        const login = document.getElementById("kiddo-new-login");
        const register = document.getElementById("kiddo-new-register");
        const tabLogin = document.getElementById("kiddo-tab-login");
        const tabRegister = document.getElementById("kiddo-tab-register");
        const status = document.getElementById("kiddo-cuentas-status");

        function cambiarVista(esRegistro) {
            login.hidden = esRegistro;
            register.hidden = !esRegistro;

            tabLogin.classList.toggle("active", !esRegistro);
            tabRegister.classList.toggle("active", esRegistro);

            tabLogin.setAttribute("aria-selected", String(!esRegistro));
            tabRegister.setAttribute("aria-selected", String(esRegistro));

            status.textContent =
                "Vista de prueba: todavía no se envían datos.";
        }

        tabLogin.addEventListener("click", () => cambiarVista(false));
        tabRegister.addEventListener("click", () => cambiarVista(true));

        [login, register].forEach(form => {
            form.addEventListener("submit", event => {
                event.preventDefault();
                event.stopPropagation();

                status.textContent =
                    "Formulario preparado. La autenticación real " +
                    "se activará en la siguiente etapa.";
            });
        });

        console.info("[Kiddo] Vista de cuentas preparada.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarVista);
    } else {
        iniciarVista();
    }
})();