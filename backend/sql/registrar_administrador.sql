CREATE OR REPLACE PROCEDURE public.registrar_administrador(
    IN p_cedula VARCHAR,
    IN p_nombre VARCHAR,
    IN p_apellidos VARCHAR,
    IN p_fecha_nacimiento DATE,
    IN p_telefono VARCHAR,
    IN p_email VARCHAR,
    IN p_password_hash VARCHAR,
    OUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inserción del administrador
    INSERT INTO public.usuarios (
        cedula, 
        nombre, 
        apellidos, 
        fecha_nacimiento, 
        telefono, 
        email, 
        password_hash, 
        rol
    )
    VALUES (
        p_cedula, 
        p_nombre, 
        p_apellidos, 
        p_fecha_nacimiento, 
        p_telefono, 
        p_email, 
        p_password_hash, 
        'administrador'
    );

    
    p_resultado := json_build_object(
        'cedula', p_cedula,
        'nombre', p_nombre,
        'apellidos', p_apellidos,
        'email', p_email,
        'rol', 'administrador'
    );

EXCEPTION 
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar el administrador: %', SQLERRM;
END;
$$;
