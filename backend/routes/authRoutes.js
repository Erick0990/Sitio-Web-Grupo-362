const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/login', login);

router.get('/perfil', verifyToken, (req, res) => {
    res.json({ message: 'Datos privados del usuario', user: req.user });
});

router.post('/admin/crearAdmin', [verifyToken, isAdmin], (req, res) => {
    res.json({ message: 'Solo un admin puede ver esto' });
});

module.exports = router;