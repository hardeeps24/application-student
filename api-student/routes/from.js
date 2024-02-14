var express = require('express');
var FormController = require('../controller/FormController.js');
const authenticate= require('../passport').authenticateUser

var router = express.Router();

router.post('/new-student',FormController.newStudent);
router.get('/student-data',FormController.studentData);
 
module.exports = router