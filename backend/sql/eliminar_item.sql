CREATE OR REPLACE PROCEDURE public.eliminar_item(
    IN p_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM public.inventario WHERE id = p_id;
END;
$$;
