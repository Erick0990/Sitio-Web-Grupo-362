CREATE OR REPLACE FUNCTION obtener_usuario_login(p_email VARCHAR)
RETURNS JSON AS $$
DECLARE
    v_usuario JSON;
BEGIN
    SELECT json_build_object(
        'cedula', u.cedula,
        'nombre', u.nombre,
        'apellidos', u.apellidos,
        'email', u.email,
        'password_hash', u.password_hash,
        'rol', u.rol
    ) INTO v_usuario
    FROM usuarios u
    WHERE u.email = LOWER(TRIM(p_email));

    RETURN v_usuario;
END;
$$ LANGUAGE plpgsql;