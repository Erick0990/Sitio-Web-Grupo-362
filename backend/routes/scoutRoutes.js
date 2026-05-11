const express = require('express');
const router = express.Router();
const { getScouts, deleteScout, editScout } = require('../controllers/scoutController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', [verifyToken, isAdmin], getScouts);
router.delete('/:cedula', [verifyToken, isAdmin], deleteScout);
router.put('/:cedula', [verifyToken, isAdmin], editScout);

module.exports = router;
