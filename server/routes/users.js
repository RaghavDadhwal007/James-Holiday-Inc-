var express = require('express');
var router = express.Router();
const {registerUser, verifyUser, loginUser, forgotPassword, resetPassword, getUsers} =  require('../controller/user')

router.post('/register', registerUser);
router.get('/verifyUser', verifyUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/list', getUsers);

module.exports = router;
