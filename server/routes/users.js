var express = require('express');
var router = express.Router();
const {updateUser, deleteUser, registerUser, verifyUser, loginUser, forgotPassword, resetPassword, getUsers, getUser} =  require('../controller/user')

router.post('/register', registerUser);
router.get('/verifyUser', verifyUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/list', getUsers);
router.get('/list/:id', getUser);
router.put('/list/:id', updateUser);
router.delete('/list/:id', deleteUser);

module.exports = router;
