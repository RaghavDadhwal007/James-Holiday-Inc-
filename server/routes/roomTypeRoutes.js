const express = require('express');
const roomTypeController = require('../controller/roomTypeController');
const router = express.Router();

router.post('/', roomTypeController.createRoomType);
router.get('/', roomTypeController.getRoomTypes);
router.get('/:id', roomTypeController.getRoomTypeById);
router.put('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
