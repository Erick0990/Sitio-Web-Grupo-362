const pool = require('../config/db');

const getActivities = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_actividades(null)');
        const activities = result.rows[0].p_resultado || [];
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: 'Error interno del servidor al cargar actividades' });
    }
};

const addActivity = async (req, res) => {
    const { titulo, descripcion, fecha_inicio, fecha_fin, lugar, costo, tipo } = req.body;

    if (!titulo || !fecha_inicio || !fecha_fin || !tipo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        await pool.query('CALL registrar_actividad($1, $2, $3, $4, $5, $6, $7)', [
            titulo, descripcion || '', fecha_inicio, fecha_fin, lugar || '', costo || 0, tipo
        ]);
        res.status(201).json({ message: 'Actividad registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar actividad' });
    }
};

const editActivity = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha_inicio, fecha_fin, lugar, costo, tipo } = req.body;

    if (!id || !titulo || !fecha_inicio || !fecha_fin || !tipo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        await pool.query('CALL editar_actividad($1::INT, $2, $3, $4, $5, $6, $7, $8)', [
            id, titulo, descripcion || '', fecha_inicio, fecha_fin, lugar || '', costo || 0, tipo
        ]);
        res.status(200).json({ message: 'Actividad editada exitosamente' });
    } catch (error) {
        console.error('Error al editar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor al editar actividad' });
    }
};

const deleteActivity = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El ID es requerido' });
    }

    try {
        await pool.query('CALL eliminar_actividad($1::INT)', [id]);
        res.status(200).json({ message: 'Actividad eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar actividad' });
    }
};

module.exports = { getActivities, addActivity, editActivity, deleteActivity };
