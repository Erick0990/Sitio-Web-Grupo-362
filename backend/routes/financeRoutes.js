const express = require('express');
const router = express.Router();
const { getFinances, addFinance, deleteFinance } = require('../controllers/financeController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', [verifyToken, isAdmin], getFinances);
router.post('/', [verifyToken, isAdmin], addFinance);
router.delete('/:id', [verifyToken, isAdmin], deleteFinance);

module.exports = router;
