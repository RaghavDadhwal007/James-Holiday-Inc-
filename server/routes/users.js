var express = require('express');
var router = express.Router();
const {registerUser, verifyUser, loginUser, forgotPassword, resetPassword} =  require('../controller/user')

router.post('/register', registerUser);
router.get('/verifyUser', verifyUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
