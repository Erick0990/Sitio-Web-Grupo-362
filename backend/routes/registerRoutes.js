const express = require('express');
const router = express.Router();
const { register, registerAdmin } = require('../controllers/registerController');

router.post('/registerUser', register);
router.post('/registerAdmin', registerAdmin);

module.exports = router;