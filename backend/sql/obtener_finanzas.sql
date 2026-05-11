CREATE OR REPLACE PROCEDURE public.obtener_finanzas(
    INOUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', f.id,
            'concepto', f.concepto,
            'tipo', f.tipo,
            'monto', f.monto,
            'fecha', f.fecha,
            'encargado_cedula', f.encargado_cedula,
            'nombre_encargado', COALESCE(u.nombre || ' ' || u.apellidos, 'Desconocido')
        ) ORDER BY f.fecha DESC
    )
    INTO p_resultado
    FROM public.finanzas f
    LEFT JOIN public.usuarios u ON f.encargado_cedula = u.cedula;

    IF p_resultado IS NULL THEN
        p_resultado := '[]'::JSON;
    END IF;
END;
$$;
