CREATE OR REPLACE PROCEDURE public.eliminar_actividad(
    IN p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.actividades WHERE id = p_id;
END;
$$;
