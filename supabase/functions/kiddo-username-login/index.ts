import { createClient } from "npm:@supabase/supabase-js@2";

const url = Deno.env.get("SUPABASE_URL")!;

const secretKey =
  JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default ||
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const publicKey =
  JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}").default ||
  Deno.env.get("SUPABASE_ANON_KEY");

if (!url || !secretKey || !publicKey) {
  throw new Error("Configuracion de Supabase incompleta");
}

const admin = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const authClient = createClient(url, publicKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const invalidCredentials = "Usuario o contraseña incorrectos.";

function reply(
  data: Record<string, unknown>,
  status: number,
  origin: string
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    }
  });
}

async function hashUsername(username: string): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("kiddo-login:" + username)
  );

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  const allowed =
    origin === "http://localhost:8765" ||
    origin === "http://127.0.0.1:8765";

  if (!allowed) {
    return new Response("Origen no permitido", { status: 403 });
  }

  if (req.method === "OPTIONS") {
    return reply({}, 204, origin);
  }

  if (req.method !== "POST") {
    return reply({ error: "Metodo no permitido" }, 405, origin);
  }

  try {
    const raw = await req.text();

    if (raw.length > 4096) {
      return reply({ error: "Solicitud demasiado grande" }, 413, origin);
    }

    const body = JSON.parse(raw);
    const username = String(body.username || "").trim().toLowerCase();
    const password = body.password;

    if (
      username.length < 6 ||
      username.length > 32 ||
      !/^[a-z0-9._!@#$%&*+=?-]+$/.test(username) ||
      typeof password !== "string" ||
      password.length < 1 ||
      password.length > 1024
    ) {
      return reply({ error: invalidCredentials }, 401, origin);
    }

    // El limite se verifica antes de buscar el usuario.
    const bucketHash = await hashUsername(username);

    const { data: allowedAttempt, error: limitError } =
      await admin.rpc("kiddo_check_login_limit", {
        p_bucket_hash: bucketHash
      });

    if (limitError) {
      console.error("[Kiddo] Error de limite de intentos");
      return reply({ error: "Servicio temporalmente no disponible" }, 503, origin);
    }

    if (allowedAttempt !== true) {
      return reply({
        error: "Demasiados intentos. Intenta nuevamente en 15 minutos."
      }, 429, origin);
    }

    const { data: profile, error: profileError } = await admin
      .from("kiddo_profiles")
      .select("user_id")
      .ilike("username", username)
      .maybeSingle();

    if (profileError || !profile) {
      return reply({ error: invalidCredentials }, 401, origin);
    }

    const { data: userData, error: userError } =
      await admin.auth.admin.getUserById(profile.user_id);

    const email = userData?.user?.email;

    if (userError || !email) {
      return reply({ error: invalidCredentials }, 401, origin);
    }

    const { data: auth, error: authError } =
      await authClient.auth.signInWithPassword({
        email,
        password
      });

    if (
      authError ||
      !auth.session?.access_token ||
      !auth.session?.refresh_token
    ) {
      return reply({ error: invalidCredentials }, 401, origin);
    }

    return reply({
      access_token: auth.session.access_token,
      refresh_token: auth.session.refresh_token
    }, 200, origin);

  } catch (_) {
    return reply({ error: invalidCredentials }, 401, origin);
  }
});