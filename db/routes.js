const express = require('express');
const controller = require('./controller');
const router = express.Router();
//Il path di questo router è /api/db
//api per gli sviluppatori
router.get('/users', controller.getUsers);                  //Restituisce tutte le tuple della tabella users
router.get('/sessions', controller.getSessions);            //Restituisce tutte le tuple della tabella sessions
router.get('/interactions', controller.getInteractions);    //Restituisce tutte le tuple della tabella interaction
router.get('/all', controller.getAll);                      //Restituisce tutte le tuple delle tabelle users, sessions e interaction
router.get('/users/:id', controller.getUserById);           //Restituisce la tupla con id = :id della tabella users

router.post('/users', controller.createUser);               //Crea una nuova tupla nella tabella users


module.exports = router;