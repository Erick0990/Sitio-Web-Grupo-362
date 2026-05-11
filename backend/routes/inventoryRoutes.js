const express = require('express');
const router = express.Router();
const {
    getInventory,
    addInventoryItem,
    editInventoryItem,
    updateInventoryQuantity,
    deleteInventoryItem
} = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.put('/:id', editInventoryItem);
router.patch('/:id/cantidad', updateInventoryQuantity);
router.delete('/:id', deleteInventoryItem);

module.exports = router;
