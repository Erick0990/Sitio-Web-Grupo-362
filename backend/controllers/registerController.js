const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
    const {
        cedula, nombre, apellidos, fecha_nacimiento,
        telefono, email, password,
        scout_cedula, scout_nombre, scout_apellidos, scout_fecha_nacimiento
    } = req.body;


    if (!cedula || !nombre || !apellidos || !fecha_nacimiento || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios del encargado' });
    }
    if (!scout_cedula || !scout_nombre || !scout_apellidos || !scout_fecha_nacimiento) {
        return res.status(400).json({ error: 'Faltan campos obligatorios del scout' });
    }

    try {
        // 2. Limpieza de cédulas 
        const cleanCedula = cedula.replace(/\D/g, '');
        const cleanScoutCedula = scout_cedula.replace(/\D/g, '');

        // 3. Encriptación de contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Llamada a la función PostgreSQL
        const result = await pool.query(
            `CALL registrar_encargado_scout(
                $1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::DATE, 
                $5::VARCHAR, $6::VARCHAR, $7::VARCHAR, 
                $8::VARCHAR, $9::VARCHAR, $10::VARCHAR, $11::DATE, $12::JSON
            )`,
            [
                cleanCedula, nombre, apellidos, fecha_nacimiento,
                telefono || null, email, password_hash,
                cleanScoutCedula, scout_nombre, scout_apellidos, scout_fecha_nacimiento, null
            ]
        );

        const data = result.rows[0].p_resultado;

        const token = jwt.sign(
            {
                cedula: data.encargado.cedula,
                email: data.encargado.email,
                rol: data.encargado.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 6. Respuesta al cliente
        res.status(201).json({
            message: 'Registro exitoso',
            token,
            encargado: data.encargado,
            scout: data.scout
        });

    } catch (error) {
        console.error('Error en registro:', error);

        if (error.code === '23505') {
            if (error.detail?.includes('cedula')) {
                return res.status(409).json({ error: 'La cédula ya se encuentra registrada' });
            }
            if (error.detail?.includes('email')) {
                return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
            }
        }

        if (error.code === '23514') {
            return res.status(400).json({ error: 'Formato de cédula inválido (debe ser numérico y máximo 12 dígitos)' });
        }

        res.status(500).json({ error: 'Error interno del servidor al procesar el registro' });
    }
};

const registerAdmin = async (req, res) => {
    const { cedula, nombre, apellidos, fecha_nacimiento, telefono, email, password } = req.body;

    if (!cedula || !nombre || !apellidos || !fecha_nacimiento || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const cleanCedula = cedula.replace(/\D/g, '');
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = await pool.query(
            `CALL registrar_administrador(
                $1::VARCHAR, $2::VARCHAR, $3::VARCHAR, $4::DATE, 
                $5::VARCHAR, $6::VARCHAR, $7::VARCHAR, $8::JSON
            )`,
            [
                cleanCedula, nombre, apellidos, fecha_nacimiento,
                telefono || null, email, password_hash, null
            ]
        );

        res.status(201).json({
            message: 'Administrador registrado exitosamente',
            admin: result.rows[0].p_resultado
        });

    } catch (error) {
        console.error('Error en registro admin:', error);

        if (error.code === '23505') {
            if (error.detail?.includes('cedula')) {
                return res.status(409).json({ error: 'La cédula ya se encuentra registrada' });
            }
            if (error.detail?.includes('email')) {
                return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
            }
        }

        if (error.code === '23514') {
            return res.status(400).json({ error: 'Formato de cédula inválido' });
        }

        res.status(500).json({ error: 'Error interno del servidor al procesar el registro' });
    }
};

module.exports = { register, registerAdmin };
