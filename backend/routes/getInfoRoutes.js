const express = require('express');
const router = express.Router();
const { getAdmins, getEncargados } = require('../controllers/getInfoController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/admins', [verifyToken, isAdmin], getAdmins);
router.get('/encargados', [verifyToken, isAdmin], getEncargados);

module.exports = router;
