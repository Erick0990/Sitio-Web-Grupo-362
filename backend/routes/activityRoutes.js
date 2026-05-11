const express = require('express');
const router = express.Router();
const { getActivities, addActivity, editActivity, deleteActivity } = require('../controllers/activityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', [verifyToken, isAdmin], getActivities);
router.post('/', [verifyToken, isAdmin], addActivity);
router.put('/:id', [verifyToken, isAdmin], editActivity);
router.delete('/:id', [verifyToken, isAdmin], deleteActivity);

module.exports = router;
