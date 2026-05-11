const pool = require('../config/db');

const deleteUser = async (req, res) => {
    const { cedula } = req.params;

    if (!cedula) {
        return res.status(400).json({ error: 'La cédula es requerida' });
    }

    try {
        await pool.query('CALL eliminar_usuario($1)', [cedula]);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el usuario' });
    }
};

const editUser = async (req, res) => {
    const { cedula } = req.params;
    const { nombre, apellidos, fecha_nacimiento, telefono, email } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: 'La cédula es requerida' });
    }

    try {
        await pool.query(
            'CALL editar_usuario($1, $2, $3, $4, $5, $6)',
            [cedula, nombre, apellidos, fecha_nacimiento, telefono, email]
        );
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        // Manejar error de correo duplicado si es necesario
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }
        res.status(500).json({ error: 'Error interno del servidor al actualizar el usuario' });
    }
};

module.exports = { deleteUser, editUser };
