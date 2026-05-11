CREATE OR REPLACE PROCEDURE public.registrar_actividad(
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
    INSERT INTO public.actividades (titulo, descripcion, fecha_inicio, fecha_fin, lugar, costo, tipo)
    VALUES (p_titulo, p_descripcion, p_fecha_inicio, p_fecha_fin, p_lugar, p_costo, p_tipo);
END;
$$;
