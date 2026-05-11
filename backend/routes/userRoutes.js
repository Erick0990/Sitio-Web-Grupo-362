const express = require('express');
const router = express.Router();
const { deleteUser, editUser } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.delete('/:cedula', [verifyToken, isAdmin], deleteUser);
router.put('/:cedula', [verifyToken, isAdmin], editUser);

module.exports = router;
