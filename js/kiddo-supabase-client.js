(function () {
    "use strict";

    const config = window.KIDDO_SUPABASE_CONFIG;

    if (!config || !config.url || !config.publishableKey) {
        console.error("[Kiddo] Falta la configuracion de Supabase.");
        return;
    }

    if (!window.supabase || !window.supabase.createClient) {
        console.error("[Kiddo] No se cargo la biblioteca de Supabase.");
        return;
    }

    try {
        window.kiddoSupabase = window.supabase.createClient(
            config.url,
            config.publishableKey,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

        console.info("[Kiddo] Cliente Supabase inicializado.");
    } catch (error) {
        console.error("[Kiddo] Error al inicializar Supabase:", error);
    }
})();