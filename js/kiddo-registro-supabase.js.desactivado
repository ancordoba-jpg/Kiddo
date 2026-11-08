(function () {
    "use strict";

    // Registro real habilitado solo en la vista de prueba.
    // La autenticacion general de Kiddo aun no se reemplaza.

    if (
        new URLSearchParams(location.search).get("preview") !== "cuentas"
    ) {
        return;
    }

    function iniciar() {
        const form = document.getElementById("kiddo-new-register");
        const status = document.getElementById("kiddo-cuentas-status");
        const supabase = window.kiddoSupabase;

        if (!form || !status || !supabase) {
            console.error("[Kiddo] Faltan componentes del registro.");
            return;
        }

        // Consentimiento del adulto responsable.
        const consentimiento = document.createElement("label");
        consentimiento.className = "kiddo-consentimiento";
        consentimiento.style.cssText =
            "display:flex;align-items:flex-start;gap:10px;" +
            "font-size:12px;line-height:1.5;";

        const check = document.createElement("input");
        check.type = "checkbox";
        check.required = true;
        check.style.cssText =
            "width:18px;height:18px;min-height:18px;" +
            "margin:2px 0;flex-shrink:0;";

        const texto = document.createElement("span");
        texto.textContent =
            "Confirmo que soy el adulto responsable y autorizo " +
            "la creación de esta cuenta de prueba.";

        consentimiento.append(check, texto);

        const boton = form.querySelector('button[type="submit"]');
        form.insertBefore(consentimiento, boton);

        const usuario = document.getElementById("kiddo-reg-username");
        const nombre = document.getElementById("kiddo-reg-child");
        const fecha = document.getElementById("kiddo-reg-birthdate");
        const genero = document.getElementById("kiddo-reg-gender");
        const password = document.getElementById("kiddo-reg-password");
        const email = document.getElementById("kiddo-reg-email");

        usuario.setAttribute("pattern", "[A-Za-z0-9._!@#$%&*+=?-]{6,32}");
        usuario.setAttribute("maxlength", "32");

        function mensaje(texto, error) {
            status.textContent = texto;
            status.style.color = error ? "#b45353" : "#28725d";
        }

        // Capturamos el submit antes del manejador visual anterior.
        document.addEventListener("submit", async function (event) {
            if (event.target !== form) return;

            event.preventDefault();
            event.stopImmediatePropagation();

            if (!form.reportValidity()) return;

            const username = usuario.value.trim();
            const childName = nombre.value.trim();
            const birthdate = fecha.value;
            const gender = genero.value;
            const clave = password.value;
            const correo = email.value.trim().toLowerCase();

            if (!/^[A-Za-z0-9._!@#$%&*+=?-]{6,32}$/.test(username)) {
                mensaje("Nombre de usuario inválido.", true);
                return;
            }

            if (!childName || childName.length > 80) {
                mensaje("Revisá el nombre del niño o niña.", true);
                return;
            }

            const hoy = new Date();
            const fechaElegida = new Date(birthdate + "T12:00:00");

            if (
                !birthdate ||
                isNaN(fechaElegida.getTime()) ||
                fechaElegida > hoy ||
                !["nino", "nina"].includes(gender)
            ) {
                mensaje("Revisá la fecha de nacimiento y el género.", true);
                return;
            }

            if (clave.length < 12) {
                mensaje("La contraseña debe tener al menos 12 caracteres.", true);
                return;
            }

            if (!check.checked) {
                mensaje("Se requiere autorización del adulto.", true);
                return;
            }

            boton.disabled = true;
            boton.textContent = "Creando cuenta...";
            mensaje("Conectando con Supabase...", false);

            try {
                const result = await supabase.auth.signUp({
                    email: correo,
                    password: clave,
                    options: {
                        emailRedirectTo:
                            location.origin + location.pathname +
                            "?preview=cuentas",
                        data: {
                            username: username,
                            child_name: childName,
                            birthdate: birthdate,
                            gender: gender
                        }
                    }
                });

                if (result.error) {
                    // No exponer datos privados de otras cuentas.
                    console.warn(
                        "[Kiddo] Error de registro:",
                        result.error.code || result.error.message
                    );

                    if (
                        result.error.code === "over_email_send_rate_limit" ||
                        result.error.status === 429
                    ) {
                        mensaje(
                            "Se alcanzó el límite de correos. " +
                            "Intentá más tarde.",
                            true
                        );
                    } else {
                        mensaje(
                            "No se pudo completar el registro. " +
                            "Verificá los datos y contactá al administrador.",
                            true
                        );
                    }
                    return;
                }

                mensaje(
                    "Solicitud recibida. Revisá el correo del adulto " +
                    "y confirmá la cuenta. No ingreses todavía " +
                    "por el formulario antiguo.",
                    false
                );

                form.reset();

            } catch (error) {
                console.error("[Kiddo] Falló la comunicación con Supabase.");
                mensaje(
                    "No se pudo conectar con Supabase. " +
                    "Comprobá la conexión a Internet.",
                    true
                );
            } finally {
                boton.disabled = false;
                boton.textContent = "Crear cuenta";
            }

        }, true);

        console.info("[Kiddo] Registro Supabase de prueba activado.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();