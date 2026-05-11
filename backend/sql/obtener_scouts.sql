CREATE OR REPLACE PROCEDURE public.obtener_scouts(
    OUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_agg(
        json_build_object(
            'cedula', s.cedula,
            'cedula_encargado', s.cedula_encargado,
            'nombre', s.nombre,
            'apellidos', s.apellidos,
            'fecha_nacimiento', s.fecha_nacimiento,
            'edad', EXTRACT(YEAR FROM AGE(s.fecha_nacimiento)),
            'nombre_encargado', u.nombre || ' ' || u.apellidos
        )
    )
    INTO p_resultado
    FROM public.scouts s
    JOIN public.usuarios u ON s.cedula_encargado = u.cedula;

    IF p_resultado IS NULL THEN
        p_resultado := '[]'::JSON;
    END IF;
END;
$$;
