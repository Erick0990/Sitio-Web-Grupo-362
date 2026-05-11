CREATE OR REPLACE PROCEDURE public.eliminar_scout(
    IN p_cedula VARCHAR(9)
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.scouts WHERE cedula = p_cedula;
END;
$$;
