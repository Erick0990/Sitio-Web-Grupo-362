CREATE OR REPLACE PROCEDURE public.eliminar_usuario(
    IN p_cedula VARCHAR(9)
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.usuarios WHERE cedula = p_cedula;
END;
$$;
