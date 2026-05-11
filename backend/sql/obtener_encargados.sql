CREATE OR REPLACE PROCEDURE public.obtener_encargados(
    OUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_agg(
        json_build_object(
            'cedula', u.cedula,
            'nombre', u.nombre,
            'apellidos', u.apellidos,
            'fecha_nacimiento', u.fecha_nacimiento,
            'telefono', u.telefono,
            'email', u.email,
            'rol', u.rol,
            'creado_en', u.creado_en
        )
    ) INTO p_resultado
    FROM (
        SELECT * 
        FROM public.usuarios 
        WHERE rol = 'encargado' 
        ORDER BY creado_en DESC
    ) u;

    IF p_resultado IS NULL THEN
        p_resultado := '[]'::JSON;
    END IF;
END;
$$;
