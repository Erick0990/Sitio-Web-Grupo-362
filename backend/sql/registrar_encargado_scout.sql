CREATE OR REPLACE FUNCTION registrar_encargado_scout(
    p_cedula VARCHAR,
    p_nombre VARCHAR,
    p_apellidos VARCHAR,
    p_fecha_nacimiento DATE,
    p_telefono VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR,
    p_scout_cedula VARCHAR,
    p_scout_nombre VARCHAR,
    p_scout_apellidos VARCHAR,
    p_scout_fecha_nacimiento DATE
)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    
    INSERT INTO usuarios (
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

    
    INSERT INTO scouts (
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

    
    v_resultado := json_build_object(
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

    RETURN v_resultado;

EXCEPTION WHEN OTHERS THEN
    
    RAISE EXCEPTION 'Error al registrar el usuario o el scout: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;