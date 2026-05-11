const pool = require('../config/db');

const getFinances = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_finanzas(null)');
        const finances = result.rows[0].p_resultado || [];
        res.status(200).json(finances);
    } catch (error) {
        console.error('Error al obtener finanzas:', error);
        res.status(500).json({ error: 'Error interno del servidor al cargar finanzas' });
    }
};

const addFinance = async (req, res) => {
    const { concepto, tipo, monto, encargado_cedula } = req.body;

    if (!concepto || !tipo || !monto || !encargado_cedula) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (tipo !== 'ingreso' && tipo !== 'gasto') {
        return res.status(400).json({ error: 'El tipo debe ser ingreso o gasto' });
    }

    try {
        await pool.query('CALL registrar_transaccion($1, $2, $3, $4)', [
            concepto, tipo, monto, encargado_cedula
        ]);
        res.status(201).json({ message: 'Transacción registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar transacción' });
    }
};

const deleteFinance = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El ID es requerido' });
    }

    try {
        await pool.query('CALL eliminar_transaccion($1::INT)', [id]);
        res.status(200).json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar transacción' });
    }
};

module.exports = { getFinances, addFinance, deleteFinance };
