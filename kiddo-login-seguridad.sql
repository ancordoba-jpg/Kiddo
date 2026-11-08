CREATE TABLE IF NOT EXISTS public.kiddo_login_limits (
    bucket_hash text PRIMARY KEY,
    attempts integer NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kiddo_login_limits
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.kiddo_login_limits
FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.kiddo_check_login_limit(
    p_bucket_hash text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_attempts integer;
BEGIN
    IF p_bucket_hash IS NULL
       OR length(p_bucket_hash) != 64
       OR p_bucket_hash !~ '^[0-9a-f]{64}$'
    THEN
        RETURN false;
    END IF;

    INSERT INTO public.kiddo_login_limits
        (bucket_hash, attempts, window_start)
    VALUES
        (p_bucket_hash, 1, now())
    ON CONFLICT (bucket_hash)
    DO UPDATE SET
        attempts =
            CASE
                WHEN public.kiddo_login_limits.window_start
                     < now() - interval '15 minutes'
                THEN 1
                ELSE public.kiddo_login_limits.attempts + 1
            END,
        window_start =
            CASE
                WHEN public.kiddo_login_limits.window_start
                     < now() - interval '15 minutes'
                THEN now()
                ELSE public.kiddo_login_limits.window_start
            END
    RETURNING attempts INTO v_attempts;

    RETURN v_attempts <= 8;
END;
$$;

REVOKE ALL ON FUNCTION
public.kiddo_check_login_limit(text)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
public.kiddo_check_login_limit(text)
TO service_role;