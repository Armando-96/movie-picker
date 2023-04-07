const express = require('express');
const controller = require('./controller');
const router = express.Router();
//Il path di questo router è /api/db

router.get('/users', controller.getUsers);



module.exports = router;