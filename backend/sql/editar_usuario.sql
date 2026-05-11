CREATE OR REPLACE PROCEDURE public.editar_usuario(
    IN p_cedula VARCHAR(9),
    IN p_nombre VARCHAR(20),
    IN p_apellidos VARCHAR(40),
    IN p_fecha_nacimiento DATE,
    IN p_telefono VARCHAR(15),
    IN p_email VARCHAR(40)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.usuarios 
    SET 
        nombre = p_nombre,
        apellidos = p_apellidos,
        fecha_nacimiento = p_fecha_nacimiento,
        telefono = p_telefono,
        email = p_email
    WHERE cedula = p_cedula;
END;
$$;
