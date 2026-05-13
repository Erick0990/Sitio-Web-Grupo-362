const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const getInfoRoutes = require('./routes/getInfoRoutes');
const userRoutes = require('./routes/userRoutes');
const scoutRoutes = require('./routes/scoutRoutes');
const financeRoutes = require('./routes/financeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/getinfo', getInfoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scouts', scoutRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});