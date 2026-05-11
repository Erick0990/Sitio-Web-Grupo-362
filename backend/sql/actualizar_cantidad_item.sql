DROP FUNCTION IF EXISTS public.actualizar_cantidad_item(INTEGER, INTEGER);

CREATE OR REPLACE PROCEDURE public.actualizar_cantidad_item(
    IN p_id INTEGER,
    IN p_cantidad_cambio INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_nueva_cantidad INTEGER;
BEGIN
    UPDATE public.inventario
    SET cantidad = cantidad + p_cantidad_cambio
    WHERE id = p_id
    RETURNING cantidad INTO v_nueva_cantidad;

    IF v_nueva_cantidad < 0 THEN
        RAISE EXCEPTION 'La cantidad no puede ser menor a 0';
    END IF;
END;
$$;
