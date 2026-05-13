const pool = require('../config/db');

// Obtener todo el inventario
const getInventory = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_inventario(null)');
        const data = result.rows[0]?.p_resultado || [];
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in getInventory:', error);
        res.status(500).json({ error: 'Error interno del servidor al cargar inventario' });
    }
};

// Registrar un nuevo ítem
const addInventoryItem = async (req, res) => {
    try {
        // 1. Verificamos si req.body es un arreglo; si no lo es, lo convertimos en uno de un solo elemento
        const items = Array.isArray(req.body) ? req.body : [req.body];

        // 2. Recorremos el arreglo y procesamos cada ítem
        for (const item of items) {
            const { nombre, descripcion, cantidad, estado } = item;

            // Validación por cada ítem
            if (!nombre || cantidad === undefined) {
                return res.status(400).json({ error: 'El nombre y la cantidad son requeridos en uno o más ítems' });
            }

            // Inserción en la base de datos
            await pool.query('CALL registrar_item($1, $2, $3, $4)', [
                nombre,
                descripcion ? descripcion : null,
                parseInt(cantidad),
                estado || 'Bueno'
            ]);
        }

        // 3. Respuesta exitosa una vez que termine el ciclo
        res.status(201).json({ message: 'Ítem(s) registrado(s) exitosamente' });

    } catch (error) {
        console.error('Error in addInventoryItem:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar ítem(s)' });
    }
};

// Editar un ítem completamente
const editInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, cantidad, estado } = req.body;

        if (!id || !nombre || cantidad === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        await pool.query(
            'CALL editar_item($1::INT, $2, $3, $4::INT, $5)',
            [parseInt(id), nombre, descripcion ? descripcion : null, parseInt(cantidad), estado || 'Bueno']
        );
        res.status(200).json({ message: 'Ítem actualizado exitosamente' });
    } catch (error) {
        console.error('Error in editInventoryItem:', error);
        res.status(500).json({ error: 'Error interno del servidor al editar ítem' });
    }
};

// Actualizar cantidad (edición rápida)
const updateInventoryQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad_cambio } = req.body;

        if (!id || cantidad_cambio === undefined) {
            return res.status(400).json({ error: 'La cantidad a sumar o restar es requerida' });
        }

        await pool.query(
            'CALL actualizar_cantidad_item($1::INT, $2::INT)',
            [parseInt(id), parseInt(cantidad_cambio)]
        );
        res.status(200).json({ message: 'Cantidad actualizada exitosamente' });
    } catch (error) {
        console.error('Error in updateInventoryQuantity:', error);
        res.status(500).json({ error: 'Error al actualizar cantidad (probablemente intentaste bajar de cero)' });
    }
};

// Eliminar un ítem
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'El ID es requerido' });
        }

        await pool.query('CALL eliminar_item($1::INT)', [parseInt(id)]);
        res.status(200).json({ message: 'Ítem eliminado exitosamente' });
    } catch (error) {
        console.error('Error in deleteInventoryItem:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar ítem' });
    }
};

module.exports = {
    getInventory,
    addInventoryItem,
    editInventoryItem,
    updateInventoryQuantity,
    deleteInventoryItem
};
