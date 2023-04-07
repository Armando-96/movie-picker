const express = require('express');
const controller = require('./controller');
const router = express.Router();
//Il path di questo router è /api/db

router.get('/users', controller.getUsers);
router.get('/sessions', controller.getSessions);
router.get('/interactions', controller.getInteractions);
router.get('/all', controller.getAll);
router.get('/users/:id', controller.getUserById);

router.post('/users', controller.createUser);

module.exports = router;