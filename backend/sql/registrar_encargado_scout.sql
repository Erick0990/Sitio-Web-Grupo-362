CREATE OR REPLACE PROCEDURE public.registrar_encargado_scout(
    IN p_cedula VARCHAR,
    IN p_nombre VARCHAR,
    IN p_apellidos VARCHAR,
    IN p_fecha_nacimiento DATE,
    IN p_telefono VARCHAR,
    IN p_email VARCHAR,
    IN p_password_hash VARCHAR,
    IN p_scout_cedula VARCHAR,
    IN p_scout_nombre VARCHAR,
    IN p_scout_apellidos VARCHAR,
    IN p_scout_fecha_nacimiento DATE,
    OUT p_resultado JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Inserción del encargado (usuario)
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
        'encargado' 
    );

    -- 2. Inserción del scout vinculado
    INSERT INTO public.scouts (
        cedula, 
        cedula_encargado, 
        nombre, 
        apellidos, 
        fecha_nacimiento
    )
    VALUES (
        p_scout_cedula, 
        p_cedula, 
        p_scout_nombre, 
        p_scout_apellidos, 
        p_scout_fecha_nacimiento
    );

    -- 3. Construcción del JSON de respuesta (se asigna directo al parámetro OUT)
    p_resultado := json_build_object(
        'status', 'success',
        'encargado', json_build_object(
            'cedula', p_cedula,
            'nombre', p_nombre,
            'apellidos', p_apellidos,
            'email', p_email,
            'rol', 'encargado'
        ),
        'scout', json_build_object(
            'cedula', p_scout_cedula,
            'nombre', p_scout_nombre,
            'apellidos', p_scout_apellidos
        )
    );

EXCEPTION 
    WHEN OTHERS THEN
        -- Si hay un error, se hace un rollback implícito de ambos INSERTS y se lanza el error
        RAISE EXCEPTION 'Error al registrar el usuario o el scout: %', SQLERRM;
END;
$$;