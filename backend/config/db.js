const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
    poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.connect((err) => {
    if (err) {
        console.error('Error de Autenticación o Conexión:', err.message);
    } else {
        console.log('Conectado exitosamente a PostgreSQL');
    }
});

module.exports = pool;