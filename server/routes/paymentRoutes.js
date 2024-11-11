const express = require('express');
const paymentController = require('../controller/paymentController');
const router = express.Router();

router.post('/', paymentController.payment);
router.post('/confirm-payment', paymentController.confirmPayment);

module.exports = router;
