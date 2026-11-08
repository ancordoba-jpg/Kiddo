(function () {
    "use strict";

    // CUENTAS LOCALES DE DEMOSTRACION
    // No utilizar con datos personales reales.
    // No sustituye autenticacion de servidor.

    const ACCOUNTS_KEY = "kiddo_demo_accounts_v1";
    const SESSION_KEY = "kiddo_demo_current_user_v1";

    function accounts() {
        try {
            const data = JSON.parse(
                localStorage.getItem(ACCOUNTS_KEY) || "{}"
            );
            return data && typeof data === "object" ? data : {};
        } catch (_) {
            return {};
        }
    }

    function message(text, error = false) {
        const el = document.getElementById("kiddo-cuentas-status");
        if (el) {
            el.textContent = text;
            el.style.color = error ? "#b45353" : "#28725d";
        }
    }

    function randomHex(bytes = 16) {
        const data = crypto.getRandomValues(new Uint8Array(bytes));
        return Array.from(data, b =>
            b.toString(16).padStart(2, "0")
        ).join("");
    }

    async function derive(password, salt) {
        const encoder = new TextEncoder();

        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveBits"]
        );

        const saltBytes = new Uint8Array(
            salt.match(/.{2}/g).map(h => parseInt(h, 16))
        );

        const bits = await crypto.subtle.deriveBits({
            name: "PBKDF2",
            salt: saltBytes,
            iterations: 200000,
            hash: "SHA-256"
        }, key, 256);

        return Array.from(new Uint8Array(bits), b =>
            b.toString(16).padStart(2, "0")
        ).join("");
    }

    function enter(username) {
        const account = accounts()[username];
        const app = window.kiddoApp;

        if (!account || !app) return false;

        localStorage.setItem(SESSION_KEY, username);

        if (window.KIDDO_DATA && KIDDO_DATA.user) {
            KIDDO_DATA.user.name = account.childName;
            KIDDO_DATA.user.registered = true;
        }

        app.isAuthenticated = true;

        const login = document.getElementById("screen-login");
        const main = document.getElementById("main-app-container");

        if (login) {
            login.classList.remove("active");
            login.classList.add("hidden");
            login.style.display = "none";
        }

        if (main) {
            main.classList.remove("hidden");
            main.style.display = "flex";
        }

        if (window.kiddoMissions &&
            typeof window.kiddoMissions.loadOrInitializeState === "function") {
            window.kiddoMissions.loadOrInitializeState();
        }

        app.navigateTo("inicio");
        return true;
    }

    function init() {
        const loginForm = document.getElementById("kiddo-new-login");
        const registerForm = document.getElementById("kiddo-new-register");

        if (!loginForm || !registerForm || !window.kiddoApp) {
            console.error("[Kiddo] No se encontraron los formularios.");
            return;
        }

        // Evitar que un ingreso anterior saltee esta vista.
        sessionStorage.removeItem("kiddo_session_active");

        // El boton cerrar sesion debe borrar la sesion local.
        const originalLogout = window.kiddoApp.logout.bind(window.kiddoApp);

        window.kiddoApp.logout = function () {
            localStorage.removeItem(SESSION_KEY);
            originalLogout();
            message("Sesión cerrada. Podés volver a ingresar.");
        };

        // Restaurar cuenta al abrir nuevamente la aplicación.
        const saved = localStorage.getItem(SESSION_KEY);

        if (saved && enter(saved)) {
            console.info("[Kiddo] Sesión local restaurada.");
        } else {
            localStorage.removeItem(SESSION_KEY);
            window.kiddoApp.showLoginScreen();
        }

        // Interceptar ambos formularios antes del manejador visual.
        document.addEventListener("submit", async event => {
            const form = event.target;

            if (form !== registerForm && form !== loginForm) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            if (!form.reportValidity()) return;

            const button = form.querySelector('button[type="submit"]');
            if (button.disabled) return;

            button.disabled = true;

            try {
                if (form === registerForm) {
                    const username = document.getElementById(
                        "kiddo-reg-username"
                    ).value.trim().toLowerCase();

                    const childName = document.getElementById(
                        "kiddo-reg-child"
                    ).value.trim();

                    const birthdate = document.getElementById(
                        "kiddo-reg-birthdate"
                    ).value;

                    const gender = document.getElementById(
                        "kiddo-reg-gender"
                    ).value;

                    const password = document.getElementById(
                        "kiddo-reg-password"
                    ).value;

                    const email = document.getElementById(
                        "kiddo-reg-email"
                    ).value.trim().toLowerCase();

                    if (!/^[a-z0-9._!@#$%&*+=?-]{6,32}$/.test(username)) {
                        message("El usuario debe tener entre 6 y 32 caracteres válidos.", true);
                        return;
                    }

                    const date = new Date(birthdate + "T12:00:00");

                    if (!childName ||
                        !birthdate ||
                        Number.isNaN(date.getTime()) ||
                        date > new Date() ||
                        !["nino", "nina"].includes(gender)) {
                        message("Revisá los datos del registro.", true);
                        return;
                    }

                    if (password.length < 12) {
                        message("Usá al menos 12 caracteres en la contraseña.", true);
                        return;
                    }

                    const all = accounts();

                    if (all[username]) {
                        message("Ese usuario ya existe en este navegador.", true);
                        return;
                    }

                    if (Object.values(all).some(
                        a => a.email === email
                    )) {
                        message("Ese correo ya está utilizado en este navegador.", true);
                        return;
                    }

                    const salt = randomHex();
                    const hash = await derive(password, salt);

                    // Solo datos de demostracion.
                    // No guardamos fecha de nacimiento ni genero.
                    all[username] = {
                        username,
                        childName,
                        email,
                        salt,
                        hash
                    };

                    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(all));

                    form.reset();
                    enter(username);
                } else {
                    const username = document.getElementById(
                        "kiddo-login-username"
                    ).value.trim().toLowerCase();

                    const password = document.getElementById(
                        "kiddo-login-password"
                    ).value;

                    const account = accounts()[username];

                    if (!account) {
                        message("Usuario o contraseña incorrectos.", true);
                        return;
                    }

                    const hash = await derive(password, account.salt);

                    if (hash !== account.hash) {
                        message("Usuario o contraseña incorrectos.", true);
                        return;
                    }

                    enter(username);
                }
            } catch (error) {
                console.error("[Kiddo] Error en cuentas locales:", error);
                message("No se pudo completar la operación.", true);
            } finally {
                button.disabled = false;
            }
        }, true);

        console.info("[Kiddo] Cuentas locales de demostración activadas.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();