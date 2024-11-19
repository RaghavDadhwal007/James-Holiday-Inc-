const express = require('express');
const bookingController = require('../controller/bookingController');
const router = express.Router();

router.get('/', bookingController.list);
router.put('/:id', bookingController.updateBooking);

module.exports = router;
