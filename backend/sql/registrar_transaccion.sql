CREATE OR REPLACE PROCEDURE public.registrar_transaccion(
    IN p_concepto VARCHAR(100),
    IN p_tipo public.tipo_transaccion,
    IN p_monto NUMERIC(10, 2),
    IN p_encargado_cedula VARCHAR(9)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.finanzas (concepto, tipo, monto, encargado_cedula)
    VALUES (p_concepto, p_tipo, p_monto, p_encargado_cedula);
END;
$$;
