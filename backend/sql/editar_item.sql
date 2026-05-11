CREATE OR REPLACE PROCEDURE public.editar_item(
    IN p_id INTEGER,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_cantidad INTEGER,
    IN p_estado public.estado_inventario
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.inventario
    SET nombre = p_nombre,
        descripcion = p_descripcion,
        cantidad = p_cantidad,
        estado = p_estado
    WHERE id = p_id;
END;
$$;
