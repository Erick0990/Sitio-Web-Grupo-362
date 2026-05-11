CREATE OR REPLACE PROCEDURE public.editar_actividad(
    IN p_id INT,
    IN p_titulo VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_lugar VARCHAR(150),
    IN p_costo NUMERIC(10, 2),
    IN p_tipo public.tipo_actividad
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.actividades
    SET 
        titulo = p_titulo,
        descripcion = p_descripcion,
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin,
        lugar = p_lugar,
        costo = p_costo,
        tipo = p_tipo
    WHERE id = p_id;
END;
$$;
