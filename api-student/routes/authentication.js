var express = require('express');
var AuthenticationController = require('../controller/AuthenticationController.js');
const authenticate= require('../passport').authenticateUser

var router = express.Router();

router.post('/sign-up',AuthenticationController.signUp);
router.post('/log-in',AuthenticationController.logIn);



module.exports = router