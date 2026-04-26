CREATE OR REPLACE PROCEDURE obtener_usuario_login(
    IN p_email VARCHAR,
    OUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT json_build_object(
        'cedula', u.cedula,
        'nombre', u.nombre,
        'apellidos', u.apellidos,
        'email', u.email,
        'password_hash', u.password_hash,
        'rol', u.rol
    ) INTO p_resultado
    FROM public.usuarios u
    WHERE u.email = LOWER(TRIM(p_email));
END;
$$;