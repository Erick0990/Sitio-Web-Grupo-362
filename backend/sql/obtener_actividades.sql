CREATE OR REPLACE PROCEDURE public.obtener_actividades(
    INOUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', a.id,
            'titulo', a.titulo,
            'descripcion', a.descripcion,
            'fecha_inicio', a.fecha_inicio,
            'fecha_fin', a.fecha_fin,
            'lugar', a.lugar,
            'costo', a.costo,
            'tipo', a.tipo,
            'created_at', a.created_at
        ) ORDER BY a.fecha_inicio ASC
    )
    INTO p_resultado
    FROM public.actividades a;

    IF p_resultado IS NULL THEN
        p_resultado := '[]'::JSON;
    END IF;
END;
$$;
