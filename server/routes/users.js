var express = require('express');
var router = express.Router();
const {registerUser} =  require('../controller/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', registerUser);

module.exports = router;
