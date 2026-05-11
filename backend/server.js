const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const getInfoRoutes = require('./routes/getInfoRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/getinfo', getInfoRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/scouts', require('./routes/scoutRoutes'));
app.use('/api/finances', require('./routes/financeRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});