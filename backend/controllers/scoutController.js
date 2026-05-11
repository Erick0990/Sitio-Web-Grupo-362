const pool = require('../config/db');

const getScouts = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_scouts($1::JSON)', [null]);
        const scouts = result.rows[0].p_resultado || [];
        //console.log(scouts);
        res.status(200).json(scouts);
    } catch (error) {
        console.error('Error al obtener scouts:', error);
        res.status(500).json({ error: 'Error interno del servidor al cargar scouts' });
    }
};

const deleteScout = async (req, res) => {
    const { cedula } = req.params;

    if (!cedula) {
        return res.status(400).json({ error: 'La cédula es requerida' });
    }

    try {
        await pool.query('CALL eliminar_scout($1)', [cedula]);
        res.status(200).json({ message: 'Scout eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar scout:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el scout' });
    }
};

const editScout = async (req, res) => {
    const { cedula } = req.params;
    const { nombre, apellidos, fecha_nacimiento, cedula_encargado } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: 'La cédula del scout es requerida' });
    }

    try {
        await pool.query(
            'CALL editar_scout($1, $2, $3, $4, $5)',
            [cedula, nombre, apellidos, fecha_nacimiento, cedula_encargado]
        );
        res.status(200).json({ message: 'Scout actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar scout:', error);
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ error: 'La cédula del encargado no existe en el sistema' });
        }
        res.status(500).json({ error: 'Error interno del servidor al actualizar el scout' });
    }
};

module.exports = { getScouts, deleteScout, editScout };
