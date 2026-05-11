DROP FUNCTION IF EXISTS public.obtener_inventario();

CREATE OR REPLACE PROCEDURE public.obtener_inventario(
    INOUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', id,
            'nombre', nombre,
            'descripcion', descripcion,
            'cantidad', cantidad,
            'estado', estado,
            'created_at', created_at
        ) ORDER BY id DESC
    )
    INTO p_resultado
    FROM public.inventario;

    IF p_resultado IS NULL THEN
        p_resultado := '[]'::JSON;
    END IF;
END;
$$;
