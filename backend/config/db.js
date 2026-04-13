const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
    if (err) {
        console.error('Error de Autenticación o Conexión:', err.message);
    } else {
        console.log('Conectado exitosamente a PostgreSQL en Supabase');
    }
});

module.exports = pool;