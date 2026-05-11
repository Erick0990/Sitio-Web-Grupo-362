CREATE OR REPLACE PROCEDURE public.editar_scout(
    IN p_cedula VARCHAR(9),
    IN p_nombre VARCHAR(20),
    IN p_apellidos VARCHAR(40),
    IN p_fecha_nacimiento DATE,
    IN p_cedula_encargado VARCHAR(9)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.scouts 
    SET 
        nombre = p_nombre,
        apellidos = p_apellidos,
        fecha_nacimiento = p_fecha_nacimiento,
        cedula_encargado = p_cedula_encargado
    WHERE cedula = p_cedula;
END;
$$;
