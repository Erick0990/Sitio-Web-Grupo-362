CREATE OR REPLACE PROCEDURE public.registrar_item(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_cantidad INTEGER,
    IN p_estado public.estado_inventario
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.inventario (nombre, descripcion, cantidad, estado)
    VALUES (p_nombre, p_descripcion, p_cantidad, p_estado);
END;
$$;
