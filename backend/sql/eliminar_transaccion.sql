CREATE OR REPLACE PROCEDURE public.eliminar_transaccion(
    IN p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.finanzas WHERE id = p_id;
END;
$$;
