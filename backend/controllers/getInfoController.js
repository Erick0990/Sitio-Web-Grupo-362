
const pool = require('../config/db');
require('dotenv').config();

const getAdmins = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_administradores($1::JSON)', [null]);
        const admins = result.rows[0].p_resultado;
        //console.log(admins);
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getEncargados = async (req, res) => {
    try {
        const result = await pool.query('CALL obtener_encargados($1::JSON)', [null]);
        const encargados = result.rows[0].p_resultado;
        //console.log(encargados);

        res.status(200).json(encargados);
    } catch (error) {
        //console.error('Error al obtener encargados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getAdmins, getEncargados };
